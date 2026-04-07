import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../config/axios";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();

  const serviceData = location.state || {};
  const hasSelectedService = Boolean(serviceData.id || serviceData.service);
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    bookingDate: "",
    timeSlot: "",
  });
  const [userBookings, setUserBookings] = useState([]);

  const summary = useMemo(
    () =>
      hasSelectedService
        ? {
            id: serviceData.id || "--",
            service: serviceData.service || "Dịch vụ đã chọn",
            price: serviceData.price || 0,
            image: serviceData.image || "",
            note: "Kỹ thuật viên xác nhận chi tiết trước khi đến tận nơi.",
          }
        : null,
    [hasSelectedService, serviceData.id, serviceData.image, serviceData.price, serviceData.service]
  );

  useEffect(() => {
    const fetchUserBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await api.get("/bookings", { params: { page: 1, limit: 100 } });
        setUserBookings(res.data?.data || []);
      } catch (error) {
        console.error("Load user bookings error:", error);
      }
    };

    fetchUserBookings();
  }, []);

  const hasTimeSlotConflict = useMemo(() => {
    if (!formData.bookingDate || !formData.timeSlot) return false;

    const blockedStatuses = new Set(["pending", "confirmed", "in_progress"]);
    return userBookings.some((booking) => {
      if (!blockedStatuses.has(booking.status)) return false;
      const bookedDate = new Date(booking.booking_date).toISOString().slice(0, 10);
      return bookedDate === formData.bookingDate && booking.time_slot === formData.timeSlot;
    });
  }, [formData.bookingDate, formData.timeSlot, userBookings]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!summary) {
      alert("Vui lòng chọn dịch vụ trước khi đặt lịch.");
      navigate("/services");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Vui lòng đăng nhập!");
      navigate("/login");
      return;
    }

    if (hasTimeSlotConflict) {
      alert("Bạn đã có lịch hẹn trong khung giờ này. Vui lòng chọn khung giờ khác.");
      return;
    }

    navigate("/payment", {
      state: {
        service_id: summary.id,
        booking_date: formData.bookingDate,
        time_slot: formData.timeSlot,
        address: formData.address,
        service: summary.service,
        price: summary.price,
        image: summary.image,
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
              required
            />
          </div>

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
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Ngày đặt lịch</label>
              <input
                type="date"
                name="bookingDate"
                min={today}
                value={formData.bookingDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Khung giờ</label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                required
              >
                <option value="" disabled>Chọn khung giờ</option>
                <option value="morning">Buổi sáng (07:00 - 11:00)</option>
                <option value="afternoon">Buổi chiều (13:00 - 17:00)</option>
              </select>
              {hasTimeSlotConflict && (
                <p className="mt-2 text-sm font-medium text-rose-600">
                  Bạn đã có lịch hẹn trong khung giờ này. Vui lòng chọn khung giờ khác.
                </p>
              )}
            </div>
          </div>

          <button
            className="rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!summary || hasTimeSlotConflict}
          >
            Tiếp tục tới thanh toán
          </button>
        </form>

        <aside className="card-soft h-fit p-6 md:p-7 lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Tóm tắt dịch vụ</p>
          {summary ? (
            <>
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
            </>
          ) : (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Bạn chưa chọn dịch vụ. Vui lòng vào trang dịch vụ để chọn gói trước khi đặt lịch.
              <button
                type="button"
                onClick={() => navigate("/services")}
                className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
              >
                Chọn dịch vụ ngay
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Booking;