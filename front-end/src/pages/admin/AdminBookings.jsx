import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

function AdminBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStaffByBooking, setSelectedStaffByBooking] = useState({});
  const [scheduleByBooking, setScheduleByBooking] = useState({});

  const toDateInputValue = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayInputValue = (() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();

  // Hàm xóa dấu tiếng Việt để tìm kiếm chính xác
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // ================= LOAD DATA =================
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings");
      const nextBookings = res.data.data || res.data;
      setBookings(nextBookings);
      setSelectedStaffByBooking(
        nextBookings.reduce((accumulator, booking) => {
          accumulator[booking.id] = Array.isArray(booking.staff_ids) ? booking.staff_ids.map(Number) : [];
          return accumulator;
        }, {})
      );
      setScheduleByBooking(
        nextBookings.reduce((accumulator, booking) => {
          accumulator[booking.id] = {
            booking_date: toDateInputValue(booking.booking_date),
            time_slot: booking.time_slot || "morning",
          };
          return accumulator;
        }, {})
      );
    } catch (err) {
      console.error("Lỗi load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffs = async () => {
    try {
      const res = await api.get("/admin/users");
      const allUsers = res.data?.data || [];
      setStaffs(allUsers.filter((u) => u.role === "staff"));
    } catch (err) {
      console.error("Lỗi load staffs:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchStaffs();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (booking) => {
    const confirmMessage =
      booking.payment_method === "bank" && booking.payment_status === "paid"
        ? "Đơn này đã thanh toán qua ngân hàng. Khi hủy, hệ thống sẽ chuyển sang trạng thái chờ hoàn tiền. Bạn có chắc muốn hủy không?"
        : "Bạn có chắc muốn hủy đơn này?";

    if (!window.confirm(confirmMessage)) return;

    try {
      await api.delete(`/bookings/${booking.id}`);
      fetchBookings();
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };

  // ================= UPDATE PAYMENT STATUS =================
  const handlePaymentStatusChange = async (id, payment_status) => {
    if (payment_status === "refunded" && !window.confirm("Xác nhận hoàn tiền cho booking đã hủy này?")) {
      return;
    }

    try {
      await api.put(`/bookings/${id}/payment`, {
        payment_status,
      });
      fetchBookings();
    } catch (err) {
      console.error("Lỗi cập nhật payment status:", err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      console.error("Lỗi cập nhật status:", err);
    }
  };

  const handleAssignStaff = async (id, staffIds) => {
    if (!Array.isArray(staffIds) || staffIds.length === 0) return;
    try {
      await api.put(`/bookings/${id}/assign-staff`, { staff_ids: staffIds.map((value) => Number(value)).filter(Boolean) });
      fetchBookings();
    } catch (err) {
      console.error("Lỗi gán nhân viên:", err);
    }
  };

  const handleScheduleInputChange = (bookingId, field, value) => {
    setScheduleByBooking((prev) => ({
      ...prev,
      [bookingId]: {
        booking_date: prev?.[bookingId]?.booking_date || "",
        time_slot: prev?.[bookingId]?.time_slot || "morning",
        [field]: value,
      },
    }));
  };

  const handleReschedule = async (bookingId) => {
    const form = scheduleByBooking[bookingId];
    if (!form?.booking_date || !form?.time_slot) {
      window.alert("Vui lòng chọn đủ ngày và khung giờ trước khi đổi lịch");
      return;
    }

    try {
      await api.put(`/bookings/${bookingId}/schedule`, {
        booking_date: form.booking_date,
        time_slot: form.time_slot,
      });
      fetchBookings();
    } catch (err) {
      console.error("Lỗi đổi lịch booking:", err);
      window.alert(err?.message || "Đổi lịch thất bại");
    }
  };

  const handleStaffSelectionChange = (bookingId, staffId, checked) => {
    setSelectedStaffByBooking((prev) => {
      const current = Array.isArray(prev[bookingId]) ? prev[bookingId] : [];
      const next = checked
        ? [...new Set([...current, Number(staffId)])]
        : current.filter((value) => Number(value) !== Number(staffId));

      return { ...prev, [bookingId]: next };
    });
  };

  const timeSlotLabel = (slot) => {
    if (slot === "morning") return "Buổi sáng";
    if (slot === "afternoon") return "Buổi chiều";
    return slot;
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

  const getPaymentStatusMeta = (booking) => {
    if (booking.payment_status === "paid") {
      return {
        label: "Đã thanh toán",
        cls: "bg-emerald-100 text-emerald-700",
      };
    }

    if (booking.payment_status === "refunded") {
      return {
        label: "Đã hoàn tiền",
        cls: "bg-rose-100 text-rose-700",
      };
    }

    return {
      label: booking.payment_status_vietnamese || booking.payment_status || "Chưa cập nhật",
      cls: "bg-amber-100 text-amber-700",
    };
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchStatus = statusFilter === "all" || booking.status === statusFilter;
    const servicesKeyword = getServiceItems(booking)
      .map((item) => item.service_name || "")
      .join(" ");
    const keyword = removeVietnameseTones(`${booking.user_name || ""} ${booking.service_name || ""} ${servicesKeyword} ${booking.staff_name || ""}`);
    const matchSearch = keyword.includes(removeVietnameseTones(searchText.trim()));
    return matchStatus && matchSearch;
  });

  const summary = bookings.reduce(
    (accumulator, booking) => {
      accumulator.total += 1;
      accumulator[booking.status] = (accumulator[booking.status] || 0) + 1;
      return accumulator;
    },
    { total: 0, pending: 0, confirmed: 0, in_progress: 0, completed: 0 }
  );

  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "in_progress", label: "Đang thực hiện" },
    { value: "completed", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  return (
    <div className="space-y-6 reveal-up">
      <div className="card-soft overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-900 to-emerald-700 p-6 text-white md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Admin workspace</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Quản lý đơn đặt lịch</h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-50/85">
              Tập trung vào booking, gán staff và xử lý trạng thái. Phần quản lý nhân viên riêng đã được bỏ để tránh chồng chéo với role staff.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-sm md:grid-cols-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-white/75">Tổng booking</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.pending}</div>
              <div className="text-white/75">Chờ xác nhận</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.in_progress}</div>
              <div className="text-white/75">Đang thực hiện</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.completed}</div>
              <div className="text-white/75">Hoàn thành</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-soft p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Bộ lọc nhanh</h2>
            <p className="text-sm text-slate-500">Tìm booking theo khách hàng, dịch vụ hoặc nhân viên được phân công.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:min-w-[520px]">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Tìm theo khách hàng / dịch vụ / staff"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Dịch vụ</th>
              <th className="px-4 py-3">Ngày</th>
              <th className="px-4 py-3">Staff</th>
              <th className="px-4 py-3">Thanh toán</th>
              <th className="px-4 py-3">TT thanh toán</th>
              <th className="px-4 py-3">TT booking</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="align-top transition hover:bg-slate-50/70">
                <td className="px-4 py-4 font-semibold text-slate-800">#{booking.id}</td>
                <td className="px-4 py-4">
                  <div className="font-medium text-slate-800">{booking.user_name}</div>
                  <div className="text-sm text-slate-500">{booking.address}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-slate-800">{booking.service_name}</div>
                  <div className="mt-1 space-y-1 text-xs text-slate-500">
                    {getServiceItems(booking).map((item, index) => (
                      <div key={`${booking.id}-${item.service_id || item.service_name || index}`}>
                        {index + 1}. {item.service_name}
                        {Number(item.quantity || 1) > 1 ? ` x${item.quantity}` : ""}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-slate-500">{new Date(booking.booking_date).toLocaleDateString("vi-VN")}</div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  <div>{new Date(booking.booking_date).toLocaleDateString("vi-VN")}</div>
                  <div className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {timeSlotLabel(booking.time_slot)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="max-h-40 space-y-2 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
                    {staffs.map((staff) => {
                      const checked = (selectedStaffByBooking[booking.id] || []).includes(Number(staff.id));
                      return (
                        <label key={staff.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(event) => handleStaffSelectionChange(booking.id, staff.id, event.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>{staff.name}</span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>
                      Đã chọn: {(selectedStaffByBooking[booking.id] || []).length} nhân viên
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAssignStaff(booking.id, selectedStaffByBooking[booking.id] || [])}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Gán staff
                    </button>
                  </div>

                  <div className="mt-2 text-xs text-slate-400">
                    {booking.staff_names?.length
                      ? `Đã gán: ${booking.staff_names.join(", ")}`
                      : "Admin có thể gán nhiều nhân viên cho 1 booking"}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{booking.payment_method_vietnamese}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusMeta(booking).cls}`}>
                    {getPaymentStatusMeta(booking).label}
                  </span>

                  {booking.status === "cancelled" && booking.payment_method === "bank" && booking.payment_status === "paid" && (
                    <button
                      type="button"
                      onClick={() => navigate("/admin/refunds")}
                      className="mt-3 block rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700"
                    >
                      Đi tới trang hoàn tiền
                    </button>
                  )}
                </td>
                <td className="px-4 py-4">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="in_progress">Đang thực hiện</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <input
                      type="date"
                      min={todayInputValue}
                      value={scheduleByBooking[booking.id]?.booking_date || ""}
                      onChange={(e) => handleScheduleInputChange(booking.id, "booking_date", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                    />

                    <select
                      value={scheduleByBooking[booking.id]?.time_slot || "morning"}
                      onChange={(e) => handleScheduleInputChange(booking.id, "time_slot", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="morning">Buổi sáng</option>
                      <option value="afternoon">Buổi chiều</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleReschedule(booking.id)}
                      className="w-full rounded-xl bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
                    >
                      Đổi lịch
                    </button>

                    <button
                      onClick={() => handleDelete(booking)}
                      className="w-full rounded-xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                    >
                      Hủy
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && filteredBookings.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-12 text-center text-slate-500">
                  Không có booking nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan="9" className="px-4 py-12 text-center text-slate-500">
                  Đang tải danh sách booking...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBookings;