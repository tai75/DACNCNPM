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
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center text-slate-600">
        Không có dữ liệu đặt lịch.
      </div>
    );
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
          navigate("/bookings");
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
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6 md:py-10">
      <div className="card-soft grid gap-6 p-6 md:grid-cols-2 md:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Bước 2</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-800">Thanh toán đặt lịch</h1>

          <div className="mt-5 space-y-2 text-sm text-slate-600">
            <p><b>Dịch vụ:</b> {bookingData.service}</p>
            <p><b>Ngày:</b> {bookingData.booking_date}</p>
            <p><b>Giờ:</b> {bookingData.time_slot}</p>
            <p><b>Địa chỉ:</b> {bookingData.address}</p>
          </div>

          <p className="mt-5 text-2xl font-extrabold text-emerald-700">
            {Number(bookingData.price || 0).toLocaleString("vi-VN")} VND
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Phương thức thanh toán</h3>

          <label className="mb-3 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm transition hover:border-emerald-300">
            <input
              type="radio"
              name="payment"
              value="cod"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Thanh toán khi hoàn thành
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm transition hover:border-emerald-300">
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
            className="mt-5 w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
