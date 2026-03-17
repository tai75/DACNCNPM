import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();

  // 👉 nhận dữ liệu từ Services
  const serviceData = location.state;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    address: "",
    note: "",
  });

  // 👉 auto fill service nếu đi từ Services
  useEffect(() => {
    if (serviceData) {
      setFormData((prev) => ({
        ...prev,
        service: serviceData.service || "",
      }));
    }
  }, [serviceData]);

  // 👉 giá phải là NUMBER (rất quan trọng)
  const getPrice = (service) => {
    switch (service) {
      case "Cắt tỉa cây":
        return 200000;
      case "Bón phân định kỳ":
        return 150000;
      case "Phun thuốc sâu":
        return 250000;
      case "Thiết kế sân vườn":
        return 1500000;
      default:
        return 0;
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const bookingData = {
      ...formData,
      price: getPrice(formData.service),
    };

    // 👉 chuyển sang payment + truyền data
    navigate("/payment", { state: bookingData });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow p-6 space-y-10 max-w-6xl mx-auto w-full">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            📅 Đặt lịch chăm sóc cây
          </h1>
          <p className="text-gray-500">
            Điền thông tin bên dưới, chúng tôi sẽ liên hệ xác nhận nhanh chóng
          </p>
        </div>

        {/* MAIN */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* FORM */}
          <div className="md:col-span-2 bg-white shadow-xl p-8 rounded-xl">
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="text-sm text-gray-600">Họ tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0123 456 789"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Dịch vụ</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                  required
                >
                  <option value="">Chọn dịch vụ</option>
                  <option>Cắt tỉa cây</option>
                  <option>Bón phân định kỳ</option>
                  <option>Phun thuốc sâu</option>
                  <option>Thiết kế sân vườn</option>
                </select>

                {/* 👉 HIỂN THỊ GIÁ */}
                {formData.service && (
                  <p className="text-green-600 font-semibold mt-2">
                    Giá: {getPrice(formData.service).toLocaleString()}đ
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">Ngày thực hiện</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ..."
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Ghi chú</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Yêu cầu thêm..."
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                  rows="4"
                ></textarea>
              </div>

              <button
                type="submit"
                className="md:col-span-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Xác nhận đặt lịch
              </button>

            </form>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">

            <div className="bg-green-50 p-6 rounded-xl shadow">
              <h3 className="font-semibold text-green-700 mb-3">
                🌿 Lợi ích khi đặt lịch
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✔ Nhân viên đến tận nơi</li>
                <li>✔ Giá rõ ràng, không phát sinh</li>
                <li>✔ Đặt lịch nhanh chóng</li>
                <li>✔ Hỗ trợ 24/7</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-3">📞 Liên hệ nhanh</h3>
              <p className="text-sm text-gray-600">
                Hotline: <span className="font-semibold">0123 456 789</span>
              </p>
              <p className="text-sm text-gray-600">
                Email: support@gardencare.vn
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;