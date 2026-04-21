import { useEffect, useState } from "react";
import api from "../../config/axios";
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
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
  CalendarClock,
  UserPlus,
  FileBarChart2,
} from "lucide-react";

function AdminDashBoard() {
  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    bookings: 0,
    revenue: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const quickActions = [
    { label: "Tạo dịch vụ mới", description: "Mở form tạo dịch vụ", icon: Sprout, href: "/admin/services" },
    { label: "Phân công đơn", description: "Xem và điều phối booking", icon: CalendarClock, href: "/admin/bookings" },
    { label: "Thêm nhân sự", description: "Cập nhật đội kỹ thuật", icon: UserPlus, href: "/admin/staff" },
    { label: "Xem báo cáo", description: "Kiểm tra doanh thu nhanh", icon: FileBarChart2, href: "/admin/revenue" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, revenueRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/revenue"),
      ]);

      const { users = 0, services = 0, bookings = 0 } = dashboardRes.data?.data || {};
      const revenue = Number(revenueRes.data?.total_revenue || 0);

      setStats({
        users,
        services,
        bookings,
        revenue,
      });

      setChartData([
        { name: "Người dùng", value: users, unit: "" },
        { name: "Dịch vụ", value: services, unit: "" },
        { name: "Đặt lịch", value: bookings, unit: "" },
      ]);

      setRevenueChartData([{ name: "Doanh thu", value: revenue, unit: " VNĐ" }]);
    } catch (error) {
      console.error("Lỗi dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Overview</p>
        <h1 className="text-3xl font-bold text-slate-800">Bảng điều khiển Quản trị</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {/* CARDS */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Users className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 text-emerald-100" />
              <p className="text-sm text-slate-500">Tổng số người dùng</p>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">{stats.users}</h2>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Sprout className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 text-cyan-100" />
              <p className="text-sm text-slate-500">Tổng số dịch vụ</p>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">{stats.services}</h2>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <ClipboardList className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 text-violet-100" />
              <p className="text-sm text-slate-500">Đơn đặt lịch</p>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">{stats.bookings}</h2>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Wallet className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 text-amber-100" />
              <p className="text-sm text-slate-500">Tổng doanh thu</p>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">{Number(stats.revenue).toLocaleString("vi-VN")} VNĐ</h2>
            </div>
          </div>

          {/* CHARTS */}
          <div className="grid gap-5 xl:grid-cols-2">
            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
              <h2 className="mb-6 text-xl font-bold text-gray-800">Thống kê số lượng</h2>

              <div className="h-[300px] min-h-[300px] min-w-0">
                <ResponsiveContainer width="99%" height={300} minWidth={0} minHeight={260}>
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
                    <YAxis tick={{ fill: "#334155", fontSize: 12 }} allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(5, 150, 105, 0.08)" }}
                      contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }}
                      formatter={(value) => Number(value).toLocaleString("vi-VN")}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="value" fill="url(#dashboardArea)" stroke="transparent" name="Xu hướng" />
                    <Bar
                      dataKey="value"
                      fill="url(#dashboardBar)"
                      radius={[10, 10, 0, 0]}
                      minPointSize={16}
                      name="Số lượng"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
              <h2 className="mb-6 text-xl font-bold text-gray-800">Thống kê doanh thu</h2>

              <div className="h-[300px] min-h-[300px] min-w-0">
                <ResponsiveContainer width="99%" height={300} minWidth={0} minHeight={260}>
                  <ComposedChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="revenueBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#0369a1" stopOpacity={0.6} />
                      </linearGradient>
                      <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.32} />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: "#334155", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#334155", fontSize: 12 }} tickFormatter={(value) => Number(value).toLocaleString("vi-VN")} />
                    <Tooltip
                      cursor={{ fill: "rgba(14, 165, 233, 0.08)" }}
                      contentStyle={{ borderRadius: 12, borderColor: "#cbd5e1" }}
                      formatter={(value, _name, payload) => {
                        const unit = payload?.payload?.unit || "";
                        return `${Number(value).toLocaleString("vi-VN")}${unit}`;
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="value" fill="url(#revenueArea)" stroke="transparent" name="Xu hướng" />
                    <Bar
                      dataKey="value"
                      fill="url(#revenueBar)"
                      radius={[10, 10, 0, 0]}
                      name="Doanh thu"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
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
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashBoard;