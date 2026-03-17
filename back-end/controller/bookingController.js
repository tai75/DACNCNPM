const db = require("../config/db");

/* ======================
   GET ALL BOOKINGS
====================== */
exports.getBookings = (req, res) => {
  const sql = `
    SELECT 
      b.id,
      b.date,
      b.status,
      b.created_at,
      u.name AS user_name,
      s.name AS service_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN services s ON b.service_id = s.id
    ORDER BY b.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi getBookings:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }

    res.json({
      success: true,
      data: result,
    });
  });
};

/* ======================
   CREATE BOOKING
====================== */
exports.createBooking = (req, res) => {
  const { user_id, service_id, date } = req.body;

  if (!user_id || !service_id || !date) {
    return res.status(400).json({
      success: false,
      message: "Thiếu dữ liệu",
    });
  }

  const sql = `
    INSERT INTO bookings (user_id, service_id, date, status)
    VALUES (?, ?, ?, 'pending')
  `;

  db.query(sql, [user_id, service_id, date], (err) => {
    if (err) {
      console.error("Lỗi createBooking:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }

    res.json({
      success: true,
      message: "Đặt lịch thành công",
    });
  });
};

/* ======================
   UPDATE STATUS (ADMIN)
====================== */
exports.updateBookingStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ["pending", "confirmed", "done", "cancel"];

  if (!status || !validStatus.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status không hợp lệ",
    });
  }

  const sql = `
    UPDATE bookings 
    SET status = ?
    WHERE id = ?
  `;

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Lỗi updateBookingStatus:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking không tồn tại",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
    });
  });
};

/* ======================
   DELETE BOOKING
====================== */
exports.deleteBooking = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM bookings WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Lỗi deleteBooking:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking không tồn tại",
      });
    }

    res.json({
      success: true,
      message: "Xóa booking thành công",
    });
  });
};