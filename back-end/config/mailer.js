const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendBookingConfirmationEmail = (email, bookingDetails, callback) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || "garden-care@example.com",
    to: email,
    subject: `Xác nhận đặt lịch #${bookingDetails.bookingId} - Garden Care`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Xác nhận đặt lịch</h2>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        
        <h3>Thông tin đặt lịch</h3>
        <ul>
          <li><strong>Mã đặt lịch:</strong> #${bookingDetails.bookingId}</li>
          <li><strong>Ngày:</strong> ${new Date(bookingDetails.bookingDate).toLocaleDateString("vi-VN")}</li>
          <li><strong>Khung giờ:</strong> ${bookingDetails.timeSlot === "morning" ? "Buổi sáng" : "Buổi chiều"}</li>
          <li><strong>Địa chỉ:</strong> ${bookingDetails.address}</li>
          <li><strong>Tổng tiền:</strong> ${bookingDetails.totalPrice.toLocaleString("vi-VN")} đ</li>
        </ul>

        <h3>Dịch vụ</h3>
        <ul>
          ${bookingDetails.services.map(s => `<li>${s.name} - ${s.price.toLocaleString("vi-VN")} đ</li>`).join("")}
        </ul>

        <p>Chúng tôi sẽ liên hệ bạn để xác nhận lịch hẹn.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Câu hỏi? Liên hệ chúng tôi tại support@garden-care.com
        </p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Send booking confirmation email error:", err);
      return callback(err);
    }
    console.log("Booking confirmation email sent:", info.response);
    return callback(null);
  });
};

const sendBookingStatusEmail = (email, bookingId, status, callback) => {
  const statusMessages = {
    confirmed: "Đặt lịch của bạn đã được xác nhận",
    in_progress: "Dịch vụ của bạn đang được thực hiện",
    completed: "Dịch vụ của bạn đã hoàn thành",
    cancelled: "Đặt lịch của bạn đã được hủy",
  };

  const mailOptions = {
    from: process.env.EMAIL_USER || "garden-care@example.com",
    to: email,
    subject: `${statusMessages[status]} - Booking #${bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${statusMessages[status]}</h2>
        <p>Mã đặt lịch: <strong>#${bookingId}</strong></p>
        <p>Trạng thái hiện tại: <strong>${status}</strong></p>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Câu hỏi? Liên hệ chúng tôi tại support@garden-care.com
        </p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Send booking status email error:", err);
      return callback(err);
    }
    console.log("Booking status email sent:", info.response);
    return callback(null);
  });
};

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingStatusEmail,
};
