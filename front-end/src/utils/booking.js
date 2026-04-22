const normalizeText = (value) => String(value || "").trim().toLowerCase();

const STATUS_ALIASES = {
  cancelled: ["da huy", "đã hủy", "huy", "cancelled", "canceled"],
  confirmed: ["da xac nhan", "đã xác nhận", "xac nhan", "confirmed"],
  in_progress: ["dang xu ly", "đang xử lý", "in_progress", "in progress"],
  completed: ["hoan thanh", "đã hoàn thành", "completed"],
  paid: ["da thanh toan", "đã thanh toán", "paid"],
  refunded: ["da hoan tien", "đã hoàn tiền", "refunded"],
  active: ["active", "hoat dong", "đang hoạt động"],
};

const normalizeStatus = (value) => {
  const normalized = normalizeText(value);

  for (const [canonicalStatus, aliases] of Object.entries(STATUS_ALIASES)) {
    if (aliases.includes(normalized)) {
      return canonicalStatus;
    }
  }

  return normalized;
};

export const normalizeBookingStatus = (status) => normalizeStatus(status);

export const normalizeItemStatus = (item) =>
  normalizeStatus(item?.status ?? item?.item_status ?? "active");

export const getBookingPaymentStatusMeta = (booking) => {
  const bookingStatus = normalizeBookingStatus(booking?.status);
  const paymentMethod = normalizeText(booking?.payment_method);
  const paymentStatus = normalizeBookingStatus(booking?.payment_status);

  if (bookingStatus === "cancelled" && paymentMethod === "bank" && paymentStatus === "paid") {
    return {
      label: "Chờ hoàn tiền",
      className: "bg-amber-100 text-amber-700",
    };
  }

  if (paymentStatus === "paid") {
    return { label: "Đã thanh toán", className: "bg-emerald-100 text-emerald-700" };
  }

  if (paymentStatus === "refunded") {
    return { label: "Đã hoàn tiền", className: "bg-rose-100 text-rose-700" };
  }

  return {
    label: booking?.payment_status_vietnamese || booking?.payment_status || "Chưa cập nhật",
    className: "bg-slate-100 text-slate-700",
  };
};

export const canCancelBooking = (booking, userRole = "user") => {
  const bookingStatus = normalizeBookingStatus(booking?.status);

  if (bookingStatus === "cancelled" || bookingStatus === "completed") {
    return false;
  }

  if (userRole === "admin" || userRole === "staff") {
    return true;
  }

  return ["pending", "confirmed"].includes(bookingStatus);
};

export const canCancelBookingItem = (booking, item) =>
  Boolean(booking) && ["pending", "confirmed"].includes(normalizeBookingStatus(booking?.status)) && normalizeItemStatus(item) === "active";

export const getTimeSlotLabel = (slot) => {
  if (slot === "morning") return "Buổi sáng";
  if (slot === "afternoon") return "Buổi chiều";
  return slot || "Chưa cập nhật";
};