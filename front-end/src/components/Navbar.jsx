import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // ✅ lấy user từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-green-200 font-semibold"
      : "hover:text-green-200 transition";

  // ✅ logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        
        {/* LOGO */}
        <h1 className="text-xl font-bold tracking-wide">
          🌿 GardenCare
        </h1>

        {/* MENU */}
        <div className="space-x-6 hidden md:flex items-center">
          <NavLink to="/" className={linkClass}>
            Trang chủ
          </NavLink>

          <NavLink to="/services" className={linkClass}>
            Dịch vụ
          </NavLink>

          <NavLink to="/booking" className={linkClass}>
            Đặt lịch
          </NavLink>

          <NavLink to="/about" className={linkClass}>
            Giới thiệu
          </NavLink>

          <NavLink to="/contact" className={linkClass}>
            Liên hệ
          </NavLink>
        </div>

        {/* AUTH */}
        <div className="space-x-3">
          {user ? (
            <>
              <span>
                Xin chào, <b>{user.name}</b>
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-white rounded hover:bg-white hover:text-green-700 transition"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-4 py-2 border border-white rounded hover:bg-white hover:text-green-700 transition"
              >
                Đăng nhập
              </NavLink>

              <NavLink
                to="/register"
                className="bg-white text-green-700 px-4 py-2 rounded hover:bg-green-100 transition"
              >
                Đăng ký
              </NavLink>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;