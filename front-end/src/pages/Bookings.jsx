import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";
import CancelBookingModal from "../components/CancelBookingModal";

function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [userRole, setUserRole] = useState("user");
  const imageBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "").replace(/\/api$/, "");

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("user");
      const role = rawUser ? JSON.parse(rawUser)?.role : "user";
      setUserRole(role || "user");
    } catch {
      setUserRole("user");
    }

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

  const normalizeText = (value) => String(value || "").trim().toLowerCase();

  const normalizeBookingStatus = (status) => {
    const normalized = normalizeText(status);

    if (["da huy", "đã hủy", "huy", "cancelled", "canceled"].includes(normalized)) return "cancelled";
    if (["da xac nhan", "đã xác nhận", "xac nhan", "confirmed"].includes(normalized)) return "confirmed";
    if (["dang xu ly", "đang xử lý", "in_progress", "in progress"].includes(normalized)) return "in_progress";
    if (["hoan thanh", "đã hoàn thành", "completed"].includes(normalized)) return "completed";
    if (["da thanh toan", "đã thanh toán", "paid"].includes(normalized)) return "paid";
    if (["da hoan tien", "đã hoàn tiền", "refunded"].includes(normalized)) return "refunded";

    return normalized;
  };

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

  const getPaymentStatusMeta = (booking) => {
    const bookingStatus = normalizeBookingStatus(booking.status);
    const paymentMethod = normalizeText(booking.payment_method);
    const paymentStatus = normalizeBookingStatus(booking.payment_status);

    if (bookingStatus === "cancelled" && paymentMethod === "bank" && paymentStatus === "paid") {
      return {
        label: "Chờ hoàn tiền",
        className: "bg-amber-100 text-amber-700",
      };
    }

    if (paymentStatus === "paid") {
      return { label: "Đã thanh toán", className: "bg-emerald-100 text-emerald-700" };
    }

    if (paymentStatus === "refunded") {
      return { label: "Đã hoàn tiền", className: "bg-rose-100 text-rose-700" };
    }

    return {
      label: booking.payment_status_vietnamese || booking.payment_status || "Chưa cập nhật",
      className: "bg-slate-100 text-slate-700",
    };
  };

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

  const canCancelBooking = (booking) => {
    const normalizedStatus = normalizeBookingStatus(booking?.status);

    if (normalizedStatus === "cancelled" || normalizedStatus === "completed") {
      return false;
    }

    if (userRole === "admin" || userRole === "staff") {
      return true;
    }

    return ["pending", "confirmed"].includes(normalizedStatus);
  };

  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
  };

  const closeCancelModal = () => {
    if (cancelingId) return;
    setBookingToCancel(null);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      setCancelingId(bookingToCancel.id);
      const res = await api.delete(`/bookings/${bookingToCancel.id}`);
      if (res.data?.success) {
        setBookings((prev) =>
          prev.map((item) =>
            item.id === bookingToCancel.id
              ? {
                  ...item,
                  status: "cancelled",
                  status_vietnamese: "Da huy",
                }
              : item
          )
        );
        setBookingToCancel(null);
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
                            statusStyle[normalizeBookingStatus(booking.status)] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {booking.status_vietnamese || booking.status}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusMeta(booking).className}`}
                        >
                          {getPaymentStatusMeta(booking).label}
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
                        onClick={() => openCancelModal(booking)}
                        disabled={cancelingId === booking.id}
                        className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Hủy đặt lịch
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {bookingToCancel && (
        <CancelBookingModal
          booking={bookingToCancel}
          serviceItems={getBookingServiceItems(bookingToCancel)}
          paymentLabel={bookingToCancel.payment_method_vietnamese || bookingToCancel.payment_method}
          loading={cancelingId === bookingToCancel.id}
          onClose={closeCancelModal}
          onConfirm={handleCancelBooking}
        />
      )}
    </section>
  );
}

export default Bookings;
