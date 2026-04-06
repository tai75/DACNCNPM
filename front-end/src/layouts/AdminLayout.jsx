import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Sprout,
  ClipboardList,
  BarChart3,
  Star,
  Menu,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Quản lý người dùng", icon: Users },
    { to: "/admin/staff", label: "Quản lý kỹ thuật viên", icon: Users },
    { to: "/admin/services", label: "Quản lý dịch vụ", icon: Sprout },
    { to: "/admin/reviews", label: "Đánh giá khách hàng", icon: Star },
    { to: "/admin/bookings", label: "Quản lý đơn hàng", icon: ClipboardList },
    { to: "/admin/revenue", label: "Doanh thu", icon: BarChart3 },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      
      {/* SIDEBAR */}
      <div
        className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 w-72 bg-[#0B1B34] px-4 py-6 text-slate-200 shadow-2xl transform transition-transform duration-300 md:translate-x-0 md:static md:inset-auto`}
      >
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">Garden Care</p>
            <h2 className="text-lg font-semibold text-white">Admin Console</h2>
          </div>
        </div>

        <ul className="space-y-2 text-sm">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-xl px-3 py-3 transition-all ${
                      isActive
                        ? "bg-cyan-400/15 text-white shadow-[inset_0_0_0_1px_rgba(56,189,248,0.45)]"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-200 group-hover:bg-white/10">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-normal tracking-wide">{item.label}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-200" />
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {open && (
        <button
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* MAIN */}
      <div className="flex-1 bg-slate-100 md:ml-0">
        
        {/* HEADER */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 p-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg border border-slate-300 px-3 py-1 text-sm md:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Management</p>
              <h1 className="font-semibold text-slate-800">Admin Panel</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-100 text-sm font-semibold text-cyan-700">
              A
            </div>
            <button 
              onClick={handleLogout} 
              className="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-3 py-1.5 text-sm text-white transition hover:bg-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 md:p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default AdminLayout;