import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../config/axios";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();

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
    api
      .get("/services")
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Vui lòng đăng nhập!");
      navigate("/login");
      return;
    }

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
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-10">
      <div className="card-soft grid gap-8 p-6 md:grid-cols-5 md:p-8">
        <div className="md:col-span-2">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Bước 1</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-800">Đặt lịch chăm sóc</h1>
          <p className="mt-3 text-sm text-slate-500">
            Chọn dịch vụ, ngày thực hiện và địa chỉ. Sau đó bạn sẽ chuyển sang bước thanh toán.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:col-span-3">
          <div>
            <label className="mb-1 block text-sm text-slate-600">Dịch vụ</label>
            <select
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
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
              <p className="mt-2 font-semibold text-emerald-700">
                Giá: {Number(selectedService.price || 0).toLocaleString("vi-VN")} đ
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Ngày</label>
            <input
              type="date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Khung giờ</label>
            <select
              name="time_slot"
              value={formData.time_slot}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              required
            >
              <option value="">Chọn khung giờ</option>
              <option value="morning">Sáng (08:00 - 12:00)</option>
              <option value="afternoon">Chiều (13:00 - 17:00)</option>
              <option value="evening">Tối (18:00 - 21:00)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Địa chỉ</label>
            <input
              type="text"
              name="address"
              placeholder="Nhập địa chỉ"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>

          <button className="rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700">
            Tiếp tục tới thanh toán
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;