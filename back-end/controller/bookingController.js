const db = require("../config/db");
const Joi = require("joi");

<<<<<<< HEAD
const bookingSchema = Joi.object({
  service_id: Joi.number().integer().positive().required(),
  booking_date: Joi.date().greater("now").required(),
  time_slot: Joi.string().valid("morning", "afternoon", "evening").required(),
  address: Joi.string().min(10).max(500).required(),
  note: Joi.string().allow("", null).max(1000),
  payment_method: Joi.string().valid("cod", "bank").default("cod"),
});

const statusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "in_progress", "completed", "cancelled")
    .required(),
});

const paymentStatusSchema = Joi.object({
  payment_status: Joi.string().valid("pending", "paid", "refunded").required(),
});

const bookingIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const assignStaffSchema = Joi.object({
  staff_id: Joi.number().integer().positive().required(),
});

const completionSchema = Joi.object({
  completion_note: Joi.string().allow("", null).max(2000),
  before_image: Joi.string().allow("", null).max(255),
  after_image: Joi.string().allow("", null).max(255),
  status: Joi.string().valid("in_progress", "completed").default("completed"),
});

const bookingsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

const statusTranslations = {
  pending: "Cho xac nhan",
  confirmed: "Da xac nhan",
  in_progress: "Dang thuc hien",
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

const allowedTransitionsByStaff = {
  pending: [],
  confirmed: ["in_progress"],
  in_progress: ["completed"],
  completed: [],
  cancelled: [],
};

const createNotification = (userId, message, bookingId = null) => {
  const sql = `
    INSERT INTO notifications (user_id, booking_id, message, type, is_read)
    VALUES (?, ?, ?, 'booking', 0)
  `;

  db.query(sql, [userId, bookingId, message], () => {
    // Best-effort notification, ignore write errors to avoid blocking main flow.
  });
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
=======
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
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
      b.id,
      b.booking_date,
      b.time_slot,
      b.address,
<<<<<<< HEAD
      b.note,
      b.status,
      b.payment_method,
      b.payment_status,
      b.staff_id,
      b.completion_note,
      b.before_image,
      b.after_image,
      b.created_at,
      u.name AS user_name,
      st.name AS staff_name,
      s.name AS service_name,
      s.price AS service_price
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN services s ON b.service_id = s.id
    LEFT JOIN users st ON b.staff_id = st.id
  `;

  let countSql = "SELECT COUNT(*) AS total FROM bookings";
  const params = [];
  const countParams = [];

  if (req.user.role === "staff") {
    sql += " WHERE b.staff_id = ?";
    countSql += " WHERE staff_id = ?";
    params.push(req.user.id);
    countParams.push(req.user.id);
  } else if (req.user.role !== "admin") {
=======
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
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
    sql += " WHERE b.user_id = ?";
    countSql += " WHERE user_id = ?";
    params.push(req.user.id);
    countParams.push(req.user.id);
  }

  sql += " ORDER BY b.created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

<<<<<<< HEAD
  db.query(countSql, countParams, (countErr, countResult) => {
    if (countErr) {
      console.error("Count bookings error:", countErr);
      return res.status(500).json({ success: false, message: "Loi server" });
=======
  db.query(countSql, countParams, (err, countResult) => {
    if (err) {
      console.error("Lỗi count bookings:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

<<<<<<< HEAD
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
=======
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
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
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

<<<<<<< HEAD
exports.createBooking = (req, res) => {
=======
/* ======================
   CREATE BOOKING
====================== */
exports.createBooking = (req, res) => {
  // Validate input
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
  const { error, value } = bookingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
<<<<<<< HEAD
      message: "Du lieu khong hop le: " + error.details[0].message,
    });
  }

  const { service_id, booking_date, time_slot, address, note, payment_method } = value;

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
      (user_id, service_id, booking_date, time_slot, address, note, payment_method, payment_status, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')
    `;

    db.query(
      insertSql,
      [req.user.id, service_id, booking_date, time_slot, address, note || null, payment_method],
      (insertErr, result) => {
        if (insertErr) {
          console.error("Create booking error:", insertErr);
          return res.status(500).json({ success: false, message: "Loi may chu" });
        }

        createNotification(
          req.user.id,
          "Booking moi da duoc tao va dang cho xac nhan",
          result.insertId
        );

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
=======
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
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

  const sql = `
    UPDATE bookings
    SET payment_status = ?
    WHERE id = ?
  `;

  db.query(sql, [payment_status, id], (err, result) => {
    if (err) {
<<<<<<< HEAD
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

  db.query("SELECT id, user_id, staff_id, status FROM bookings WHERE id = ?", [id], (findErr, rows) => {
    if (findErr) {
      console.error("Find booking error:", findErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Booking khong ton tai" });
    }

    const booking = rows[0];

    if (req.user.role === "staff") {
      if (booking.staff_id && booking.staff_id !== req.user.id) {
        return res.status(403).json({ success: false, message: "Booking khong thuoc pham vi cua ban" });
      }

      const allowedTargets = allowedTransitionsByStaff[booking.status] || [];
      if (!allowedTargets.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Khong the chuyen trang thai tu ${booking.status} sang ${status}`,
        });
      }
    }

    const sql = `
      UPDATE bookings
      SET status = ?, staff_id = COALESCE(staff_id, ?)
      WHERE id = ?
    `;

    db.query(sql, [status, req.user.role === "staff" ? req.user.id : booking.staff_id, id], (err, result) => {
    if (err) {
      console.error("Update booking status error:", err);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Booking khong ton tai" });
    }

    createNotification(booking.user_id, `Booking #${id} duoc cap nhat trang thai: ${status}`, id);

    return res.json({ success: true, message: "Cap nhat trang thai thanh cong" });
    });
  });
};

exports.assignStaff = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Chi admin moi co the gan nhan vien" });
  }

  const idValidation = bookingIdSchema.validate(req.params);
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const bodyValidation = assignStaffSchema.validate(req.body);
  if (bodyValidation.error) {
    return res.status(400).json({ success: false, message: "Du lieu staff_id khong hop le" });
  }

  const { id } = idValidation.value;
  const { staff_id } = bodyValidation.value;

  db.query("SELECT id, role FROM users WHERE id = ?", [staff_id], (staffErr, staffRows) => {
    if (staffErr) {
      console.error("Find staff error:", staffErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (staffRows.length === 0 || staffRows[0].role !== "staff") {
      return res.status(400).json({ success: false, message: "staff_id khong phai tai khoan staff hop le" });
    }

    const sql = `
      UPDATE bookings
      SET staff_id = ?, status = CASE WHEN status = 'pending' THEN 'confirmed' ELSE status END
      WHERE id = ?
    `;

    db.query(sql, [staff_id, id], (err, result) => {
      if (err) {
        console.error("Assign staff error:", err);
        return res.status(500).json({ success: false, message: "Loi server" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Booking khong ton tai" });
      }

      createNotification(staff_id, `Ban duoc phan cong booking #${id}`, id);

      return res.json({ success: true, message: "Gan nhan vien thanh cong" });
    });
  });
};

exports.updateCompletion = (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({ success: false, message: "Khong co quyen cap nhat thong tin hoan thanh" });
  }

  const idValidation = bookingIdSchema.validate(req.params);
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const bodyValidation = completionSchema.validate(req.body || {});
  if (bodyValidation.error) {
    return res.status(400).json({ success: false, message: "Du lieu completion khong hop le" });
  }

  const { id } = idValidation.value;
  const { completion_note, before_image, after_image, status } = bodyValidation.value;

  db.query("SELECT id, user_id, staff_id FROM bookings WHERE id = ?", [id], (findErr, rows) => {
    if (findErr) {
      console.error("Find booking for completion error:", findErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Booking khong ton tai" });
    }

    const booking = rows[0];
    if (req.user.role === "staff" && booking.staff_id && booking.staff_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Booking khong thuoc pham vi cua ban" });
    }

    const sql = `
      UPDATE bookings
      SET completion_note = ?,
          before_image = COALESCE(?, before_image),
          after_image = COALESCE(?, after_image),
          status = ?,
          staff_id = COALESCE(staff_id, ?)
      WHERE id = ?
    `;

    db.query(
      sql,
      [completion_note || null, before_image || null, after_image || null, status, req.user.role === "staff" ? req.user.id : booking.staff_id, id],
      (err, result) => {
        if (err) {
          console.error("Update completion error:", err);
          return res.status(500).json({ success: false, message: "Loi server" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ success: false, message: "Booking khong ton tai" });
        }

        createNotification(booking.user_id, `Booking #${id} da duoc cap nhat ket qua cham soc`, id);
        return res.json({ success: true, message: "Cap nhat ket qua cham soc thanh cong" });
      }
    );
  });
};

exports.deleteBooking = (req, res) => {
  const { error, value } = bookingIdSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const { id } = value;

  db.query("SELECT user_id, status FROM bookings WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Check ownership error:", err);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Don dat lich khong ton tai" });
    }

    const currentStatus = result[0].status;

    if (req.user.role !== "admin" && req.user.role !== "staff" && result[0].user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Ban khong co quyen xoa don dat lich nay",
      });
    }

    if (req.user.role === "user" && !["pending", "confirmed"].includes(currentStatus)) {
      return res.status(400).json({ success: false, message: "Chi duoc huy booking dang pending hoac confirmed" });
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
=======
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
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
