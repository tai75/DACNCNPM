import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminDashBoard() {
  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    bookings: 0,
    revenue: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, serviceRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/users"),
        axios.get("http://localhost:5000/api/services"),
      ]);

      const users = userRes.data.data.length;
      const services = serviceRes.data.length;

      setStats({
        users,
        services,
        bookings: 0,
        revenue: 0,
      });

      // fake data biểu đồ (sau này thay bằng data thật)
      setChartData([
        { name: "User", value: users },
        { name: "Service", value: services },
        { name: "Booking", value: 0 },
      ]);
    } catch (error) {
      console.error("Lỗi dashboard:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-4 rounded shadow">
          <p>Tổng user</p>
          <h2 className="text-2xl font-bold">{stats.users}</h2>
        </div>

        <div className="bg-purple-500 text-white p-4 rounded shadow">
          <p>Tổng dịch vụ</p>
          <h2 className="text-2xl font-bold">{stats.services}</h2>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded shadow">
          <p>Đơn đặt</p>
          <h2 className="text-2xl font-bold">{stats.bookings}</h2>
        </div>

        <div className="bg-green-500 text-white p-4 rounded shadow">
          <p>Doanh thu</p>
          <h2 className="text-2xl font-bold">
            {stats.revenue.toLocaleString()}đ
          </h2>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="mb-4 font-bold">Thống kê tổng quan</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminDashBoard;