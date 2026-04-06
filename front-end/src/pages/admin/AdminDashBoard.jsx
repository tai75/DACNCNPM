import { useEffect, useState } from "react";
import api from "../../config/axios";
import {
<<<<<<< HEAD
=======
  BarChart,
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
  Bar,
  XAxis,
  YAxis,
  Tooltip,
<<<<<<< HEAD
  CartesianGrid,
  Legend,
  Area,
  ComposedChart,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Sprout,
  ClipboardList,
  Wallet,
  ArrowUpRight,
  BellRing,
  ShieldAlert,
  CalendarClock,
  UserPlus,
  FileBarChart2,
} from "lucide-react";
=======
  ResponsiveContainer,
} from "recharts";
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

function AdminDashBoard() {
  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    bookings: 0,
    revenue: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  const growthMap = {
    users: "+22%",
    services: "+14%",
    bookings: "+37%",
    revenue: "+100%",
  };

  const quickActions = [
    { label: "Tạo dịch vụ mới", description: "Mở form tạo dịch vụ", icon: Sprout, href: "/admin/services" },
    { label: "Phân công đơn", description: "Xem và điều phối booking", icon: CalendarClock, href: "/admin/bookings" },
    { label: "Thêm nhân sự", description: "Cập nhật đội kỹ thuật", icon: UserPlus, href: "/admin/staff" },
    { label: "Xem báo cáo", description: "Kiểm tra doanh thu nhanh", icon: FileBarChart2, href: "/admin/revenue" },
  ];

  const alerts = [
    { level: "high", title: "3 đơn cần xác nhận", detail: "Có đơn mới chưa phân công kỹ thuật viên" },
    { level: "medium", title: "2 đánh giá chờ duyệt", detail: "Kiểm tra nội dung trước khi hiển thị công khai" },
    { level: "low", title: "Sao lưu dữ liệu định kỳ", detail: "Lần backup gần nhất: 2 ngày trước" },
  ];

=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
<<<<<<< HEAD
      // Fetch all stats from a single optimized endpoint instead of 4 separate calls
      const dashboardRes = await api.get("/admin/dashboard");

      const { users = 0, services = 0, bookings = 0, revenue = 0 } = dashboardRes.data?.data || {};
=======
      const [userRes, serviceRes, bookingRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/services"),
        api.get("/admin/bookings"),
      ]);

      const users = userRes.data.data.length;
      const services = serviceRes.data.length;
      const bookings = bookingRes.data.length;
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

      setStats({
        users,
        services,
        bookings,
<<<<<<< HEAD
        revenue,
      });

      setChartData([
        { name: "Người dùng", value: users },
        { name: "Dịch vụ", value: services },
        { name: "Đặt lịch", value: bookings },
        { name: "Doanh thu", value: revenue },
=======
        revenue: 0, // TODO: calculate from bookings
      });

      setChartData([
        { name: "Người dùng", value: users, color: "#10b981" },
        { name: "Dịch vụ", value: services, color: "#3b82f6" },
        { name: "Đặt lịch", value: bookings, color: "#f59e0b" },
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
      ]);
    } catch (error) {
      console.error("Lỗi dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Overview</p>
        <h1 className="text-3xl font-bold text-slate-800">Bảng điều khiển Quản trị</h1>
      </div>
=======
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Bảng điều khiển Quản trị</h1>
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {/* CARDS */}
<<<<<<< HEAD
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Users className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 text-emerald-100" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Tổng số người dùng</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {growthMap.users}
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">{stats.users}</h2>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Sprout className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 text-cyan-100" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Tổng số dịch vụ</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {growthMap.services}
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">{stats.services}</h2>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <ClipboardList className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 text-violet-100" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Đơn đặt lịch</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {growthMap.bookings}
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">{stats.bookings}</h2>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Wallet className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 text-amber-100" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Tổng doanh thu</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {growthMap.revenue}
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">{Number(stats.revenue).toLocaleString()}đ</h2>
=======
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Tổng số người dùng</p>
                  <h2 className="text-3xl font-bold">{stats.users}</h2>
                </div>
                <div className="text-4xl opacity-80">👥</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Tổng số dịch vụ</p>
                  <h2 className="text-3xl font-bold">{stats.services}</h2>
                </div>
                <div className="text-4xl opacity-80">🌿</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Đơn đặt lịch</p>
                  <h2 className="text-3xl font-bold">{stats.bookings}</h2>
                </div>
                <div className="text-4xl opacity-80">📅</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Tổng doanh thu</p>
                  <h2 className="text-3xl font-bold">
                    {stats.revenue.toLocaleString()}đ
                  </h2>
                </div>
                <div className="text-4xl opacity-80">💰</div>
              </div>
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
            </div>
          </div>

          {/* CHART */}
<<<<<<< HEAD
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <h2 className="mb-6 text-xl font-bold text-gray-800">Thống kê tổng quan</h2>

            <div className="h-[300px] min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="dashboardBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="dashboardArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.32} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: "#334155", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#334155", fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: "rgba(5, 150, 105, 0.08)" }}
                    contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }}
                    formatter={(value) => Number(value).toLocaleString("vi-VN")}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="value" fill="url(#dashboardArea)" stroke="transparent" name="Xu hướng" />
                  <Bar dataKey="value" fill="url(#dashboardBar)" radius={[10, 10, 0, 0]} name="Giá trị" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-800">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <a
                      key={action.label}
                      href={action.href}
                      className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50"
                    >
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-700 ring-1 ring-slate-200 group-hover:ring-cyan-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800">{action.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{action.description}</p>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-800">System Alerts</h3>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.title}
                    className={`flex items-start gap-3 rounded-xl border p-3 ${
                      alert.level === "high"
                        ? "border-rose-200 bg-rose-50"
                        : alert.level === "medium"
                        ? "border-amber-200 bg-amber-50"
                        : "border-cyan-200 bg-cyan-50"
                    }`}
                  >
                    <div className="mt-0.5">
                      {alert.level === "high" ? (
                        <ShieldAlert className="h-5 w-5 text-rose-600" />
                      ) : alert.level === "medium" ? (
                        <BellRing className="h-5 w-5 text-amber-600" />
                      ) : (
                        <BellRing className="h-5 w-5 text-cyan-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
                      <p className="text-xs text-slate-600">{alert.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
=======
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="mb-6 text-xl font-bold text-gray-800">Thống kê tổng quan</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashBoard;