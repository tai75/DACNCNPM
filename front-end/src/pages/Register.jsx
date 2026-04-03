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

    try {
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
      console.log(error);
      alert("Không kết nối được server!");
    }
  };

  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-5xl items-center px-4 py-8 md:px-6 md:py-10">
      <div className="card-soft grid w-full overflow-hidden md:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-emerald-700 to-emerald-500 p-10 text-white md:block">
          <h1 className="flex items-center gap-2 text-3xl font-extrabold"><FaLeaf /> Garden Care</h1>
          <p className="mt-4 text-emerald-50">Tạo tài khoản để quản lý lịch sử chăm cây và nhận hỗ trợ nhanh hơn.</p>
        </div>

        <div className="p-7 md:p-10">
          <h2 className="text-3xl font-bold text-slate-800">Đăng ký</h2>
          <p className="mt-1 text-sm text-slate-500">Chỉ mất một phút để bắt đầu.</p>

          <form onSubmit={handleRegister} className="mt-6 space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />

            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Đăng ký
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