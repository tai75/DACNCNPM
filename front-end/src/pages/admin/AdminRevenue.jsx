import { useEffect, useState } from "react";
import api from "../../config/axios";
import {
  Bar,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Wallet } from "lucide-react";

const formatDateDDMMYYYY = (isoString) => {
  if (!isoString) return "--/--/----";

  const [rawDatePart] = String(isoString).split("T");
  const parts = rawDatePart.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "--/--/----";
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

const formatCurrencyVND = (value) => `${Number(value || 0).toLocaleString("vi-VN")} VNĐ`;

function AdminRevenue() {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  /* ======================
      FETCH TOTAL
  ====================== */
  const fetchTotal = async () => {
    try {
      const res = await api.get("/revenue");
      setTotal(res.data.total_revenue || 0);
    } catch (err) {
      console.error("Lỗi total revenue:", err);
    }
  };

  /* ======================
      FETCH BY DATE
  ====================== */
  const fetchByDate = async () => {
    try {
      const res = await api.get("/revenue/by-date");
      setData(res.data);
    } catch (err) {
      console.error("Lỗi revenue by date:", err);
    }
  };

  useEffect(() => {
    fetchTotal();
    fetchByDate();
  }, []);

  const chartData = data.map((item) => ({
    ...item,
    displayDate: formatDateDDMMYYYY(item.date),
    revenue: Number(item.revenue || 0),
  }));

  return (
    <div className="space-y-8">
      <div className="panel-shell rounded-2xl px-5 py-4 md:px-6 md:py-5">
        <h2 className="text-2xl font-semibold text-slate-800">Thống kê doanh thu</h2>
        <p className="mt-1 text-sm text-slate-500">Theo dõi tổng doanh thu và biến động theo ngày.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] md:p-6">
        <p className="text-sm uppercase tracking-wide text-slate-500">Tổng doanh thu</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Wallet className="h-5 w-5" />
          </div>
          <h2 className="text-3xl font-semibold text-emerald-700">{formatCurrencyVND(total)}</h2>
        </div>
      </div>

      <div className="card-soft min-w-0">
        <h4 className="text-lg font-semibold text-slate-800">Bảng thống kê doanh thu</h4>
        {chartData.length > 0 ? (
          <div className="mt-4 h-80 min-h-[320px] w-full min-w-0">
            <ResponsiveContainer width="99%" height={300} minWidth={0} minHeight={280}>
              <ComposedChart data={chartData} margin={{ top: 10, right: 18, left: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardRevenueBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="dashboardRevenueArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="displayDate" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => Number(value).toLocaleString("vi-VN")} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => formatCurrencyVND(value)}
                  labelFormatter={(label) => `Ngày: ${label}`}
                  contentStyle={{ borderRadius: "10px", border: "1px solid #dbe7df" }}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" fill="url(#dashboardRevenueArea)" stroke="transparent" name="Xu hướng" />
                <Bar dataKey="revenue" fill="url(#dashboardRevenueBar)" radius={[10, 10, 0, 0]} name="Doanh thu" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            Chưa có dữ liệu doanh thu để hiển thị biểu đồ.
          </div>
        )}
      </div>

      <div className="card-soft">
        <h4 className="text-lg font-semibold text-slate-800">Bảng doanh thu</h4>

        <div className="table-wrap mt-3">
        <table className="w-full">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-3 text-left align-middle">Ngày</th>
              <th className="p-3 text-right align-middle">Doanh thu</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t border-slate-100 text-sm">
                <td className="p-3 align-middle text-slate-700">{formatDateDDMMYYYY(item.date)}</td>
                <td className="p-3 align-middle text-right font-medium text-slate-800">
                  {formatCurrencyVND(item.revenue)}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="2" className="p-8 text-center text-slate-500">
                  Chưa có dữ liệu doanh thu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default AdminRevenue;