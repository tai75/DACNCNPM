import { useLocation } from "react-router-dom";

function BankPayment() {
  const location = useLocation();
  const data = location.state;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      
      <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Quét mã QR để thanh toán
        </h2>

        {/* QR ở giữa */}
        <div className="flex justify-center my-6">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=GardenCarePayment"
            alt="QR Code"
            className="rounded-lg"
          />
        </div>

        {/* Thông tin hiển thị bên ngoài QR */}
        <div className="text-gray-600 space-y-2 text-sm">
          <p>Ngân hàng: <b>MB Bank</b></p>
          <p>Số tài khoản: <b>123456789</b></p>
          <p>
            Nội dung: <b>Thanh toan dich vu</b>
          </p>

          {/* Nếu có dữ liệu từ booking thì hiển thị */}
          {data && (
            <p className="text-green-600 font-semibold mt-2">
              Số tiền: {data.price}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default BankPayment;