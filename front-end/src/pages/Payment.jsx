import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  const [paymentMethod, setPaymentMethod] = useState("");

  if (!data) {
    return <h2 className="text-center mt-10">Không có dữ liệu</h2>;
  }

  const handlePayment = () => {
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (paymentMethod === "cod") {
      navigate("/thank-you");
    }

    if (paymentMethod === "bank") {
      navigate("/bank-payment", { state: data }); // 👈 QUAN TRỌNG
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700">
        Thanh toán
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <p><b>Dịch vụ:</b> {data.service}</p>
        <p><b>Ngày:</b> {data.date}</p>

        <p className="text-lg font-bold text-green-600">
          Tổng tiền: {data.price}
        </p>

        <hr />

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
          className="w-full bg-green-600 text-white py-3 rounded-lg mt-4"
        >
          Xác nhận thanh toán
        </button>
      </div>
    </div>
  );
}

export default Payment;