import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../config/axios";
import { getCartItems, getCartTotal, removeServiceFromCart } from "../utils/cart";

function Booking() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const imageBaseUrl = rawApiUrl.replace(/\/+$/, "").replace(/\/api$/, "");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    bookingDate: "",
    timeSlot: "",
  });
  const [cartItems, setCartItems] = useState([]);
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  const summary = useMemo(() => {
    if (cartItems.length === 0) return null;

    return {
      count: cartItems.length,
      totalPrice: getCartTotal(),
      services: cartItems,
    };
  }, [cartItems]);

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
      alert("Giỏ hàng đang trống. Vui lòng thêm dịch vụ trước khi đặt lịch.");
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
        service_id: summary.services[0].id,
        service_ids: summary.services.map((item) => item.id),
        booking_date: formData.bookingDate,
        time_slot: formData.timeSlot,
        address: formData.address,
        service: summary.services.map((item) => item.name).join(", "),
        services: summary.services,
        price: summary.totalPrice,
        image: summary.services[0].image,
        note: `Đặt cùng lúc ${summary.count} dịch vụ: ${summary.services
          .map((item) => item.name)
          .join(", ")}`,
        fullName: formData.fullName,
        phone: formData.phone,
      },
    });
  };

  const handleRemoveItem = (serviceId) => {
    const nextItems = removeServiceFromCart(serviceId);
    setCartItems(nextItems);
  };

  const getServiceImageUrl = (image) => {
    if (!image) return "/images/sanvuon3.avif";
    if (/^https?:\/\//i.test(image)) return image;
    return `${imageBaseUrl}/uploads/${image}`;
  };

  return (
    <div className="w-full py-8 md:py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="card-soft grid gap-5 p-6 md:p-8 lg:col-span-2">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Bước 1</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-800">Giỏ hàng đặt lịch</h1>
            <p className="mt-2 text-sm text-slate-500">Bạn có thể gom nhiều dịch vụ rồi đặt lịch một lần.</p>
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
            Đặt lịch và thanh toán
          </button>
        </form>

        <aside className="card-soft h-fit p-6 md:p-7 lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Giỏ dịch vụ</p>
          {summary ? (
            <>
              <h2 className="mt-2 text-xl font-bold text-slate-800">{summary.count} dịch vụ đã chọn</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Kiểm tra lại dịch vụ trước khi bấm đặt lịch.</p>

              <div className="mt-4 space-y-3">
                {summary.services.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={getServiceImageUrl(item.image)}
                        alt={item.name}
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-semibold text-slate-800">{item.name}</p>
                        <p className="text-sm font-bold text-emerald-700">
                          {Number(item.price).toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="mt-3 w-full rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                    >
                      Xóa khỏi giỏ
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Số lượng</span>
                  <span className="font-semibold text-slate-800">{summary.count} dịch vụ</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                  <span>Tạm tính</span>
                  <span className="text-lg font-extrabold text-emerald-700">
                    {Number(summary.totalPrice).toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Lịch hẹn sẽ được xác nhận qua điện thoại sau khi bạn hoàn tất bước thanh toán.
              </p>
            </>
          ) : (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Giỏ hàng đang trống. Vui lòng vào trang dịch vụ để thêm gói trước khi đặt lịch.
              <button
                type="button"
                onClick={() => navigate("/services")}
                className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
              >
                Đi tới danh sách dịch vụ
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Booking;