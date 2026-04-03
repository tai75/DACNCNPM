import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../config/axios";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  if (!bookingData) {
    return <h2 className="text-center mt-10">Không có dữ liệu đặt lịch</h2>;
  }

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    try {
      setLoading(true);

      // Tạo booking với payment method
      const bookingPayload = {
        ...bookingData,
        payment_method: paymentMethod
      };

      const res = await api.post("/bookings", bookingPayload);

      if (res.data.success) {
        if (paymentMethod === "cod") {
          navigate("/thank-you");
        } else if (paymentMethod === "bank") {
          navigate("/bank-payment", {
            state: {
              ...bookingData,
              booking_id: res.data.booking_id
            }
          });
        }
      } else {
        alert(res.data.message || "Đặt lịch thất bại");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Lỗi thanh toán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700">
        Thanh toán
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <p><b>Dịch vụ:</b> {bookingData.service}</p>
        <p><b>Ngày:</b> {bookingData.booking_date}</p>
        <p><b>Giờ:</b> {bookingData.time_slot}</p>
        <p><b>Địa chỉ:</b> {bookingData.address}</p>

        <p className="text-lg font-bold text-green-600">
          Tổng tiền: {bookingData.price} VND
        </p>

        <hr />

        <h3 className="font-semibold text-gray-700 mb-3">Chọn phương thức thanh toán:</h3>

        <label className="block">
          <input
            type="radio"
            name="payment"
            value="cod"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Thanh toán khi hoàn thành
        </label>

        <label className="block">
          <input
            type="radio"
            name="payment"
            value="bank"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Chuyển khoản ngân hàng
        </label>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg mt-4 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Đang xử lý...
            </div>
          ) : (
            "Xác nhận thanh toán"
          )}
        </button>
      </div>
    </div>
  );
}

export default Payment;