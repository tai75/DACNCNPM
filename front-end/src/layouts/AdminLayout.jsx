import { Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin</h2>

        <ul className="space-y-3">
          <li 
            onClick={() => navigate("/admin/dashboard")} 
            className="cursor-pointer hover:text-yellow-400"
          >
            Dashboard
          </li>

          <li 
            onClick={() => navigate("/admin/users")} 
            className="cursor-pointer hover:text-yellow-400"
          >
            Quản lý người dùng
          </li>

          <li 
            onClick={() => navigate("/admin/services")} 
            className="cursor-pointer hover:text-yellow-400"
          >
            Quản lý dịch vụ
          </li>

          <li 
            onClick={() => navigate("/admin/bookings")} 
            className="cursor-pointer hover:text-yellow-400"
          >
            Quản lý đơn hàng
          </li>

          <li 
            onClick={() => navigate("/admin/emlpoyees")} 
            className="cursor-pointer hover:text-yellow-400"
          >
            Quản lý nhân viên
          </li>

          <li 
            onClick={() => navigate("/admin/revenue")} 
            className="cursor-pointer hover:text-yellow-400"
          >
            Doanh thu
          </li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="flex-1 bg-gray-100">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 bg-white shadow">
          <h1 className="font-bold">Admin Panel</h1>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default AdminLayout;