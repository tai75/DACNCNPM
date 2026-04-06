import { FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../config/axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ xử lý input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ LOGIN API
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/login", form);
      const data = res.data;

      if (data.success) {
        // ✅ lưu token và user
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("auth-changed"));

        // điều hướng
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (data.user.role === "staff") {
          navigate("/staff/bookings");
        } else {
          navigate("/");
        }
      } else {
        alert(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full w-full items-center justify-center py-8 md:py-12">
      <div className="card-soft grid w-full max-w-5xl overflow-hidden md:grid-cols-2">
        <div className="relative hidden p-10 text-white md:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/background.webp')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 to-emerald-600/75" />
          <div className="relative z-10">
            <h1 className="flex items-center gap-2 text-3xl font-extrabold"><FaLeaf /> Garden Care</h1>
            <p className="mt-4 text-emerald-50">Đăng nhập để theo dõi lịch sử đặt lịch và quản lý dịch vụ của bạn.</p>
            <p className="mt-8 rounded-xl border border-white/25 bg-white/10 p-4 text-sm leading-6 text-emerald-50">
              "Mỗi lần chăm đúng kỹ thuật là một lần giúp khu vườn khỏe bền hơn."
            </p>
          </div>
        </div>

        <div className="p-7 md:p-10">
          <h2 className="text-3xl font-bold text-slate-800">Đăng nhập</h2>
          <p className="mt-1 text-sm text-slate-500">Chào mừng bạn quay lại.</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600">Email</label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                placeholder="email@cuaban.com"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-600">Mật khẩu</label>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            Chưa có tài khoản?{" "}
            <a href="/register" className="font-semibold text-emerald-700 hover:underline">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;