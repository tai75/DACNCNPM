const db = require("../config/db");
const Joi = require("joi");

// Validation schemas
const bookingSchema = Joi.object({
  service_id: Joi.number().integer().positive().required(),
  booking_date: Joi.date().greater('now').required(),
  time_slot: Joi.string().valid('morning', 'afternoon', 'evening').required(),
  address: Joi.string().min(10).max(500).required(),
  payment_method: Joi.string().valid('cod', 'bank').default('cod'),
});

const statusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').required(),
});

const paymentStatusSchema = Joi.object({
  payment_status: Joi.string().valid('pending', 'paid', 'refunded').required(),
});

// Status translation
const statusTranslations = {
  'pending': 'Chờ xác nhận',
  'confirmed': 'Đã xác nhận',
  'completed': 'Hoàn thành',
  'cancelled': 'Đã hủy'
};

const paymentMethodTranslations = {
  'cod': 'Thanh toán khi hoàn thành',
  'bank': 'Chuyển khoản ngân hàng'
};

const paymentStatusTranslations = {
  'pending': 'Chưa thanh toán',
  'paid': 'Đã thanh toán',
  'refunded': 'Đã hoàn tiền'
};

/* ======================
   GET ALL BOOKINGS
====================== */
exports.getBookings = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT 
      b.id,
      b.booking_date,
      b.time_slot,
      b.address,
      b.status,
      b.payment_method,
      b.payment_status,
      b.created_at,
      u.name AS user_name,
      s.name AS service_name,
      s.price AS service_price
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN services s ON b.service_id = s.id
  `;

  let countSql = "SELECT COUNT(*) as total FROM bookings";
  const params = [];
  const countParams = [];

  if (req.user.role !== "admin") {
    sql += " WHERE b.user_id = ?";
    countSql += " WHERE user_id = ?";
    params.push(req.user.id);
    countParams.push(req.user.id);
  }

  sql += " ORDER BY b.created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  db.query(countSql, countParams, (err, countResult) => {
    if (err) {
      console.error("Lỗi count bookings:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Lỗi getBookings:", err);
        return res.status(500).json({
          success: false,
          message: "Lỗi server",
        });
      }

      res.json({
        success: true,
        data: result.map(booking => ({
          ...booking,
          status_vietnamese: statusTranslations[booking.status] || booking.status,
          payment_method_vietnamese: paymentMethodTranslations[booking.payment_method] || booking.payment_method,
          payment_status_vietnamese: paymentStatusTranslations[booking.payment_status] || booking.payment_status
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
        },
      });
    });
  });
};

/* ======================
   CREATE BOOKING
====================== */
exports.createBooking = (req, res) => {
  // Validate input
  const { error, value } = bookingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ: " + error.details[0].message,
    });
  }

  const { service_id, booking_date, time_slot, address, payment_method } = value;

  const sql = `
    INSERT INTO bookings
    (user_id, service_id, booking_date, time_slot, address, payment_method, payment_status, status)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', 'pending')
  `;

  db.query(
    sql,
    [req.user.id, service_id, booking_date, time_slot, address, payment_method],
    (err, result) => {
      if (err) {
        console.error("Lỗi createBooking:", err);
        return res.status(500).json({
          success: false,
          message: "Lỗi máy chủ",
        });
      }

      res.json({
        success: true,
        message: "Đặt lịch thành công",
        booking_id: result.insertId,
      });
    }
  );
};

/* ======================
   UPDATE PAYMENT STATUS (ADMIN)
====================== */
exports.updatePaymentStatus = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Chỉ quản trị viên mới có thể cập nhật trạng thái thanh toán",
    });
  }

  // Validate input
  const { error, value } = paymentStatusSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ: " + error.details[0].message,
    });
  }

  const { id } = req.params;
  const { payment_status } = value;

  const sql = `
    UPDATE bookings
    SET payment_status = ?
    WHERE id = ?
  `;

  db.query(sql, [payment_status, id], (err, result) => {
    if (err) {
      console.error("Lỗi updatePaymentStatus:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Đơn đặt lịch không tồn tại",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật trạng thái thanh toán thành công",
    });
  });
};

/* ======================
  UPDATE BOOKING STATUS (ADMIN)
====================== */
exports.updateBookingStatus = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Chỉ quản trị viên mới có thể cập nhật trạng thái",
    });
  }

  // Validate input
  const { error, value } = statusSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ: " + error.details[0].message,
    });
  }

  const { id } = req.params;
  const { status } = value;

  const validStatus = ["pending", "confirmed", "completed", "cancelled"];

  if (!status || !validStatus.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Trạng thái không hợp lệ",
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

  // First check ownership
  db.query("SELECT user_id FROM bookings WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Lỗi check ownership:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Đơn đặt lịch không tồn tại",
      });
    }

    if (req.user.role !== "admin" && result[0].user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa đơn đặt lịch này",
      });
    }

    // Proceed to delete
    const sql = "DELETE FROM bookings WHERE id = ?";

    db.query(sql, [id], (err, result) => {
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
  });
};