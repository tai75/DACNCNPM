import { X } from "lucide-react";

function CancelBookingModal({ booking, serviceItems = [], paymentLabel, onClose, onConfirm, loading }) {
  if (!booking) return null;

  const totalPrice = serviceItems.reduce((sum, item) => {
    return sum + Number(item.unit_price || 0) * Number(item.quantity || 1);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 bg-gradient-to-r from-slate-900 via-emerald-900 to-emerald-700 px-6 py-5 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Xác nhận hủy đơn</p>
            <h3 className="mt-1 text-2xl font-bold">Booking #{booking.id}</h3>
            <p className="mt-2 max-w-xl text-sm text-emerald-50/80">
              Kiểm tra lại danh sách dịch vụ trước khi hủy. Nếu đơn đã thanh toán qua ngân hàng, hệ thống sẽ chuyển sang trạng thái chờ hoàn tiền.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Khách hàng</p>
              <p className="mt-1 font-semibold text-slate-900">{booking.user_name || "Chưa cập nhật"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Phương thức thanh toán</p>
              <p className="mt-1 font-semibold text-slate-900">{paymentLabel || booking.payment_method_vietnamese || booking.payment_method}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200">
            <div className="border-b border-slate-200 px-4 py-3">
              <p className="text-sm font-semibold text-slate-800">Danh sách dịch vụ</p>
            </div>
            <div className="max-h-[320px] space-y-3 overflow-auto p-4">
              {serviceItems.map((item, index) => (
                <div key={`${booking.id}-${item.service_id || item.service_name || index}`} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">
                      {index + 1}. {item.service_name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {Number(item.quantity || 1)} x {Number(item.unit_price || 0).toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-emerald-700">
                    {(Number(item.quantity || 1) * Number(item.unit_price || 0)).toLocaleString("vi-VN")} đ
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span>Tổng tiền dịch vụ</span>
            <span className="text-base font-bold">{totalPrice.toLocaleString("vi-VN")} đ</span>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Quay lại
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Đang hủy..." : "Xác nhận hủy đơn"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelBookingModal;