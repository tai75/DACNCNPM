import { useEffect, useMemo, useState } from "react";
import api from "../config/axios";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
      cancelled: "bg-rose-100 text-rose-700",
    }),
    []
  );

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
      </div>

      {bookings.length === 0 ? (
        <div className="card-soft p-8 text-center text-slate-500">Bạn chưa có lịch đặt nào.</div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="card-soft card-interactive flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Mã #{booking.id}</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-800">{booking.service_name}</h2>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                  <span>{new Date(booking.booking_date).toLocaleDateString("vi-VN")}</span>
                  <span>{booking.time_slot}</span>
                  <span className="font-semibold text-emerald-700">
                    {Number(booking.price || 0).toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>

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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Bookings;
