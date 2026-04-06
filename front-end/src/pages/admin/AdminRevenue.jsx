import { useEffect, useState } from "react";
<<<<<<< HEAD
import api from "../../config/axios";
=======
import axios from "axios";
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
<<<<<<< HEAD
  ResponsiveContainer,
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
} from "recharts";

function AdminRevenue() {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  /* ======================
      FETCH TOTAL
  ====================== */
  const fetchTotal = async () => {
    try {
<<<<<<< HEAD
      const res = await api.get("/revenue");
=======
      const res = await axios.get(
        "http://localhost:5000/api/revenue"
      );
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
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
<<<<<<< HEAD
      const res = await api.get("/revenue/by-date");
=======
      const res = await axios.get(
        "http://localhost:5000/api/revenue/by-date"
      );
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
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
<<<<<<< HEAD
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
=======
    <div className="container mt-4">
      <h2>Thống kê doanh thu</h2>

      {/* TOTAL */}
      <div className="card p-3 mt-3">
        <h4>Tổng doanh thu</h4>
        <h2 className="text-success">
          {Number(total).toLocaleString()} VND
        </h2>
      </div>

      {/* CHART */}
      <div className="card p-3 mt-4">
        <h4>Doanh thu theo ngày</h4>

        <LineChart
          width={800}
          height={300}
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
          />
        </LineChart>
      </div>

      {/* TABLE */}
      <div className="card p-3 mt-4">
        <h4>Bảng doanh thu</h4>

        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>Ngày</th>
              <th>Doanh thu</th>
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
<<<<<<< HEAD
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
=======
              <tr key={index}>
                <td>{item.date}</td>
                <td>
                  {Number(item.revenue).toLocaleString()} VND
                </td>
              </tr>
            ))}
          </tbody>
        </table>
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
      </div>
    </div>
  );
}

export default AdminRevenue;