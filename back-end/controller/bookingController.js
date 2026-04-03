const db = require("../config/db");
const Joi = require("joi");

const bookingSchema = Joi.object({
  service_id: Joi.number().integer().positive().required(),
  booking_date: Joi.date().greater("now").required(),
  time_slot: Joi.string().valid("morning", "afternoon", "evening").required(),
  address: Joi.string().min(10).max(500).required(),
  payment_method: Joi.string().valid("cod", "bank").default("cod"),
});

const statusSchema = Joi.object({
  status: Joi.string().valid("pending", "confirmed", "completed", "cancelled").required(),
});

const paymentStatusSchema = Joi.object({
  payment_status: Joi.string().valid("pending", "paid", "refunded").required(),
});

const bookingIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const bookingsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

const statusTranslations = {
  pending: "Cho xac nhan",
  confirmed: "Da xac nhan",
  completed: "Hoan thanh",
  cancelled: "Da huy",
};

const paymentMethodTranslations = {
  cod: "Thanh toan khi hoan thanh",
  bank: "Chuyen khoan ngan hang",
};

const paymentStatusTranslations = {
  pending: "Chua thanh toan",
  paid: "Da thanh toan",
  refunded: "Da hoan tien",
};

exports.getBookings = (req, res) => {
  const { error, value } = bookingsQuerySchema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Query khong hop le",
    });
  }

  const { page, limit } = value;
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

  let countSql = "SELECT COUNT(*) AS total FROM bookings";
  const params = [];
  const countParams = [];

  if (req.user.role !== "admin" && req.user.role !== "staff") {
    sql += " WHERE b.user_id = ?";
    countSql += " WHERE user_id = ?";
    params.push(req.user.id);
    countParams.push(req.user.id);
  }

  sql += " ORDER BY b.created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  db.query(countSql, countParams, (countErr, countResult) => {
    if (countErr) {
      console.error("Count bookings error:", countErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(sql, params, (listErr, result) => {
      if (listErr) {
        console.error("Get bookings error:", listErr);
        return res.status(500).json({ success: false, message: "Loi server" });
      }

      return res.json({
        success: true,
        data: result.map((booking) => ({
          ...booking,
          status_vietnamese: statusTranslations[booking.status] || booking.status,
          payment_method_vietnamese:
            paymentMethodTranslations[booking.payment_method] || booking.payment_method,
          payment_status_vietnamese:
            paymentStatusTranslations[booking.payment_status] || booking.payment_status,
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

exports.createBooking = (req, res) => {
  const { error, value } = bookingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Du lieu khong hop le: " + error.details[0].message,
    });
  }

  const { service_id, booking_date, time_slot, address, payment_method } = value;

  const checkConflictSql = `
    SELECT id
    FROM bookings
    WHERE service_id = ?
      AND DATE(booking_date) = DATE(?)
      AND time_slot = ?
      AND status IN ('pending', 'confirmed')
    LIMIT 1
  `;

  db.query(checkConflictSql, [service_id, booking_date, time_slot], (checkErr, checkRows) => {
    if (checkErr) {
      console.error("Check conflict error:", checkErr);
      return res.status(500).json({ success: false, message: "Loi may chu" });
    }

    if (checkRows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Khung gio nay da duoc dat. Vui long chon khung gio khac",
      });
    }

    const insertSql = `
      INSERT INTO bookings
      (user_id, service_id, booking_date, time_slot, address, payment_method, payment_status, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', 'pending')
    `;

    db.query(
      insertSql,
      [req.user.id, service_id, booking_date, time_slot, address, payment_method],
      (insertErr, result) => {
        if (insertErr) {
          console.error("Create booking error:", insertErr);
          return res.status(500).json({ success: false, message: "Loi may chu" });
        }

        return res.json({
          success: true,
          message: "Dat lich thanh cong",
          booking_id: result.insertId,
        });
      }
    );
  });
};

exports.updatePaymentStatus = (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({
      success: false,
      message: "Chi admin hoac staff moi co the cap nhat trang thai thanh toan",
    });
  }

  const idValidation = bookingIdSchema.validate(req.params);
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const bodyValidation = paymentStatusSchema.validate(req.body);
  if (bodyValidation.error) {
    return res.status(400).json({
      success: false,
      message: "Du lieu khong hop le: " + bodyValidation.error.details[0].message,
    });
  }

  const { id } = idValidation.value;
  const { payment_status } = bodyValidation.value;

  const sql = `
    UPDATE bookings
    SET payment_status = ?
    WHERE id = ?
  `;

  db.query(sql, [payment_status, id], (err, result) => {
    if (err) {
      console.error("Update payment status error:", err);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Don dat lich khong ton tai" });
    }

    return res.json({ success: true, message: "Cap nhat trang thai thanh toan thanh cong" });
  });
};

exports.updateBookingStatus = (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({
      success: false,
      message: "Chi admin hoac staff moi co the cap nhat trang thai",
    });
  }

  const idValidation = bookingIdSchema.validate(req.params);
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const bodyValidation = statusSchema.validate(req.body);
  if (bodyValidation.error) {
    return res.status(400).json({
      success: false,
      message: "Du lieu khong hop le: " + bodyValidation.error.details[0].message,
    });
  }

  const { id } = idValidation.value;
  const { status } = bodyValidation.value;

  const sql = `
    UPDATE bookings
    SET status = ?
    WHERE id = ?
  `;

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Update booking status error:", err);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Booking khong ton tai" });
    }

    return res.json({ success: true, message: "Cap nhat trang thai thanh cong" });
  });
};

exports.deleteBooking = (req, res) => {
  const { error, value } = bookingIdSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const { id } = value;

  db.query("SELECT user_id FROM bookings WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Check ownership error:", err);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Don dat lich khong ton tai" });
    }

    if (req.user.role !== "admin" && req.user.role !== "staff" && result[0].user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Ban khong co quyen xoa don dat lich nay",
      });
    }

    db.query("DELETE FROM bookings WHERE id = ?", [id], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Delete booking error:", deleteErr);
        return res.status(500).json({ success: false, message: "Loi server" });
      }

      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Booking khong ton tai" });
      }

      return res.json({ success: true, message: "Xoa booking thanh cong" });
    });
  });
};
