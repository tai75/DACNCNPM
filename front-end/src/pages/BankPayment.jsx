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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">

      <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-md">

        <h2 className="text-2xl font-bold text-green-700 mb-4">
          💳 Thanh toán chuyển khoản
        </h2>

        <p className="text-gray-600 mb-4">
          Quét mã QR hoặc chuyển khoản theo thông tin bên dưới
        </p>

        {/* QR ở giữa */}
        <div className="flex justify-center my-6">
          <img
            src={qrUrl}
            alt="QR Code thanh toán"
            className="rounded-lg shadow-md"
          />
        </div>

        {/* Thông tin hiển thị bên ngoài QR */}
        <div className="text-gray-600 space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
          <p><b>🏦 Ngân hàng:</b> MB Bank</p>
          <p><b>👤 Chủ tài khoản:</b> GARDEN CARE SERVICE</p>
          <p><b>🔢 Số tài khoản:</b> 123456789</p>
          <p><b>💰 Số tiền:</b> {data?.price} VND</p>
          <p><b>📝 Nội dung:</b> {data?.booking_id ? `TT${data.booking_id}` : 'Thanh toan dich vu'}</p>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            ⚠️ <b>Lưu ý:</b> Vui lòng chuyển khoản đúng số tiền và ghi đúng nội dung để được xác nhận tự động.
          </p>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-4 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
        >
          Quay lại
        </button>

      </div>
    </div>
  );
}

export default BankPayment;