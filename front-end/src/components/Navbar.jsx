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
      ? "text-green-200 font-semibold"
      : "hover:text-green-200 transition";

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
    <nav className="sticky top-0 z-50 border-b border-emerald-900/20 bg-emerald-950/90 text-white backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-left">
          <span className="rounded-xl bg-emerald-500/25 px-2 py-1 text-sm">GC</span>
          <span className="text-lg font-bold tracking-wide">Garden Care</span>
        </button>

        <div className="hidden items-center space-x-5 text-sm md:flex">
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

        <div className="hidden items-center space-x-3 md:flex">
          {user ? (
            <>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
                Xin chào, <b>{user.name}</b>
              </span>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-white/35 px-4 py-2 text-sm transition hover:bg-white hover:text-emerald-800"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded-xl border border-white/35 px-4 py-2 text-sm transition hover:bg-white hover:text-emerald-800"
              >
                Đăng nhập
              </NavLink>

              <NavLink
                to="/register"
                className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
              >
                Đăng ký
              </NavLink>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-lg border border-white/35 px-3 py-1.5 text-sm md:hidden"
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
    </nav>
  );
}

export default Navbar;