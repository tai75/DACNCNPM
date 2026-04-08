import { FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../config/axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // xử lý input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 REGISTER REAL API
  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    if (form.password.length < 8) {
      alert("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    if (!/^[0-9]{10,11}$/.test(form.phone)) {
      alert("Số điện thoại phải gồm 10 đến 11 chữ số");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      const data = res.data;

      if (data.success) {
        alert("Đăng ký thành công!");
        navigate("/login");
      } else {
        alert(data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert(error.response?.data?.message || "Không kết nối được server!");
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
            <p className="mt-4 text-emerald-50">Tạo tài khoản để quản lý lịch sử chăm cây và nhận hỗ trợ nhanh hơn.</p>
            <p className="mt-8 rounded-xl border border-white/25 bg-white/10 p-4 text-sm leading-6 text-emerald-50">
              Nhận lịch nhắc chăm cây định kỳ, theo dõi tiến độ dịch vụ và quản lý thanh toán tập trung.
            </p>
          </div>
        </div>

        <div className="p-7 md:p-10">
          <h2 className="text-3xl font-bold text-slate-800">Đăng ký</h2>
          <p className="mt-1 text-sm text-slate-500">Chỉ mất một phút để bắt đầu.</p>

          <form onSubmit={handleRegister} className="mt-6 space-y-4">

            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Họ và tên"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />

            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />

            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />

            <input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />

            <input
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            Đã có tài khoản?{" "}
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer font-semibold text-emerald-700 hover:underline"
            >
              Đăng nhập ngay
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
