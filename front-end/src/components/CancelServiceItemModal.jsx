import { X } from "lucide-react";

function CancelServiceItemModal({
  item,
  paymentLabel,
  paymentMethod,
  paymentStatus,
  onClose,
  onConfirm,
  loading,
}) {
  const getCancelMessage = () => {
    if (paymentMethod === "bank" && paymentStatus === "paid") {
      return "Dịch vụ này thuộc đơn đã thanh toán qua ngân hàng. Khi hủy, hệ thống sẽ ghi nhận để admin xác nhận hoàn tiền.";
    }
    return "";
  };

  const imageBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000")
    .replace(/\/+$/, "")
    .replace(/\/api$/, "");

  const getServiceImageUrl = (image) => {
    if (!image) return "/images/sanvuon4.avif";
    if (/^https?:\/\//i.test(image)) return image;
    return `${imageBaseUrl}/uploads/${image}`;
  };

  const itemTotal = Number(item.unit_price || 0) * Number(item.quantity || 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-700 px-6 py-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Hủy dịch vụ</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Service Item Card */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex gap-4">
              <img
                src={getServiceImageUrl(item.service_image)}
                alt={item.service_name}
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-bold text-slate-800">{item.service_name}</p>
                <p className="text-sm text-slate-600 mt-1">
                  Số lượng: <span className="font-semibold">{Number(item.quantity || 1)}</span>
                </p>
                <p className="text-sm text-slate-600">
                  Giá: <span className="font-semibold">{(Number(item.unit_price || 0)).toLocaleString("vi-VN")} đ</span>
                </p>
                <p className="mt-2 font-bold text-emerald-700">
                  Tổng: {itemTotal.toLocaleString("vi-VN")} đ
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Phương thức thanh toán:</span> {paymentLabel}
            </p>
            {getCancelMessage() && (
              <p className="mt-2 text-sm text-slate-700">{getCancelMessage()}</p>
            )}
          </div>

          {/* Warning */}
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-4">
            <p className="text-sm font-semibold text-rose-700 mb-1">⚠️ Xác nhận hủy</p>
            <p className="text-sm text-rose-600">
              Bạn có chắc muốn hủy dịch vụ này không? Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Không
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Đang hủy..." : "Hủy dịch vụ"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelServiceItemModal;
