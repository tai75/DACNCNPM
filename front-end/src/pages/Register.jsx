import { FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
<<<<<<< HEAD
import api from "../config/axios";
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

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

<<<<<<< HEAD
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
=======
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
        alert("Đăng ký thành công!");
        navigate("/login");
      } else {
        alert(data.message || "Đăng ký thất bại");
      }
    } catch (error) {
<<<<<<< HEAD
      console.error("Register error:", error);
      alert(error.response?.data?.message || "Không kết nối được server!");
    } finally {
      setLoading(false);
=======
      console.log(error);
      alert("Không kết nối được server!");
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
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
=======
    <div className="min-h-screen flex items-center justify-center p-4
      bg-gradient-to-br from-green-100 via-green-200 to-green-400"
    >
      <div className="grid md:grid-cols-2 max-w-4xl w-full rounded-2xl overflow-hidden
        bg-white/90 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
      >
        {/* LEFT */}
        <div className="hidden md:flex flex-col justify-center items-center text-white p-10
          bg-gradient-to-br from-green-500 to-green-700"
        >
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <FaLeaf /> Garden Care
          </h1>

          <p className="text-center mb-6 opacity-90">
            Bắt đầu hành trình chăm sóc khu vườn của bạn
          </p>

          <ul className="space-y-2 text-sm opacity-90">
            <li>✔ Quản lý lịch chăm sóc</li>
            <li>✔ Nhận tư vấn miễn phí</li>
            <li>✔ Theo dõi tình trạng cây</li>
          </ul>
        </div>

        {/* RIGHT */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">
            Đăng ký
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

            <input
              type="text"
              name="name"
<<<<<<< HEAD
              autoComplete="name"
              placeholder="Họ và tên"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
=======
              placeholder="Họ và tên"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
            />

            <input
              type="email"
              name="email"
<<<<<<< HEAD
              autoComplete="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
=======
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
            />

            <input
              type="tel"
              name="phone"
<<<<<<< HEAD
              autoComplete="tel"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
=======
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
            />

            <input
              type="password"
              name="password"
<<<<<<< HEAD
              autoComplete="new-password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
=======
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
            />

            <input
              type="password"
              name="confirmPassword"
<<<<<<< HEAD
              autoComplete="new-password"
              placeholder="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
=======
              placeholder="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
            />

            <button
              type="submit"
<<<<<<< HEAD
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
=======
              className="w-full bg-green-600 text-white py-3 rounded-lg 
              hover:bg-green-700 transition-all duration-300 
              transform hover:scale-105 active:scale-95"
            >
              Đăng ký
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Đã có tài khoản?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-green-600 cursor-pointer hover:underline font-medium"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
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