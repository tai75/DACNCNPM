import { useEffect, useState } from "react";
import api from "../../config/axios";

function StaffBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payingBookingId, setPayingBookingId] = useState(null);

  const summary = bookings.reduce(
    (accumulator, booking) => {
      accumulator.total += 1;
      accumulator[booking.status] = (accumulator[booking.status] || 0) + 1;
      return accumulator;
    },
    { total: 0, confirmed: 0, in_progress: 0, not_completed: 0, completed: 0 }
  );

  const statusMeta = {
    confirmed: {
      label: "Đã xác nhận",
      chip: "bg-blue-100 text-blue-700",
      option: "text-blue-700",
    },
    in_progress: {
      label: "Đang thực hiện",
      chip: "bg-amber-100 text-amber-700",
      option: "text-amber-700",
    },
    not_completed: {
      label: "Chưa hoàn thành",
      chip: "bg-rose-100 text-rose-700",
      option: "text-rose-700",
    },
    completed: {
      label: "Hoàn thành",
      chip: "bg-emerald-100 text-emerald-700",
      option: "text-emerald-700",
    },
  };

  const timeSlotLabel = (slot) => {
    if (slot === "morning") return "Buổi sáng";
    if (slot === "afternoon") return "Buổi chiều";
    return slot || "Chưa cập nhật";
  };

  const paymentMethodLabel = (method) => {
    if (method === "bank") return "Chuyển khoản";
    if (method === "cod") return "Tiền mặt";
    return method || "Chưa rõ";
  };

  const paymentStatusLabel = (status) => {
    if (status === "paid") return "Đã thanh toán";
    if (status === "pending") return "Chờ thanh toán";
    if (status === "refunded") return "Đã hoàn tiền";
    return status || "Chưa rõ";
  };

  const canStaffConfirmPayment = (booking) => {
    return booking?.payment_method === "cod" && booking?.status === "completed" && booking?.payment_status !== "paid";
  };

  const getServiceItems = (booking) => {
    if (Array.isArray(booking?.service_items) && booking.service_items.length > 0) {
      return booking.service_items;
    }

    return [
      {
        service_name: booking.service_name,
        unit_price: booking.service_price,
        quantity: 1,
      },
    ];
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings");
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Load bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      console.error("Update booking status error:", err);
    }
  };

  const handlePaymentStatusChange = async (booking) => {
    if (!canStaffConfirmPayment(booking)) return;

    try {
      setPayingBookingId(booking.id);
      await api.put(`/bookings/${booking.id}/payment`, { payment_status: "paid" });
      fetchBookings();
    } catch (err) {
      console.error("Update payment status error:", err);
      const message = err?.response?.data?.message || "Không thể cập nhật trạng thái thanh toán";
      window.alert(message);
    } finally {
      setPayingBookingId(null);
    }
  };

  return (
    <div className="reveal-up space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-600">Staff workspace</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">Lịch đặt được giao</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Chỉ hiển thị booking do admin phân công cho bạn. Nếu dịch vụ chưa hoàn thành, hãy đánh dấu rồi chờ admin đổi lịch trước khi xử lý tiếp.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-sm md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-2xl font-bold text-slate-800">{summary.total}</div>
              <div className="text-slate-500">Tổng việc</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-2xl font-bold text-slate-800">{summary.in_progress}</div>
              <div className="text-slate-500">Đang làm</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-2xl font-bold text-slate-800">{summary.not_completed}</div>
              <div className="text-slate-500">Chưa hoàn thành</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-2xl font-bold text-slate-800">{summary.completed}</div>
              <div className="text-slate-500">Hoàn thành</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-soft p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Danh sách công việc</h2>
            <p className="text-sm text-slate-500">Cập nhật trạng thái theo tiến độ thực tế của mỗi booking.</p>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
            {loading ? "Đang tải dữ liệu..." : `${bookings.length} booking`}
          </div>
        </div>

        <div className="table-wrap">
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Dịch vụ</th>
                <th className="px-4 py-3">Lịch hẹn</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thanh toán</th>
                <th className="px-4 py-3">Cập nhật</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {!loading && bookings.map((b) => {
                const currentMeta = statusMeta[b.status] || statusMeta.confirmed;
                return (
                  <tr key={b.id} className="align-top transition hover:bg-slate-50/70">
                    <td className="px-4 py-4 font-semibold text-slate-800">#{b.id}</td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-800">{b.user_name}</div>
                      <div className="text-sm text-slate-500">{b.address}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-800">{b.service_name}</div>
                      <div className="mt-1 space-y-1 text-xs text-slate-500">
                        {getServiceItems(b).map((item, index) => (
                          <div key={`${b.id}-${item.service_id || item.service_name || index}`}>
                            {index + 1}. {item.service_name}
                            {Number(item.quantity || 1) > 1 ? ` x${item.quantity}` : ""}
                          </div>
                        ))}
                      </div>
                      {Array.isArray(b.staff_names) && b.staff_names.length > 0 && (
                        <div className="mt-2 text-xs text-emerald-700">
                          Staff: {b.staff_names.join(", ")}
                        </div>
                      )}
                      <div className="text-sm text-slate-500">{new Date(b.booking_date).toLocaleDateString("vi-VN")}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      <div>{new Date(b.booking_date).toLocaleDateString("vi-VN")}</div>
                      <div className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {timeSlotLabel(b.time_slot)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge-status ${currentMeta.chip}`}>{currentMeta.label}</span>
                      <div className="mt-2 text-xs text-slate-400">Nếu chưa hoàn thành, chờ admin đổi lịch rồi mới xử lý tiếp</div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="mb-2 flex flex-wrap gap-2">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${b.payment_method === "bank" ? "bg-sky-100 text-sky-700" : "bg-violet-100 text-violet-700"}`}>
                          {paymentMethodLabel(b.payment_method)}
                        </span>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${b.payment_status === "paid" ? "bg-emerald-100 text-emerald-700" : b.payment_status === "refunded" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                          {paymentStatusLabel(b.payment_status)}
                        </span>
                      </div>

                      {canStaffConfirmPayment(b) ? (
                        <button
                          type="button"
                          onClick={() => handlePaymentStatusChange(b)}
                          disabled={payingBookingId === b.id}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          {payingBookingId === b.id ? "Đang cập nhật..." : "Xác nhận đã thanh toán"}
                        </button>
                      ) : (
                        <div className="text-xs text-slate-400">
                          {b.status === "not_completed"
                            ? "Đang chờ admin đổi lịch để xử lý tiếp"
                            : b.payment_method === "bank"
                            ? "Booking chuyển khoản: không cần staff cập nhật"
                            : b.status !== "completed"
                            ? "Chỉ cập nhật sau khi hoàn thành"
                            : "Đã cập nhật thanh toán"}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 ${currentMeta.option}`}
                      >
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="in_progress">Đang thực hiện</option>
                        <option value="not_completed">Chưa hoàn thành</option>
                        <option value="completed">Hoàn thành</option>
                      </select>
                    </td>
                  </tr>
                );
              })}

              {(!loading && bookings.length === 0) && (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                    Chưa có booking được phân công.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                    Đang tải danh sách booking...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StaffBookings;
