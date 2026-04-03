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

        // điều hướng
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
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
                placeholder="email@cuaban.com"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                placeholder="••••••••"
                required
              />
            </div>

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
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;