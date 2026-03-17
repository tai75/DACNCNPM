import { FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // ✅ lưu user
        localStorage.setItem("user", JSON.stringify(data.user));

        // ❗ QUAN TRỌNG: điều hướng TRƯỚC khi reload
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }

        // ❗ delay nhỏ để tránh lỗi navigate chưa kịp chạy
        setTimeout(() => {
          window.location.reload();
        }, 100);

      } else {
        alert(data.message || "Sai tài khoản hoặc mật khẩu");
      }

    } catch (error) {
      console.log(error);
      alert("Không kết nối được server!");
    } finally {
      setLoading(false);
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
            Dịch vụ chăm sóc cây chuyên nghiệp tại nhà
          </p>
        </div>

        {/* RIGHT */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">
            Đăng nhập
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg 
              hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          {/* REGISTER LINK */}
          <p className="text-sm text-center mt-4">
            Chưa có tài khoản?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-green-600 cursor-pointer hover:underline"
            >
              Đăng ký ngay
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;