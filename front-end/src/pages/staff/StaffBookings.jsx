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
      label: "�� x�c nh?n",
      chip: "bg-blue-100 text-blue-700",
      option: "text-blue-700",
    },
    in_progress: {
      label: "�ang th?c hi?n",
      chip: "bg-amber-100 text-amber-700",
      option: "text-amber-700",
    },
    completed: {
      label: "Ho�n th�nh",
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
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">L?ch d?t du?c giao</h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-50/85">
              Ch? hi?n th? booking do admin ph�n c�ng cho b?n. M?c ti�u l� x? l� nhanh, r� tr?ng th�i v� kh�ng b? r?i.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-white/75">T?ng vi?c</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.in_progress}</div>
              <div className="text-white/75">�ang l�m</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.completed}</div>
              <div className="text-white/75">Ho�n th�nh</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-soft p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Danh s�ch c�ng vi?c</h2>
            <p className="text-sm text-slate-500">C?p nh?t tr?ng th�i theo ti?n d? th?c t? c?a m?i booking.</p>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
            {loading ? "�ang t?i d? li?u..." : `${bookings.length} booking`}
          </div>
        </div>

        <div className="table-wrap">
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-4 py-3">M�</th>
                <th className="px-4 py-3">Kh�ch h�ng</th>
                <th className="px-4 py-3">D?ch v?</th>
                <th className="px-4 py-3">L?ch h?n</th>
                <th className="px-4 py-3">Tr?ng th�i</th>
                <th className="px-4 py-3">C?p nh?t</th>
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
                      <div className="mt-2 text-xs text-slate-400">Ch? c� 3 bu?c: x�c nh?n, th?c hi?n, ho�n th�nh</div>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 ${currentMeta.option}`}
                      >
                        <option value="confirmed">�� x�c nh?n</option>
                        <option value="in_progress">�ang th?c hi?n</option>
                        <option value="completed">Ho�n th�nh</option>
                      </select>
                    </td>
                  </tr>
                );
              })}

              {(!loading && bookings.length === 0) && (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-slate-500">
                    Chua c� booking du?c ph�n c�ng.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-slate-500">
                    �ang t?i danh s�ch booking...
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
