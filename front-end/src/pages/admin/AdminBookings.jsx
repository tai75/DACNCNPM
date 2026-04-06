import { useEffect, useState } from "react";
<<<<<<< HEAD
import api from "../../config/axios";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
=======
import axios from "axios";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

  // ================= LOAD DATA =================
  const fetchBookings = async () => {
    try {
<<<<<<< HEAD
      setLoading(true);
      const res = await api.get("/bookings");
      setBookings(res.data.data || res.data);
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
=======
      const res = await axios.get("http://localhost:5000/api/bookings");
      setBookings(res.data.data || res.data);
    } catch (err) {
      console.error("Lỗi load bookings:", err);
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
    }
  };

  useEffect(() => {
    fetchBookings();
<<<<<<< HEAD
    fetchStaffs();
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa đơn này?")) return;

    try {
<<<<<<< HEAD
      await api.delete(`/bookings/${id}`);
=======
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
      fetchBookings();
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };

  // ================= UPDATE PAYMENT STATUS =================
  const handlePaymentStatusChange = async (id, payment_status) => {
    try {
<<<<<<< HEAD
      await api.put(`/bookings/${id}/payment`, {
=======
      await axios.put(`http://localhost:5000/api/bookings/${id}/payment`, {
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
        payment_status,
      });
      fetchBookings();
    } catch (err) {
      console.error("Lỗi cập nhật payment status:", err);
    }
  };

<<<<<<< HEAD
  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      console.error("Lỗi cập nhật status:", err);
    }
  };

  const handleAssignStaff = async (id, staff_id) => {
    if (!staff_id) return;
    try {
      await api.put(`/bookings/${id}/assign-staff`, { staff_id: Number(staff_id) });
      fetchBookings();
    } catch (err) {
      console.error("Lỗi gán nhân viên:", err);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchStatus = statusFilter === "all" || booking.status === statusFilter;
    const keyword = `${booking.user_name || ""} ${booking.service_name || ""} ${booking.staff_name || ""}`.toLowerCase();
    const matchSearch = keyword.includes(searchText.trim().toLowerCase());
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
                  <div className="text-sm text-slate-500">{new Date(booking.booking_date).toLocaleDateString("vi-VN")}</div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  <div>{new Date(booking.booking_date).toLocaleDateString("vi-VN")}</div>
                  <div className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {booking.time_slot}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <select
                    value={booking.staff_id || ""}
                    onChange={(e) => handleAssignStaff(booking.id, e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Chưa gán</option>
                    {staffs.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-xs text-slate-400">Admin gán staff cho từng booking</div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{booking.payment_method_vietnamese}</td>
                <td className="px-4 py-4">
                  <select
                    value={booking.payment_status}
                    onChange={(e) => handlePaymentStatusChange(booking.id, e.target.value)}
                    className={`w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 ${
                      booking.payment_status === "paid"
                        ? "bg-emerald-50 text-emerald-700"
                        : booking.payment_status === "refunded"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <option value="pending">Chưa thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="refunded">Đã hoàn tiền</option>
                  </select>
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
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="rounded-xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    Xóa
                  </button>
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
=======
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Khách hàng</th>
            <th className="p-2">Dịch vụ</th>
            <th className="p-2">Ngày</th>
            <th className="p-2">Thanh toán</th>
            <th className="p-2">Trạng thái TT</th>
            <th className="p-2">Trạng thái ĐH</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="text-center border-t">
              <td className="p-2">{b.id}</td>
              <td className="p-2">{b.user_name}</td>
              <td className="p-2">{b.service_name}</td>
              <td className="p-2">{new Date(b.booking_date).toLocaleDateString('vi-VN')}</td>
              <td className="p-2">{b.payment_method_vietnamese}</td>

              {/* PAYMENT STATUS */}
              <td className="p-2">
                <select
                  value={b.payment_status}
                  onChange={(e) =>
                    handlePaymentStatusChange(b.id, e.target.value)
                  }
                  className={`border p-1 rounded ${
                    b.payment_status === 'paid' ? 'bg-green-100' :
                    b.payment_status === 'refunded' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}
                >
                  <option value="pending">Chưa thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="refunded">Đã hoàn tiền</option>
                </select>
              </td>

              {/* BOOKING STATUS */}
              <td className="p-2">
                <select
                  value={b.status}
                  onChange={(e) =>
                    handleStatusChange(b.id, e.target.value)
                  }
                  className="border p-1"
                >
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </td>

              {/* ACTION */}
              <td className="p-2">
                <button
                  onClick={() => handleDelete(b.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
    </div>
  );
}

export default AdminBookings;