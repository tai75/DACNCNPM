import { useEffect, useMemo, useState } from "react";
import api from "../../config/axios";

function AdminRefunds() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refundingId, setRefundingId] = useState(null);
  const [searchText, setSearchText] = useState("");

  const imageBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "").replace(/\/api$/, "");

  const getServiceItems = (booking) => {
    if (Array.isArray(booking?.service_items) && booking.service_items.length > 0) return booking.service_items;
    return [
      {
        service_name: booking.service_name,
        service_image: booking.service_image,
        quantity: 1,
        unit_price: booking.service_price,
      },
    ];
  };

  const getServiceImageUrl = (image) => {
    if (!image) return "/images/sanvuon4.avif";
    if (/^https?:\/\//i.test(image)) return image;
    return `${imageBaseUrl}/uploads/${image}`;
  };

  // Hàm xóa dấu tiếng Việt để tìm kiếm chính xác
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings");
      setBookings(res.data?.data || []);
    } catch (error) {
      console.error("Load refund bookings error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const pendingRefunds = useMemo(() => {
    return bookings.filter(
      (booking) => booking.status === "cancelled" && booking.payment_method === "bank" && booking.payment_status === "paid"
    );
  }, [bookings]);

  const completedRefunds = useMemo(() => {
    return bookings.filter((booking) => booking.payment_status === "refunded");
  }, [bookings]);

  const filteredPendingRefunds = pendingRefunds.filter((booking) => {
    const keyword = removeVietnameseTones(`${booking.user_name || ""} ${booking.service_name || ""} ${booking.address || ""}`);
    return keyword.includes(removeVietnameseTones(searchText.trim()));
  });

  const handleRefund = async (booking) => {
    const accepted = window.confirm(
      `Xác nhận hoàn tiền cho booking #${booking.id} gồm ${getServiceItems(booking).length} dịch vụ?`
    );
    if (!accepted) return;

    try {
      setRefundingId(booking.id);
      await api.put(`/bookings/${booking.id}/payment`, { payment_status: "refunded" });
      fetchBookings();
    } catch (error) {
      console.error("Refund booking error:", error);
      window.alert(error?.message || error?.response?.data?.message || "Không thể hoàn tiền");
    } finally {
      setRefundingId(null);
    }
  };

  const BookingCard = ({ booking, actionLabel, onAction, actionDisabled = false }) => {
    const items = getServiceItems(booking);
    const total = items.reduce((sum, item) => sum + Number(item.unit_price || 0) * Number(item.quantity || 1), 0);

    return (
      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
        <div className="grid gap-4 p-4 md:grid-cols-[180px_1fr_auto] md:items-start">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex gap-2">
              {items.slice(0, 3).map((item, index) => (
                <img
                  key={`${booking.id}-${item.service_id || item.service_name || index}`}
                  src={getServiceImageUrl(item.service_image)}
                  alt={item.service_name || "Dịch vụ"}
                  className={`h-14 w-14 rounded-xl object-cover shadow-sm ${index > 0 ? "-ml-3" : ""}`}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">{items.length} dịch vụ</p>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">Booking #{booking.id}</h3>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Chờ hoàn tiền
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{booking.user_name}</p>
            <p className="mt-2 text-sm text-slate-600">{booking.address}</p>

            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              {items.map((item, index) => (
                <div key={`${booking.id}-${item.service_id || item.service_name || index}`} className="flex items-center justify-between gap-4 py-1 text-sm">
                  <span className="text-slate-700">
                    {index + 1}. {item.service_name}
                  </span>
                  <span className="font-semibold text-emerald-700">
                    {(Number(item.quantity || 1) * Number(item.unit_price || 0)).toLocaleString("vi-VN")} đ
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1">Thanh toán: {booking.payment_method_vietnamese || booking.payment_method}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Ngày: {new Date(booking.booking_date).toLocaleDateString("vi-VN")}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Tổng: {total.toLocaleString("vi-VN")} đ</span>
            </div>
          </div>

          <div className="flex h-full flex-col justify-between gap-3 md:items-end">
            <p className="text-sm text-slate-500">Khách hàng</p>
            <p className="text-base font-semibold text-slate-900">{booking.user_name}</p>
            <button
              type="button"
              onClick={() => onAction(booking)}
              disabled={actionDisabled || refundingId === booking.id}
              className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refundingId === booking.id ? "Đang xử lý..." : actionLabel}
            </button>
          </div>
        </div>
      </article>
    );
  };

  const summary = {
    pending: pendingRefunds.length,
    refunded: completedRefunds.length,
  };

  return (
    <div className="space-y-6 reveal-up">
      <div className="card-soft overflow-hidden bg-gradient-to-r from-slate-900 via-rose-900 to-rose-700 p-6 text-white md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-rose-200">Admin workspace</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Hoàn tiền booking</h1>
            <p className="mt-2 max-w-2xl text-sm text-rose-50/85">
              Chỉ hiển thị các đơn đã hủy và thanh toán qua ngân hàng. Hoàn tiền được xử lý ở màn riêng này.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-sm">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.pending}</div>
              <div className="text-white/75">Chờ hoàn tiền</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.refunded}</div>
              <div className="text-white/75">Đã hoàn tiền</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-soft p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Danh sách chờ hoàn tiền</h2>
            <p className="text-sm text-slate-500">Tìm kiếm theo tên khách, dịch vụ hoặc địa chỉ.</p>
          </div>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Tìm booking cần hoàn tiền"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100 lg:max-w-md"
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="card-soft p-8 text-center text-slate-500">Đang tải danh sách hoàn tiền...</div>
        ) : filteredPendingRefunds.length === 0 ? (
          <div className="card-soft p-8 text-center text-slate-500">Không có booking nào đang chờ hoàn tiền.</div>
        ) : (
          filteredPendingRefunds.map((booking) => (
            <BookingCard key={booking.id} booking={booking} actionLabel="Xác nhận hoàn tiền" onAction={handleRefund} />
          ))
        )}
      </div>

      <div className="card-soft p-5 md:p-6">
        <h2 className="text-lg font-bold text-slate-800">Đã hoàn tiền</h2>
        <p className="text-sm text-slate-500">Lịch sử các booking đã xử lý hoàn tiền.</p>

        <div className="mt-4 space-y-4">
          {completedRefunds.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              Chưa có booking nào đã hoàn tiền.
            </div>
          ) : (
            completedRefunds.map((booking) => (
              <BookingCard key={booking.id} booking={booking} actionLabel="Đã hoàn tiền" onAction={() => {}} actionDisabled />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminRefunds;