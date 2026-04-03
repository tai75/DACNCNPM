import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen panel-shell">
      
      {/* SIDEBAR */}
      <div className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white p-5 transform transition-transform duration-300 md:translate-x-0 md:static md:inset-auto`}>
        <h2 className="mb-6 text-xl font-bold">Admin</h2>

        <ul className="space-y-2 text-sm">
          <li 
            onClick={() => navigate("/admin/dashboard")} 
            className="cursor-pointer rounded-lg px-3 py-2 transition hover:bg-white/10"
          >
            Dashboard
          </li>

          <li 
            onClick={() => navigate("/admin/users")} 
            className="cursor-pointer rounded-lg px-3 py-2 transition hover:bg-white/10"
          >
            Quản lý người dùng
          </li>

          <li 
            onClick={() => navigate("/admin/services")} 
            className="cursor-pointer rounded-lg px-3 py-2 transition hover:bg-white/10"
          >
            Quản lý dịch vụ
          </li>

          <li 
            onClick={() => navigate("/admin/bookings")} 
            className="cursor-pointer rounded-lg px-3 py-2 transition hover:bg-white/10"
          >
            Quản lý đơn hàng
          </li>

          <li 
            onClick={() => navigate("/admin/employees")} 
            className="cursor-pointer rounded-lg px-3 py-2 transition hover:bg-white/10"
          >
            Quản lý nhân viên
          </li>

          <li 
            onClick={() => navigate("/admin/revenue")} 
            className="cursor-pointer rounded-lg px-3 py-2 transition hover:bg-white/10"
          >
            Doanh thu
          </li>
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
      <div className="flex-1 md:ml-0">
        
        {/* HEADER */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 p-4 backdrop-blur">
          <button
            className="rounded-lg border border-slate-300 px-3 py-1 text-sm md:hidden"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <h1 className="font-bold text-slate-800">Admin Panel</h1>
          <button 
            onClick={handleLogout} 
            className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm text-white transition hover:bg-rose-600"
          >
            Logout
          </button>
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