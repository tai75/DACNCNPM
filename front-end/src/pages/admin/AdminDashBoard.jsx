import { useEffect, useState } from "react";
import api from "../../config/axios";
import {
  BarChart,
  Bar,
  Cell,
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, serviceRes, bookingRes, revenueRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/services"),
        api.get("/admin/bookings"),
        api.get("/revenue"),
      ]);

      const users = userRes.data?.data?.length || 0;
      const services = Array.isArray(serviceRes.data) ? serviceRes.data.length : 0;
      const bookings = bookingRes.data?.data?.length || 0;
      const revenue = Number(revenueRes.data?.total_revenue || 0);

      setStats({
        users,
        services,
        bookings,
        revenue,
      });

      setChartData([
        { name: "Người dùng", value: users, color: "#10b981" },
        { name: "Dịch vụ", value: services, color: "#3b82f6" },
        { name: "Đặt lịch", value: bookings, color: "#f59e0b" },
      ]);
    } catch (error) {
      console.error("Lỗi dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Bảng điều khiển Quản trị</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card-soft p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Tổng số người dùng</p>
                  <h2 className="text-3xl font-bold">{stats.users}</h2>
                </div>
                <div className="text-4xl opacity-80">👥</div>
              </div>
            </div>

            <div className="card-soft p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Tổng số dịch vụ</p>
                  <h2 className="text-3xl font-bold">{stats.services}</h2>
                </div>
                <div className="text-4xl opacity-80">🌿</div>
              </div>
            </div>

            <div className="card-soft p-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Đơn đặt lịch</p>
                  <h2 className="text-3xl font-bold">{stats.bookings}</h2>
                </div>
                <div className="text-4xl opacity-80">📅</div>
              </div>
            </div>

            <div className="card-soft p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Tổng doanh thu</p>
                  <h2 className="text-3xl font-bold">
                    {stats.revenue.toLocaleString()}đ
                  </h2>
                </div>
                <div className="text-4xl opacity-80">💰</div>
              </div>
            </div>
          </div>

          {/* CHART */}
          <div className="card-soft p-6">
            <h2 className="mb-6 text-xl font-bold text-gray-800">Thống kê tổng quan</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashBoard;