import { FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
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