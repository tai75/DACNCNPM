import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { Bell, MessageSquare, Check } from "lucide-react";

function AdminNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchNotifications();
  }, [currentPage]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/notifications", {
        params: { page: currentPage, limit },
      });
      setNotifications(res.data?.data || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error("Load notifications error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type) => {
    const typeMap = {
      booking: "Đặt lịch",
      payment: "Thanh toán",
      system: "Hệ thống",
    };
    return typeMap[type] || type;
  };

  const getTypeColor = (type) => {
    const colorMap = {
      booking: "bg-blue-100 text-blue-700",
      payment: "bg-emerald-100 text-emerald-700",
      system: "bg-slate-100 text-slate-700",
    };
    return colorMap[type] || "bg-slate-100 text-slate-700";
  };

  const handleGoToBooking = (bookingId) => {
    if (bookingId) {
      navigate(`/admin/bookings`);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 reveal-up">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Thông báo hệ thống</h1>
            <p className="mt-1 text-sm text-slate-500">Xem tất cả những sự kiện quan trọng liên quan đến booking, thanh toán và hệ thống</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-sm text-slate-500">Tổng thông báo</div>
            <div className="text-2xl font-bold text-slate-800">{total}</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-slate-300" />
            <div className="mt-3 text-slate-500">Chưa có thông báo nào</div>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 transition hover:bg-slate-100"
              >
                <div className="mt-1">
                  <MessageSquare className="h-5 w-5 text-slate-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getTypeColor(notif.type)}`}>
                      {getTypeLabel(notif.type)}
                    </span>
                    {notif.is_read === 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                        <Check className="h-3 w-3" />
                        Mới
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-slate-800">{notif.message}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    {notif.user_name && <span>Người dùng: {notif.user_name}</span>}
                    {notif.booking_id && <span>Booking #{notif.booking_id}</span>}
                    <span>{new Date(notif.created_at).toLocaleDateString("vi-VN")} {new Date(notif.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>

                  {notif.booking_id && (
                    <button
                      onClick={() => handleGoToBooking(notif.booking_id)}
                      className="mt-2 inline-block rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      Xem chi tiết booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
            <div className="text-sm text-slate-500">
              Trang {currentPage} / {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminNotifications;
