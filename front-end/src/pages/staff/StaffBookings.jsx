import { useEffect, useState } from "react";
import api from "../../config/axios";

function StaffBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const summary = bookings.reduce(
    (accumulator, booking) => {
      accumulator.total += 1;
      accumulator[booking.status] = (accumulator[booking.status] || 0) + 1;
      return accumulator;
    },
    { total: 0, confirmed: 0, in_progress: 0, completed: 0 }
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
    completed: {
      label: "Hoàn thành",
      chip: "bg-emerald-100 text-emerald-700",
      option: "text-emerald-700",
    },
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

  return (
    <div className="reveal-up space-y-6">
      <div className="card-soft overflow-hidden border-0 bg-gradient-to-r from-slate-900 via-emerald-900 to-emerald-700 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Staff workspace</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Lịch đặt được giao</h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-50/85">
              Chỉ hiển thị booking do admin phân công cho bạn. Mục tiêu là xử lý nhanh, rõ trạng thái và không bị rối.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-white/75">Tổng việc</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.in_progress}</div>
              <div className="text-white/75">Đang làm</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.completed}</div>
              <div className="text-white/75">Hoàn thành</div>
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
                      <div className="text-sm text-slate-500">{new Date(b.booking_date).toLocaleDateString("vi-VN")}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      <div>{new Date(b.booking_date).toLocaleDateString("vi-VN")}</div>
                      <div className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {b.time_slot}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge-status ${currentMeta.chip}`}>{currentMeta.label}</span>
                      <div className="mt-2 text-xs text-slate-400">Chỉ có 3 bước: xác nhận, thực hiện, hoàn thành</div>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 ${currentMeta.option}`}
                      >
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="in_progress">Đang thực hiện</option>
                        <option value="completed">Hoàn thành</option>
                      </select>
                    </td>
                  </tr>
                );
              })}

              {(!loading && bookings.length === 0) && (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-slate-500">
                    Chưa có booking được phân công.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-slate-500">
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
