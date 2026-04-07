import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../config/axios";

function BankPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const timeSlotLabel = (slot) => {
    if (slot === "morning") return "Buổi sáng";
    if (slot === "afternoon") return "Buổi chiều";
    return slot || "Chưa cập nhật";
  };

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center text-slate-600">
        Không có dữ liệu thanh toán ngân hàng.
      </div>
    );
  }

  const qrPayload = JSON.stringify({
    bookingId: data.booking_id,
    amount: Number(data.price || 0),
    memo: `TT${data.booking_id}`,
  });
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(qrPayload)}`;

  const handleConfirmPaid = async () => {
    try {
      setConfirming(true);
      const res = await api.put(`/bookings/${data.booking_id}/confirm-bank`);
      if (res.data?.success) {
        setConfirmed(true);
        setTimeout(() => navigate("/bookings"), 1200);
      } else {
        alert(res.data?.message || "Không thể xác nhận thanh toán");
      }
    } catch (error) {
      console.error("Confirm bank payment error:", error);
      alert(error.response?.data?.message || "Không thể xác nhận thanh toán");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-10">
      <div className={`mb-4 ml-auto max-w-lg rounded-lg border px-4 py-3 text-sm ${
        confirmed
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "border-sky-300 bg-sky-50 text-sky-700"
      }`}>
        {confirmed
          ? "Thanh toán thành công, hệ thống đang chuyển bạn tới lịch sử đặt lịch..."
          : "Quét QR và xác nhận để hoàn tất thanh toán ngay trên hệ thống demo."}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.45fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Payment Pending</p>
        <h1 className="mt-2 text-4xl font-extrabold text-slate-800">Yêu cầu thanh toán đã được gửi</h1>
        <p className="mt-3 text-base text-slate-500">
          Đơn của bạn đang ở trạng thái chờ xử lý. Chúng tôi sẽ xác nhận trong thời gian sớm nhất.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Mã booking</p>
            <p className="text-3xl font-bold text-slate-800">BOOKING#{data.booking_id}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Phương thức thanh toán</p>
            <p className="text-3xl font-bold text-slate-800">Chuyển khoản ngân hàng</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Tổng thanh toán</p>
            <p className="text-3xl font-bold text-slate-800">{Number(data.price || 0).toLocaleString("vi-VN")} VND</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Ngày và khung giờ</p>
            <p className="text-3xl font-bold text-slate-800">
              {new Date(data.booking_date).toLocaleDateString("vi-VN")} - {timeSlotLabel(data.time_slot)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
            <p className="text-sm text-slate-500">Dịch vụ</p>
            <p className="text-2xl font-bold text-slate-800">{data.service || "Dịch vụ chăm sóc sân vườn"}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleConfirmPaid}
            disabled={confirming || confirmed}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {confirming ? "Đang xác nhận..." : confirmed ? "Đã thanh toán" : "Tôi đã quét QR và thanh toán"}
          </button>
          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Về trang chủ
          </button>
          <button
            onClick={() => navigate("/bookings")}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Xem lịch sử đặt lịch
          </button>
        </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">QR thanh toán</h2>
          <p className="mt-1 text-sm text-slate-500">Quét mã bằng app ngân hàng, sau đó bấm nút xác nhận.</p>

          <div className="mt-4 flex justify-center rounded-xl bg-slate-50 p-4">
            <img src={qrUrl} alt="QR thanh toán ngân hàng" className="h-[260px] w-[260px] rounded-lg border border-slate-200" />
          </div>

          <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p><b>Ngân hàng:</b> MB Bank</p>
            <p><b>Số tài khoản:</b> 123456789</p>
            <p><b>Nội dung CK:</b> TT{data.booking_id}</p>
            <p><b>Số tiền:</b> {Number(data.price || 0).toLocaleString("vi-VN")} VND</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default BankPayment;