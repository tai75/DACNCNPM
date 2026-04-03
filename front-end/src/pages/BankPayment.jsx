import { useLocation } from "react-router-dom";

function BankPayment() {
  const location = useLocation();
  const data = location.state;

  // Tạo QR code động với thông tin booking
  const generateQRData = () => {
    if (!data) return "GardenCarePayment";

    const qrInfo = {
      bookingId: data.booking_id,
      amount: data.price,
      service: data.service,
      date: data.booking_date,
      time: data.time_slot,
      address: data.address
    };

    return `GardenCare-${JSON.stringify(qrInfo)}`;
  };

  const qrData = generateQRData();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center px-4 py-8 md:px-6 md:py-10">
      <div className="card-soft grid w-full gap-6 p-6 md:grid-cols-2 md:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Thanh toán ngân hàng</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-800">Quét QR để hoàn tất giao dịch</h2>
          <p className="mt-3 text-sm text-slate-600">Vui lòng chuyển khoản đúng số tiền và nội dung để hệ thống xác nhận nhanh hơn.</p>

          <div className="mt-5 space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p><b>Ngân hàng:</b> MB Bank</p>
            <p><b>Chủ tài khoản:</b> GARDEN CARE SERVICE</p>
            <p><b>Số tài khoản:</b> 123456789</p>
            <p><b>Số tiền:</b> {Number(data?.price || 0).toLocaleString("vi-VN")} VND</p>
            <p><b>Nội dung:</b> {data?.booking_id ? `TT${data.booking_id}` : "Thanh toan dich vu"}</p>
          </div>

          <button
            onClick={() => window.history.back()}
            className="mt-5 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            Quay lại
          </button>
        </div>

        <div className="flex items-center justify-center rounded-2xl bg-slate-50 p-6">
          <img
            src={qrUrl}
            alt="QR Code thanh toán"
            className="rounded-xl border border-slate-200 shadow"
          />
        </div>
      </div>
    </div>
  );
}

export default BankPayment;