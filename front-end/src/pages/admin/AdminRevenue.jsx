import { useEffect, useState } from "react";
import api from "../../config/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

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

  return (
    <div className="space-y-5">
      <div className="panel-shell">
        <h2 className="text-2xl font-semibold text-slate-800">Thống kê doanh thu</h2>
        <p className="mt-1 text-sm text-slate-500">Theo dõi tổng doanh thu và biến động theo ngày.</p>
      </div>

      <div className="card-soft">
        <p className="text-sm uppercase tracking-wide text-slate-500">Tổng doanh thu</p>
        <h2 className="mt-1 text-3xl font-semibold text-emerald-600">
          {Number(total).toLocaleString("vi-VN")} VND
        </h2>
      </div>

      <div className="card-soft min-w-0">
        <h4 className="text-lg font-semibold text-slate-800">Doanh thu theo ngày</h4>
        <div className="mt-4 h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-soft">
        <h4 className="text-lg font-semibold text-slate-800">Bảng doanh thu</h4>

        <div className="table-wrap mt-3">
        <table className="w-full">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-3 text-left">Ngày</th>
              <th className="p-3 text-left">Doanh thu</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t border-slate-100 text-sm">
                <td className="p-3 text-slate-700">{item.date}</td>
                <td className="p-3 font-medium text-slate-800">
                  {Number(item.revenue).toLocaleString("vi-VN")} VND
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