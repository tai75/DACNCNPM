<<<<<<< HEAD
import { NavLink, useLocation, useNavigate } from "react-router-dom";
=======
import { NavLink, useNavigate } from "react-router-dom";
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
<<<<<<< HEAD
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHomePage = location.pathname === "/";

  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const syncAuthState = () => setUser(getStoredUser());

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("auth-changed", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("auth-changed", syncAuthState);
    };
  }, []);

  const linkClass = ({ isActive }) =>
    isHomePage
      ? isActive
        ? "text-white font-semibold"
        : "text-white hover:text-green-400 transition"
      : isActive
      ? "text-emerald-700 font-semibold"
      : "text-slate-600 hover:text-emerald-700 transition";

  // ✅ logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    setUser(null);
    setMobileOpen(false);
    navigate("/login");
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header
      className={`left-0 top-0 z-50 w-full py-4 ${
        isHomePage
          ? "absolute text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)]"
          : "sticky border-b border-slate-200 bg-white/95 text-slate-700 shadow-sm backdrop-blur"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-8">
        <button onClick={() => navigate("/")} className="relative z-10 flex items-center text-left">
          <span className={`text-3xl font-bold tracking-wider ${isHomePage ? "text-white" : "text-emerald-700"}`}>
            GardenCare
          </span>
        </button>

        <div
          className={`absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full px-2 py-1 font-medium md:flex ${
            isHomePage
              ? "border border-white/30 bg-white/10 text-white"
              : "border border-slate-300 bg-white text-slate-600"
          }`}
        >
          <NavLink to="/" className={`rounded-full px-3 py-1.5 text-sm transition ${
            isHomePage ? "text-white hover:text-white" : "text-slate-600 hover:bg-slate-100"
          }`}>
            Trang chủ
          </NavLink>

          <NavLink to="/services" className={`rounded-full px-3 py-1.5 text-sm transition ${
            isHomePage ? "text-white hover:text-white" : "text-slate-600 hover:bg-slate-100"
          }`}>
            Dịch vụ
          </NavLink>

          <NavLink to="/booking" className={`rounded-full px-3 py-1.5 text-sm transition ${
            isHomePage ? "text-white hover:text-white" : "text-slate-600 hover:bg-slate-100"
          }`}>
            Đặt lịch
          </NavLink>

          <NavLink to="/about" className={`rounded-full px-3 py-1.5 text-sm transition ${
            isHomePage ? "text-white hover:text-white" : "text-slate-600 hover:bg-slate-100"
          }`}>
            Giới thiệu
          </NavLink>

          <NavLink to="/contact" className={`rounded-full px-3 py-1.5 text-sm transition ${
            isHomePage ? "text-white hover:text-white" : "text-slate-600 hover:bg-slate-100"
          }`}>
            Liên hệ
          </NavLink>

          {user && (
            <NavLink to="/profile" className={`rounded-full px-3 py-1.5 text-sm transition ${
              isHomePage ? "text-white hover:text-white" : "text-slate-600 hover:bg-slate-100"
            }`}>
              Thông tin
            </NavLink>
          )}

          {user && (
            <NavLink to="/bookings" className={`rounded-full px-3 py-1.5 text-sm transition ${
              isHomePage ? "text-white hover:text-white" : "text-slate-600 hover:bg-slate-100"
            }`}>
              Lịch sử
            </NavLink>
          )}
        </div>

        <div className="relative z-10 hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span
                className={`rounded-full px-4 py-2 text-sm ${
                  isHomePage
                    ? "border border-white/20 bg-white/10"
                    : "border border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
=======
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
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
                Xin chào, <b>{user.name}</b>
              </span>

              <button
                onClick={handleLogout}
<<<<<<< HEAD
                className={`rounded-full px-6 py-2 text-sm transition ${
                  isHomePage
                    ? "border border-white text-white hover:bg-white/15"
                    : "border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                }`}
=======
                className="px-4 py-2 border border-white rounded hover:bg-white hover:text-green-700 transition"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
<<<<<<< HEAD
                className={`rounded-full px-6 py-2 text-sm transition ${
                  isHomePage
                    ? "border border-white text-white hover:bg-white/15"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
=======
                className="px-4 py-2 border border-white rounded hover:bg-white hover:text-green-700 transition"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
              >
                Đăng nhập
              </NavLink>

              <NavLink
                to="/register"
<<<<<<< HEAD
                className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                  isHomePage
                    ? "border border-white text-white hover:bg-white/15"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
=======
                className="bg-white text-green-700 px-4 py-2 rounded hover:bg-green-100 transition"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
              >
                Đăng ký
              </NavLink>
            </>
          )}
        </div>

<<<<<<< HEAD
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className={`relative z-10 rounded-full px-4 py-2 text-sm md:hidden ${
            isHomePage
              ? "border border-white text-white"
              : "border border-slate-300 text-slate-700"
          }`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "Đóng" : "Menu"}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-emerald-800 bg-emerald-950 px-4 pb-4 pt-3 md:hidden">
          <div className="grid gap-2 text-sm">
            <NavLink to="/" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-white/10">Trang chủ</NavLink>
            <NavLink to="/services" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-white/10">Dịch vụ</NavLink>
            <NavLink to="/booking" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-white/10">Đặt lịch</NavLink>
            <NavLink to="/bookings" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-white/10">Lịch sử</NavLink>
            <NavLink to="/about" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-white/10">Giới thiệu</NavLink>
            <NavLink to="/contact" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-white/10">Liên hệ</NavLink>
          </div>

          {user ? (
            <button
              onClick={handleLogout}
              className="mt-3 w-full rounded-lg border border-white/35 px-3 py-2 text-left"
            >
              Đăng xuất
            </button>
          ) : (
            <div className="mt-3 space-y-2">
              <NavLink
                to="/login"
                onClick={closeMobileMenu}
                className="block rounded-lg border border-white/35 px-3 py-2"
              >
                Đăng nhập
              </NavLink>
              <NavLink
                to="/register"
                onClick={closeMobileMenu}
                className="block rounded-lg bg-emerald-400 px-3 py-2 font-semibold text-emerald-950"
              >
                Đăng ký
              </NavLink>
            </div>
          )}
        </div>
      )}
    </header>
=======
      </div>
    </nav>
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
  );
}

export default Navbar;