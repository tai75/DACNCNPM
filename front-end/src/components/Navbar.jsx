import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    isActive
      ? "text-white font-semibold"
      : "text-white hover:text-green-400 transition";

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
    <header className="absolute top-0 left-0 z-50 w-full py-6 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)]">
      <div className="container mx-auto flex items-center justify-between px-8">
        <button onClick={() => navigate("/")} className="relative z-10 flex items-center text-left">
          <span className="text-3xl font-bold tracking-wider text-white">GardenCare</span>
        </button>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 font-medium text-white md:flex">
          <NavLink to="/" className={linkClass}>
            Trang chủ
          </NavLink>

          <NavLink to="/services" className={linkClass}>
            Dịch vụ
          </NavLink>

          <NavLink to="/booking" className={linkClass}>
            Đặt lịch
          </NavLink>

          <NavLink to="/bookings" className={linkClass}>
            Lịch sử
          </NavLink>

          <NavLink to="/about" className={linkClass}>
            Giới thiệu
          </NavLink>

          <NavLink to="/contact" className={linkClass}>
            Liên hệ
          </NavLink>
        </div>

        <div className="relative z-10 hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
                Xin chào, <b>{user.name}</b>
              </span>

              <button
                onClick={handleLogout}
                className="rounded-full border border-white px-6 py-2 text-sm text-white transition hover:bg-white/15"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded-full border border-white px-6 py-2 text-sm text-white transition hover:bg-white/15"
              >
                Đăng nhập
              </NavLink>

              <NavLink
                to="/register"
                className="rounded-full border border-white px-6 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Đăng ký
              </NavLink>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="relative z-10 rounded-full border border-white px-4 py-2 text-sm text-white md:hidden"
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
  );
}

export default Navbar;