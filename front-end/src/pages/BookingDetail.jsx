import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../config/axios";
import CancelServiceItemModal from "../components/CancelServiceItemModal";
import CancelBookingModal from "../components/CancelBookingModal";
import {
  canCancelBooking,
  canCancelBookingItem,
  getBookingPaymentStatusMeta,
  getTimeSlotLabel,
  normalizeBookingStatus,
  normalizeItemStatus,
} from "../utils/booking";

function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelingItemId, setCancelingItemId] = useState(null);
  const [itemToCancel, setItemToCancel] = useState(null);
  const [cancelBookingLoading, setCancelBookingLoading] = useState(false);
  const [showCancelBookingModal, setShowCancelBookingModal] = useState(false);
  const imageBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "").replace(/\/api$/, "");

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        if (res.data?.success) {
          setBooking(res.data?.data);
        } else {
          alert(res.data?.message || "Không thể tải chi tiết booking");
          navigate("/bookings");
        }
      } catch (err) {
        console.error("Load booking detail error:", err);
        alert(err.response?.data?.message || "Không thể tải chi tiết booking");
        navigate("/bookings");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetail();
    }
  }, [id, navigate]);

  const statusStyle = useMemo(
    () => ({
      completed: "bg-emerald-100 text-emerald-700",
      confirmed: "bg-sky-100 text-sky-700",
      pending: "bg-amber-100 text-amber-700",
      in_progress: "bg-indigo-100 text-indigo-700",
      not_completed: "bg-rose-100 text-rose-700",
      cancelled: "bg-rose-100 text-rose-700",
      active: "bg-emerald-100 text-emerald-700",
    }),
    []
  );

  const getServiceImageUrl = (image) => {
    if (!image) return "/images/sanvuon4.avif";
    if (/^https?:\/\//i.test(image)) return image;
    return `${imageBaseUrl}/uploads/${image}`;
  };

  const getCancelItemConfirmMessage = () => {
    if (normalizeBookingStatus(booking?.payment_status) === "paid" && booking?.payment_method === "bank") {
      return "Dịch vụ này thuộc đơn đã thanh toán qua ngân hàng. Khi hủy, hệ thống sẽ ghi nhận để admin xác nhận hoàn tiền. Bạn có chắc muốn hủy không?";
    }

    return "Bạn có chắc muốn hủy dịch vụ này không?";
  };

  const resolveCancelItemKey = (item) => String(item?.cancel_key ?? item?.id ?? item?.service_id ?? "").trim();

  const openCancelModal = (item) => {
    setItemToCancel(item);
  };

  const closeCancelModal = () => {
    setItemToCancel(null);
  };

  const handleCancelItem = async (itemKey) => {
    const normalizedItemKey = String(itemKey ?? "").trim();

    if (!normalizedItemKey) {
      alert("Không thể hủy dịch vụ này vì thiếu mã dịch vụ hợp lệ.");
      return;
    }

    try {
      setCancelingItemId(normalizedItemKey);
      const res = await api.delete(`/bookings/${id}/items/${normalizedItemKey}`);
      if (res.data?.success) {
        setBooking((currentBooking) => {
          if (!currentBooking) return currentBooking;

          const updatedKey = Number(normalizedItemKey);

          return {
            ...currentBooking,
            service_items: (currentBooking.service_items || []).map((item) =>
              Number(item.id || item.service_id) === updatedKey
                ? {
                    ...item,
                    status: "cancelled",
                    item_status: "cancelled",
                  }
                : item
            ),
          };
        });
        alert("Hủy dịch vụ thành công!");
        closeCancelModal();
      } else {
        alert(res.data?.message || "Không thể hủy dịch vụ");
      }
    } catch (error) {
      console.error("Cancel item error:", error);
      alert(error.response?.data?.message || "Không thể hủy dịch vụ");
    } finally {
      setCancelingItemId(null);
    }
  };

  const openCancelBookingModal = () => {
    setShowCancelBookingModal(true);
  };

  const closeCancelBookingModal = () => {
    if (cancelBookingLoading) return;
    setShowCancelBookingModal(false);
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    try {
      setCancelBookingLoading(true);
      const res = await api.delete(`/bookings/${id}`);

      if (res.data?.success) {
        setBooking((currentBooking) =>
          currentBooking
            ? {
                ...currentBooking,
                status: "cancelled",
                status_vietnamese: "Da huy",
              }
            : currentBooking
        );
        alert("Hủy đặt lịch thành công!");
        setShowCancelBookingModal(false);
      } else {
        alert(res.data?.message || "Không thể hủy đặt lịch");
      }
    } catch (error) {
      console.error("Cancel booking error:", error);
      alert(error.response?.data?.message || "Không thể hủy đặt lịch");
    } finally {
      setCancelBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[45vh] w-full items-center justify-center py-8">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="card-soft p-8 text-center text-slate-500">
        Không tìm thấy booking này. Vui lòng quay lại danh sách.
      </div>
    );
  }

  const activeItems =
    booking.service_items?.filter((item) => normalizeItemStatus(item) === "active") || [];
  const cancelledItems =
    booking.service_items?.filter((item) => normalizeItemStatus(item) === "cancelled") || [];
  const totalPrice = booking.total_price || 0;
  const itemCancelKey = resolveCancelItemKey(itemToCancel);

  return (
    <section className="w-full py-8 md:py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Chi tiết booking</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-800">Mã #{booking.id}</h1>
          <p className="mt-2 text-sm text-slate-500">Xem chi tiết lịch sử đặt lịch và quản lý dịch vụ.</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {canCancelBooking(booking) && (
            <button
              type="button"
              onClick={openCancelBookingModal}
              disabled={cancelBookingLoading}
              className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelBookingLoading ? "Đang hủy..." : "Hủy đặt lịch"}
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate("/bookings")}
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Booking Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Thông tin đặt lịch</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Trạng thái booking</p>
                <p className="mt-1">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyle[normalizeBookingStatus(booking.status)] || "bg-slate-100 text-slate-700"}`}>
                    {booking.status_vietnamese || booking.status}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Trạng thái thanh toán</p>
                <p className="mt-1">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getBookingPaymentStatusMeta(booking).className}`}>
                    {getBookingPaymentStatusMeta(booking).label}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Ngày đặt</p>
                <p className="mt-1 text-slate-700">{new Date(booking.booking_date).toLocaleDateString("vi-VN")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Khung giờ</p>
                <p className="mt-1 text-slate-700">{getTimeSlotLabel(booking.time_slot)}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-semibold uppercase text-slate-500">Địa chỉ</p>
                <p className="mt-1 text-slate-700 break-words">{booking.address}</p>
              </div>
              {booking.note && (
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold uppercase text-slate-500">Ghi chú</p>
                  <p className="mt-1 text-slate-700 break-words">{booking.note}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <p className="text-xs font-semibold uppercase text-slate-500">Phương thức thanh toán</p>
                <p className="mt-1 text-slate-700">{booking.payment_method_vietnamese || booking.payment_method}</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Dịch vụ ({activeItems.length} dịch vụ)</h2>

            {activeItems.length === 0 ? (
              <p className="text-slate-500 text-center py-6">Tất cả dịch vụ đã bị hủy</p>
            ) : (
              <div className="space-y-3">
                {activeItems.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex gap-4 flex-1">
                      <img
                        src={getServiceImageUrl(item.service_image)}
                        alt={item.service_name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{item.service_name}</p>
                        <p className="text-sm text-slate-500">
                          {Number(item.quantity || 1)} × {(Number(item.unit_price || 0)).toLocaleString("vi-VN")} đ
                        </p>
                        <p className="mt-1 font-semibold text-emerald-700">
                          {(Number(item.unit_price || 0) * Number(item.quantity || 1)).toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                    </div>
                    {canCancelBookingItem(booking, item) && (
                      <button
                        type="button"
                        onClick={() => openCancelModal(item)}
                        disabled={cancelingItemId === item.id}
                        className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap"
                      >
                        {cancelingItemId === item.id ? "Đang hủy..." : "Hủy"}
                      </button>
                    )}
                    {normalizeItemStatus(item) === "cancelled" && (
                      <span className="rounded-full px-3 py-1 text-xs font-semibold bg-rose-100 text-rose-700">
                        Đã hủy
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {cancelledItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm font-semibold text-slate-600 mb-3">Dịch vụ đã hủy ({cancelledItems.length})</p>
                <div className="space-y-3">
                  {cancelledItems.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex items-start justify-between gap-4 rounded-lg border border-rose-200 bg-rose-50 p-4 opacity-60"
                    >
                      <div className="flex gap-4 flex-1">
                        <img
                          src={getServiceImageUrl(item.service_image)}
                          alt={item.service_name}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 line-through">{item.service_name}</p>
                          <p className="text-sm text-slate-500">
                            {Number(item.quantity || 1)} × {(Number(item.unit_price || 0)).toLocaleString("vi-VN")} đ
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full px-3 py-1 text-xs font-semibold bg-rose-100 text-rose-700 whitespace-nowrap">
                        Đã hủy
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-800 mb-4">Tóm tắt đơn hàng</h3>
            <div className="space-y-3 pb-4 border-b border-slate-200">
              <div className="flex justify-between text-sm">
                <p className="text-slate-600">Dịch vụ:</p>
                <p className="font-semibold text-slate-800">{activeItems.length} dịch vụ</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-slate-600">Tổng tiền:</p>
                <p className="font-bold text-lg text-emerald-700">{totalPrice.toLocaleString("vi-VN")} đ</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-slate-500">ID Booking</p>
              <p className="mt-1 font-mono text-sm font-semibold text-slate-700">#{booking.id}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Thông tin khách hàng</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-500">Tên</p>
                <p className="mt-1 text-slate-700">{booking.user_name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Email</p>
                <p className="mt-1 text-slate-700 break-all">{booking.user_email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Số điện thoại</p>
                <p className="mt-1 text-slate-700">{booking.user_phone}</p>
              </div>
            </div>
          </div>

          {/* Staff Info */}
          {booking.staff_names && booking.staff_names.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Nhân viên phụ trách</h3>
              <div className="space-y-2">
                {booking.staff_names.map((name, idx) => (
                  <p key={idx} className="text-sm text-slate-700">
                    • {name}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Booking Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Lịch sử</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-500">Ngày tạo</p>
                <p className="mt-1 text-slate-700">
                  {new Date(booking.created_at).toLocaleDateString("vi-VN")} lúc{" "}
                  {new Date(booking.created_at).toLocaleTimeString("vi-VN")}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Cập nhật lần cuối</p>
                <p className="mt-1 text-slate-700">
                  {new Date(booking.updated_at).toLocaleDateString("vi-VN")} lúc{" "}
                  {new Date(booking.updated_at).toLocaleTimeString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Service Item Modal */}
      {itemToCancel && (
        <CancelServiceItemModal
          item={itemToCancel}
          paymentLabel={booking.payment_method_vietnamese}
          paymentMethod={booking.payment_method}
          paymentStatus={booking.payment_status}
          loading={cancelingItemId === itemCancelKey}
          onClose={closeCancelModal}
          onConfirm={() => handleCancelItem(itemCancelKey)}
        />
      )}

      {showCancelBookingModal && booking && (
        <CancelBookingModal
          booking={booking}
          serviceItems={booking.service_items || []}
          paymentLabel={booking.payment_method_vietnamese || booking.payment_method}
          loading={cancelBookingLoading}
          onClose={closeCancelBookingModal}
          onConfirm={handleCancelBooking}
        />
      )}
    </section>
  );
}

export default BookingDetail;
