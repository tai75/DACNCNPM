import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";
import ReviewModal from "../components/ReviewModal";

function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  const [reviewingBooking, setReviewingBooking] = useState(null);
  const [reviewedBookings, setReviewedBookings] = useState(new Set());
  const imageBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "").replace(/\/api$/, "");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings");
        setBookings(res.data?.data || []);

        // Check which bookings have been reviewed
        const completedBookings = (res.data?.data || []).filter(b => b.status === "completed");
        const reviewStatuses = await Promise.all(
          completedBookings.map(b => 
            api.get(`/reviews/check/${b.id}`)
              .then(r => r.data)
              .catch(() => ({ hasReview: false }))
          )
        );

        const reviewedIds = new Set();
        completedBookings.forEach((booking, idx) => {
          if (reviewStatuses[idx].hasReview) {
            reviewedIds.add(booking.id);
          }
        });
        setReviewedBookings(reviewedIds);
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

  const getServiceImageUrl = (image) => {
    if (!image) return "/images/sanvuon4.avif";
    if (/^https?:\/\//i.test(image)) return image;
    return `${imageBaseUrl}/uploads/${image}`;
  };

  const getBookingServiceItems = (booking) => {
    if (Array.isArray(booking?.service_items) && booking.service_items.length > 0) {
      return booking.service_items;
    }

    return [
      {
        service_name: booking.service_name,
        unit_price: booking.service_price,
        quantity: 1,
        service_image: booking.service_image || "",
      },
    ];
  };

  const canCancelBooking = (booking) => ["pending", "confirmed"].includes(booking.status);

  const handleReviewSuccess = (bookingId) => {
    setReviewedBookings(prev => new Set([...prev, bookingId]));
  };

  const getFirstService = (booking) => {
    const items = getBookingServiceItems(booking);
    if (items.length > 0) {
      // Return service info from first item
      return {
        id: booking.service_id, // fallback to service_id
        name: items[0].service_name,
        image: items[0].service_image,
      };
    }
    return { id: booking.service_id, name: booking.service_name, image: "" };
  };

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
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Ảnh dịch vụ</p>
                  <div className="mt-4 flex items-center">
                    {getBookingServiceItems(booking)
                      .slice(0, 3)
                      .map((item, index) => (
                        <img
                          key={`${booking.id}-thumb-${item.service_id || item.service_name || index}`}
                          src={getServiceImageUrl(item.service_image)}
                          alt={item.service_name || "Dịch vụ"}
                          className={`h-16 w-16 rounded-xl border-2 border-white object-cover shadow-sm ${index > 0 ? "-ml-4" : ""}`}
                        />
                      ))}

                    {getBookingServiceItems(booking).length > 3 && (
                      <div className="-ml-4 inline-flex h-16 w-16 items-center justify-center rounded-xl border-2 border-white bg-emerald-600 text-sm font-bold text-white shadow-sm">
                        +{getBookingServiceItems(booking).length - 3}
                      </div>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    {getBookingServiceItems(booking).length} dịch vụ trong booking này
                  </p>
                </div>

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

                    <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      {getBookingServiceItems(booking).map((item, index) => (
                        <div
                          key={`${booking.id}-${item.service_id || item.service_name || index}`}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <span className="text-slate-700">
                            {index + 1}. {item.service_name}
                            {Number(item.quantity || 1) > 1 ? ` x${item.quantity}` : ""}
                          </span>
                          <span className="font-semibold text-emerald-700">
                            {(Number(item.unit_price || 0) * Number(item.quantity || 1)).toLocaleString("vi-VN")} đ
                          </span>
                        </div>
                      ))}
                    </div>

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
                      onClick={() => navigate(`/bookings/${booking.id}`)}
                      className="rounded-lg bg-emerald-50 border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Xem chi tiết
                    </button>
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
                    {booking.status === "completed" && !reviewedBookings.has(booking.id) && (
                      <button
                        type="button"
                        onClick={() => setReviewingBooking(booking)}
                        className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-600 transition hover:bg-amber-100"
                      >
                        Viết đánh giá
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {reviewingBooking && (
        <ReviewModal
          booking={reviewingBooking}
          service={getFirstService(reviewingBooking)}
          onClose={() => setReviewingBooking(null)}
          onSuccess={() => handleReviewSuccess(reviewingBooking.id)}
        />
      )}
    </section>
  );
}

export default Bookings;
