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
<<<<<<< HEAD
        window.dispatchEvent(new Event("auth-changed"));
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

        // điều hướng
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
<<<<<<< HEAD
        } else if (data.user.role === "staff") {
          navigate("/staff/bookings");
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
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
<<<<<<< HEAD
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
=======
    <div className="min-h-screen flex items-center justify-center p-4
      bg-gradient-to-br from-green-100 via-green-200 to-green-400 animate-fade-in">
      <div className="grid md:grid-cols-2 max-w-4xl w-full rounded-3xl overflow-hidden
        bg-white/20 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/30 animate-slide-up">
        {/* LEFT */}
        <div className="hidden md:flex flex-col justify-center items-center text-white p-10
          bg-gradient-to-br from-green-500 to-green-700"
        >
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <FaLeaf /> Garden Care
          </h1>

          <p className="text-center mb-6 opacity-90">
            Dịch vụ chăm sóc cây chuyên nghiệp tại nhà
          </p>
        </div>

        {/* RIGHT */}
        <div className="p-8 md:p-10 flex flex-col justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl font-bold mb-6 text-green-800 text-center drop-shadow-lg">
            Đăng nhập
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* EMAIL */}
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
                placeholder="email@cuaban.com"
                required
              />
            </div>

<<<<<<< HEAD
            <div>
              <label className="mb-1 block text-sm text-slate-600">Mật khẩu</label>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
=======
            {/* PASSWORD */}
            <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
                placeholder="••••••••"
                required
              />
            </div>

<<<<<<< HEAD
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
=======
            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-bounce-in"
              style={{ animationDelay: '0.6s' }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            Chưa có tài khoản?{" "}
            <a href="/register" className="text-green-600 hover:text-green-800 font-semibold transition-colors">
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;