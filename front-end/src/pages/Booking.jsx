<<<<<<< HEAD
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
=======
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();

<<<<<<< HEAD
  const serviceData = location.state || {};

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const summary = useMemo(
    () => ({
      id: serviceData.id || 1,
      service: serviceData.service || "Chăm cây bài bản theo gói chuyên sâu",
      price: serviceData.price || 790000,
      note: "Kỹ thuật viên xác nhận chi tiết trước khi đến tận nơi.",
    }),
    [serviceData.id, serviceData.price, serviceData.service]
  );
=======
  const serviceData = location.state;

  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState({
    service_id: "",
    booking_date: "",
    time_slot: "",
    address: "",
  });

  // 🔥 Load services từ DB
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.log(err));
  }, []);

  // 🔥 Auto fill nếu đi từ Services
  useEffect(() => {
    if (serviceData) {
      setFormData((prev) => ({
        ...prev,
        service_id: serviceData.id || "",
      }));
    }
  }, [serviceData]);
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

<<<<<<< HEAD
=======
  // 🔥 Submit
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Vui lòng đăng nhập!");
      navigate("/login");
      return;
    }

<<<<<<< HEAD
    const today = new Date().toISOString().split('T')[0];
    navigate("/payment", {
      state: {
        service_id: summary.id,
        booking_date: today,
        time_slot: "morning",
        address: formData.address,
        service: summary.service,
        price: summary.price,
        fullName: formData.fullName,
        phone: formData.phone,
      },
    });
  };

  return (
    <div className="w-full py-8 md:py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="card-soft grid gap-5 p-6 md:p-8 lg:col-span-2">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Bước 1</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-800">Đặt lịch chăm sóc</h1>
            <p className="mt-2 text-sm text-slate-500">Điền thông tin để xác nhận lịch hẹn với kỹ thuật viên.</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Họ tên</label>
            <input
              type="text"
              name="fullName"
              placeholder="Nhập họ tên của bạn"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
=======
    const bookingData = {
      user_id: user.id,
      service_id: formData.service_id,
      booking_date: formData.booking_date,
      time_slot: formData.time_slot,
      address: formData.address,
    };

    try {
      // Không tạo booking ở đây nữa, chuyển đến Payment để chọn phương thức thanh toán
      const selectedServiceInfo = services.find(s => s.id == formData.service_id);

      const bookingData = {
        service_id: parseInt(formData.service_id),
        booking_date: formData.booking_date,
        time_slot: formData.time_slot,
        address: formData.address,
        service: selectedServiceInfo?.name || 'Dịch vụ',
        price: selectedServiceInfo?.price || 0
      };

      navigate("/payment", {
        state: bookingData
      });
    } catch (err) {
      console.log(err);
      alert("Có lỗi xảy ra!");
    }
  };

  // 👉 lấy thông tin service đang chọn
  const selectedService = services.find(
    (s) => s.id == formData.service_id
  );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl">

        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
          📅 Đặt lịch chăm sóc cây
        </h1>

        <form onSubmit={handleSubmit} className="grid gap-5">

          {/* SERVICE */}
          <div>
            <label className="text-sm text-gray-600">Dịch vụ</label>
            <select
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            >
              <option value="">Chọn dịch vụ</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {selectedService && (
              <p className="text-green-600 mt-2 font-semibold">
                Giá: {selectedService.price?.toLocaleString()}đ
              </p>
            )}
          </div>

          {/* DATE */}
          <div>
            <label className="text-sm text-gray-600">Ngày</label>
            <input
              type="date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
              required
            />
          </div>

<<<<<<< HEAD
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              placeholder="Ví dụ: 09xxxxxxxx"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Địa chỉ</label>
            <input
              type="text"
              name="address"
              placeholder="Số nhà, đường, quận/huyện"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
=======
          {/* TIME SLOT */}
          <div>
            <label className="text-sm text-gray-600">Khung giờ</label>
            <select
              name="time_slot"
              value={formData.time_slot}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            >
              <option value="">Chọn khung giờ</option>
              <option value="08:00-10:00">08:00 - 10:00</option>
              <option value="10:00-12:00">10:00 - 12:00</option>
              <option value="13:00-15:00">13:00 - 15:00</option>
              <option value="15:00-17:00">15:00 - 17:00</option>
            </select>
          </div>

          {/* ADDRESS */}
          <div>
            <label className="text-sm text-gray-600">Địa chỉ</label>
            <input
              type="text"
              name="address"
              placeholder="Nhập địa chỉ"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
              required
            />
          </div>

<<<<<<< HEAD
          <button className="rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700">
            Tiếp tục tới thanh toán
          </button>
        </form>

        <aside className="card-soft h-fit p-6 md:p-7 lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Tóm tắt dịch vụ</p>
          <h2 className="mt-2 text-xl font-bold text-slate-800">{summary.service}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{summary.note}</p>

          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Mã dịch vụ</span>
              <span className="font-semibold text-slate-800">#{summary.id}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
              <span>Tạm tính</span>
              <span className="text-lg font-extrabold text-emerald-700">
                {Number(summary.price).toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Lịch hẹn sẽ được xác nhận qua điện thoại sau khi bạn hoàn tất bước thanh toán.
          </p>
        </aside>
=======
          {/* BUTTON */}
          <button className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:opacity-90">
            Xác nhận đặt lịch
          </button>

        </form>
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
      </div>
    </div>
  );
}

export default Booking;