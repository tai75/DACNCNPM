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

  const desktopLinkClass = ({ isActive }) =>
    `rounded-full px-3 py-1.5 text-sm transition ${
      isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100"
    }`;

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
      className="sticky left-0 top-0 z-50 w-full border-b border-slate-200 bg-white/95 py-4 text-slate-700 shadow-sm backdrop-blur"
    >
      <div className="container mx-auto flex items-center justify-between px-8">
        <button onClick={() => navigate("/")} className="relative z-10 flex items-center text-left">
          <span className="text-3xl font-bold tracking-wider text-emerald-700">
            GardenCare
          </span>
        </button>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-slate-300 bg-white px-2 py-1 font-medium md:flex">
          <NavLink to="/" className={desktopLinkClass}>
            Trang chủ
          </NavLink>

          <NavLink to="/services" className={desktopLinkClass}>
            Dịch vụ
          </NavLink>

          <NavLink to="/booking" className={desktopLinkClass}>
            Đặt lịch
          </NavLink>

          <NavLink to="/about" className={desktopLinkClass}>
            Giới thiệu
          </NavLink>

          <NavLink to="/contact" className={desktopLinkClass}>
            Liên hệ
          </NavLink>

          {user && (
            <NavLink to="/profile" className={desktopLinkClass}>
              Thông tin
            </NavLink>
          )}

          {user && (
            <NavLink to="/bookings" className={desktopLinkClass}>
              Lịch sử
            </NavLink>
          )}
        </div>

        <div className="relative z-10 hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700"
              >
                Xin chào, <b>{user.name}</b>
              </span>

              <button
                onClick={handleLogout}
                className="rounded-full border border-rose-200 bg-rose-50 px-6 py-2 text-sm text-rose-600 transition hover:bg-rose-100"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded-full border border-slate-300 px-6 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                Đăng nhập
              </NavLink>

              <NavLink
                to="/register"
                className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Đăng ký
              </NavLink>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="relative z-10 rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? "Đóng" : "Menu"}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-3 md:hidden">
          <div className="grid gap-2 text-sm text-slate-700">
            <NavLink to="/" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-slate-100">Trang chủ</NavLink>
            <NavLink to="/services" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-slate-100">Dịch vụ</NavLink>
            <NavLink to="/booking" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-slate-100">Đặt lịch</NavLink>
            <NavLink to="/bookings" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-slate-100">Lịch sử</NavLink>
            <NavLink to="/about" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-slate-100">Giới thiệu</NavLink>
            <NavLink to="/contact" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-slate-100">Liên hệ</NavLink>
          </div>

          {user ? (
            <button
              onClick={handleLogout}
              className="mt-3 w-full rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-left text-rose-600"
            >
              Đăng xuất
            </button>
          ) : (
            <div className="mt-3 space-y-2">
              <NavLink
                to="/login"
                onClick={closeMobileMenu}
                className="block rounded-lg border border-slate-300 px-3 py-2"
              >
                Đăng nhập
              </NavLink>
              <NavLink
                to="/register"
                onClick={closeMobileMenu}
                className="block rounded-lg bg-emerald-600 px-3 py-2 font-semibold text-white"
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