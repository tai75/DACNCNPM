import { useState } from "react";
import api from "../config/axios";
import { Star, X } from "lucide-react";

function ReviewModal({ booking, service, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("rate");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Vui lòng chọn đánh giá sao");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.post("/reviews", {
        service_id: service.id,
        booking_id: booking.id,
        rating,
        comment: comment.trim() || null,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi gửi đánh giá");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4">
      <div className="flex w-full max-w-[560px] flex-col overflow-hidden rounded-[18px] bg-[#111111] text-white shadow-2xl">
        <div className="flex items-center justify-between px-5 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Đóng"
          >
            <X size={24} />
          </button>

          <button
            type="submit"
            form="review-form"
            disabled={loading || rating === 0}
            className="rounded-full px-2 py-2 text-sm font-semibold text-white/90 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Đang gửi" : "Gửi"}
          </button>
        </div>

        <form id="review-form" onSubmit={handleSubmit} className="px-5 pb-6 pt-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#93a8b7] text-lg font-semibold text-white">
              G
            </div>
            <div className="min-w-0">
              <p className="truncate text-[18px] font-medium text-white/95">{service?.name || "Dịch vụ"}</p>
              <p className="text-[14px] leading-5 text-white/58">Xếp hạng dịch vụ này</p>
            </div>
          </div>

          <div className="mb-6 rounded-[22px] bg-white/0 px-1 py-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#93a8b7] text-lg font-semibold text-white">
                {String(booking.id).slice(-1)}
              </div>
              <div className="min-w-0">
                <p className="text-[18px] font-medium text-white">Đăng Hữu Tài</p>
                <p className="mt-1 text-[14px] leading-6 text-white/66">
                  Các bài đánh giá đều công khai và có chứa thông tin về tài khoản và thiết bị của bạn.
                  <span className="block text-white/80 underline decoration-white/45 underline-offset-4">
                    Tìm hiểu thêm
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between gap-2 sm:gap-4">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hoveredRating || rating);

                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => {
                      setRating(star);
                      setStage("write");
                    }}
                    onMouseDown={() => {
                      setRating(star);
                      setStage("write");
                    }}
                    onPointerDown={() => {
                      setRating(star);
                      setStage("write");
                    }}
                    aria-label={`${star} sao`}
                    className="flex flex-1 items-center justify-center rounded-xl py-2 outline-none transition active:scale-95"
                  >
                    <Star
                      size={52}
                      strokeWidth={1.7}
                      className={active ? "text-[#d9d9d9]" : "text-[#a0a0a0]"}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mb-2 flex items-center justify-center gap-2 text-sm text-white/70">
              <span>{rating > 0 ? `${rating} sao` : ""}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStage("write")}
            className="mb-4 text-[18px] font-semibold text-[#9fc3ff] transition hover:text-[#b7d1ff]"
          >
            Viết bài đánh giá
          </button>

          {stage === "write" && (
            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn với dịch vụ này..."
                maxLength={500}
                rows={5}
                className="min-h-[160px] w-full resize-none rounded-[18px] border border-white/12 bg-transparent px-4 py-3 text-base text-white outline-none placeholder:text-white/35 focus:border-white/25"
              />
              <div className="mt-3 flex items-center justify-end text-xs text-white/55">
                {comment.length}/500
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || rating === 0}
            className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-base font-semibold text-[#111111] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewModal;
