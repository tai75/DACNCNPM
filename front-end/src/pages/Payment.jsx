import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../config/axios";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const timeSlotLabel = (slot) => {
    if (slot === "morning") return "Buổi sáng (07:00 - 11:00)";
    if (slot === "afternoon") return "Buổi chiều (13:00 - 17:00)";
    return slot || "Chưa chọn";
  };

  const customerName = bookingData?.fullName || "Khách hàng";
  const customerPhone = bookingData?.phone || "Chưa cập nhật";
  const totalPrice = Number(bookingData?.price || 0);
  const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const imageBaseUrl = rawApiUrl.replace(/\/+$/, "").replace(/\/api$/, "");

  const getServiceImageUrl = (image) => {
    if (!image) return "/images/sanvuon3.avif";
    if (/^https?:\/\//i.test(image)) return image;
    return `${imageBaseUrl}/uploads/${image}`;
  };

  if (!bookingData) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center text-slate-600">
        Không có dữ liệu đặt lịch.
      </div>
    );
  }

  const handlePayment = async () => {
    if (loading) return;

    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    try {
      setSubmitError("");
      setLoading(true);

      // Chi gui cac truong backend cho phep de tranh loi Joi "is not allowed"
      const bookingPayload = {
        service_id: bookingData.service_id,
        booking_date: bookingData.booking_date,
        time_slot: bookingData.time_slot,
        address: bookingData.address,
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
      const status = error.response?.status;
      const backendMessage = error.response?.data?.message;

      const friendlyMessage =
        status === 409
          ? backendMessage || "Bạn đã có lịch hẹn trong khung giờ này. Vui lòng chọn thời gian khác."
          : backendMessage || "Lỗi thanh toán";

      setSubmitError(friendlyMessage);
      alert(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <h1 className="mb-6 text-3xl font-extrabold text-slate-800">Thanh toán đơn đặt lịch</h1>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_1.5fr]">
        <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-200 px-5 py-4 text-2xl font-bold text-slate-800">Tóm tắt đơn đặt</h2>
          <img
            src={getServiceImageUrl(bookingData.image)}
            alt="Tóm tắt dịch vụ"
            className="h-44 w-full object-cover"
          />

          <div className="space-y-3 px-5 py-4 text-sm text-slate-700">
            <h3 className="text-xl font-bold text-slate-800">{bookingData.service || "Dịch vụ chăm sóc sân vườn"}</h3>

            <div className="flex items-start justify-between gap-4 border-b border-dashed border-slate-200 pb-2">
              <span>Ngày đặt</span>
              <span className="text-right font-semibold">{new Date(bookingData.booking_date).toLocaleDateString("vi-VN")}</span>
            </div>

            <div className="flex items-start justify-between gap-4 border-b border-dashed border-slate-200 pb-2">
              <span>Khung giờ</span>
              <span className="text-right font-semibold">{timeSlotLabel(bookingData.time_slot)}</span>
            </div>

            <div className="flex items-start justify-between gap-4 border-b border-dashed border-slate-200 pb-2">
              <span>Địa chỉ</span>
              <span className="max-w-[58%] text-right font-semibold">{bookingData.address}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-base font-semibold text-slate-700">Tổng tiền</span>
              <span className="text-2xl font-extrabold text-emerald-700">{totalPrice.toLocaleString("vi-VN")} đ</span>
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-bold text-slate-800">Thông tin khách hàng</h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="customer-full-name" className="mb-1.5 block text-sm font-semibold text-slate-600">Họ tên</label>
                <input
                  type="text"
                  id="customer-full-name"
                  name="customerFullName"
                  value={customerName}
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                />
              </div>

              <div>
                <label htmlFor="customer-phone" className="mb-1.5 block text-sm font-semibold text-slate-600">Số điện thoại</label>
                <input
                  type="text"
                  id="customer-phone"
                  name="customerPhone"
                  value={customerPhone}
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h3 className="text-2xl font-bold text-slate-800">Phương thức thanh toán</h3>

            {submitError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {submitError}
              </div>
            )}

            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm transition hover:border-emerald-300">
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
            </div>

            <div className="mt-5 border-t border-dashed border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-700">Tổng thanh toán</span>
                <span className="text-3xl font-extrabold text-emerald-700">{totalPrice.toLocaleString("vi-VN")} đ</span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Quay lại
              </button>

              <button
                onClick={handlePayment}
                disabled={loading || !paymentMethod}
                className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Payment;