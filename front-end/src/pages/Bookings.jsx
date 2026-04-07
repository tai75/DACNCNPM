import { useEffect, useMemo, useState } from "react";
import api from "../config/axios";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  const imageBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "").replace(/\/api$/, "");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings");
        setBookings(res.data?.data || []);
      } catch (err) {
        console.error("Load my bookings error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const statusStyle = useMemo(
    () => ({
      completed: "bg-emerald-100 text-emerald-700",
      confirmed: "bg-sky-100 text-sky-700",
      pending: "bg-amber-100 text-amber-700",
      in_progress: "bg-indigo-100 text-indigo-700",
      cancelled: "bg-rose-100 text-rose-700",
      paid: "bg-emerald-100 text-emerald-700",
    }),
    []
  );

  const timeSlotLabel = (slot) => {
    if (slot === "morning") return "Buổi sáng";
    if (slot === "afternoon") return "Buổi chiều";
    return slot || "Chưa cập nhật";
  };

  const getServiceImage = (booking) => {
    if (!booking?.service_image) return "/images/sanvuon4.avif";
    if (/^https?:\/\//i.test(booking.service_image)) return booking.service_image;
    return `${imageBaseUrl}/uploads/${booking.service_image}`;
  };

  const canCancelBooking = (booking) => ["pending", "confirmed"].includes(booking.status);

  const handleCancelBooking = async (bookingId) => {
    const accepted = window.confirm("Bạn có chắc muốn hủy đặt lịch này không?");
    if (!accepted) return;

    try {
      setCancelingId(bookingId);
      const res = await api.delete(`/bookings/${bookingId}`);
      if (res.data?.success) {
        setBookings((prev) => prev.filter((item) => item.id !== bookingId));
        return;
      }
      alert(res.data?.message || "Không thể hủy đặt lịch");
    } catch (error) {
      console.error("Cancel booking error:", error);
      alert(error.response?.data?.message || "Không thể hủy đặt lịch");
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[45vh] w-full items-center justify-center py-8">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <section className="w-full py-8 md:py-10">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Lịch sử</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-800">Lịch sử đặt lịch của bạn</h1>
        <p className="mt-2 text-sm text-slate-500">Theo dõi trạng thái đơn đặt gần đây và thông tin thanh toán.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="card-soft p-8 text-center text-slate-500">Bạn chưa có lịch đặt nào.</div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="grid gap-4 p-4 md:grid-cols-[210px_1fr] md:items-stretch">
                <img
                  src={getServiceImage(booking)}
                  alt={booking.service_name}
                  className="h-44 w-full rounded-xl object-cover"
                />

                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Mã #{booking.id}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyle[booking.status] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {booking.status_vietnamese || booking.status}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyle[booking.payment_status] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {booking.payment_status_vietnamese || booking.payment_status}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800">{booking.service_name}</h2>

                    <div className="mt-3 grid gap-1 text-sm text-slate-600 md:grid-cols-2">
                      <p>
                        <b>Ngày:</b> {new Date(booking.booking_date).toLocaleDateString("vi-VN")}
                      </p>
                      <p>
                        <b>Khung giờ:</b> {timeSlotLabel(booking.time_slot)}
                      </p>
                      <p className="md:col-span-2 break-all">
                        <b>Địa chỉ:</b> {booking.address}
                      </p>
                      <p className="md:col-span-2 text-base font-bold text-emerald-700">
                        Tổng tiền: {Number(booking.service_price || 0).toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                      Mã booking: #{booking.id}
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Thanh toán: {booking.payment_method_vietnamese || booking.payment_method}
                    </button>
                    {canCancelBooking(booking) && (
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancelingId === booking.id}
                        className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {cancelingId === booking.id ? "Đang hủy..." : "Hủy đặt lịch"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Bookings;
