import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function AdminRevenue() {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  /* ======================
      FETCH TOTAL
  ====================== */
  const fetchTotal = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/revenue"
      );
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
      const res = await axios.get(
        "http://localhost:5000/api/revenue/by-date"
      );
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
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>
                  {Number(item.revenue).toLocaleString()} VND
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminRevenue;