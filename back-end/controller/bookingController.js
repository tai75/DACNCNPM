const db = require("../config/db");
const Joi = require("joi");

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
  staff_ids: Joi.array().items(Joi.number().integer().positive()).min(1).max(2).unique().required(),
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

const ensureSecondaryStaffColumn = (callback) => {
  db.query("SHOW COLUMNS FROM bookings LIKE 'secondary_staff_id'", (checkErr, rows) => {
    if (checkErr) {
      return callback(checkErr);
    }

    if (rows.length > 0) {
      return callback(null);
    }

    db.query("ALTER TABLE bookings ADD COLUMN secondary_staff_id INT UNSIGNED NULL AFTER staff_id", (alterErr) => {
      if (alterErr) {
        return callback(alterErr);
      }

      db.query("CREATE INDEX idx_bookings_secondary_staff_id ON bookings (secondary_staff_id)", (indexErr) => {
        if (indexErr && indexErr.code !== "ER_DUP_KEYNAME") {
          return callback(indexErr);
        }
        return callback(null);
      });
    });
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

  ensureSecondaryStaffColumn((columnErr) => {
    if (columnErr) {
      console.error("Ensure secondary_staff_id error:", columnErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    let sql = `
      SELECT
        b.id,
        b.booking_date,
        b.time_slot,
        b.address,
        b.note,
        b.status,
        b.payment_method,
        b.payment_status,
        b.staff_id,
        b.secondary_staff_id,
        b.completion_note,
        b.before_image,
        b.after_image,
        b.created_at,
        u.name AS user_name,
        st.name AS staff_name,
        st2.name AS secondary_staff_name,
        s.name AS service_name,
        s.price AS service_price,
        s.image AS service_image
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      LEFT JOIN users st ON b.staff_id = st.id
      LEFT JOIN users st2 ON b.secondary_staff_id = st2.id
    `;

    let countSql = "SELECT COUNT(*) AS total FROM bookings b";
    const params = [];
    const countParams = [];

    if (req.user.role === "staff") {
      sql += " WHERE (b.staff_id = ? OR b.secondary_staff_id = ?)";
      countSql += " WHERE (b.staff_id = ? OR b.secondary_staff_id = ?)";
      params.push(req.user.id, req.user.id);
      countParams.push(req.user.id, req.user.id);
    } else if (req.user.role !== "admin") {
      sql += " WHERE b.user_id = ?";
      countSql += " WHERE b.user_id = ?";
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
          data: result.map((booking) => {
            const staffNames = [booking.staff_name, booking.secondary_staff_name].filter(Boolean);
            return {
              ...booking,
              staff_names: staffNames,
              status_vietnamese: statusTranslations[booking.status] || booking.status,
              payment_method_vietnamese:
                paymentMethodTranslations[booking.payment_method] || booking.payment_method,
              payment_status_vietnamese:
                paymentStatusTranslations[booking.payment_status] || booking.payment_status,
            };
          }),
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
          },
        });
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

  const { service_id, booking_date, time_slot, address, note, payment_method } = value;

  const checkConflictSql = `
    SELECT id
    FROM bookings
    WHERE user_id = ?
      AND DATE(booking_date) = DATE(?)
      AND time_slot = ?
      AND status IN ('pending', 'confirmed', 'in_progress')
    LIMIT 1
  `;

  db.query(checkConflictSql, [req.user.id, booking_date, time_slot], (checkErr, checkRows) => {
    if (checkErr) {
      console.error("Check conflict error:", checkErr);
      return res.status(500).json({ success: false, message: "Loi may chu" });
    }

    if (checkRows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Ban da co lich hen trong khung gio nay. Vui long chon khung gio khac",
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

exports.confirmBankPaymentByUser = (req, res) => {
  const idValidation = bookingIdSchema.validate(req.params);
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const { id } = idValidation.value;

  const findSql = "SELECT id, user_id, payment_method, payment_status FROM bookings WHERE id = ?";
  db.query(findSql, [id], (findErr, rows) => {
    if (findErr) {
      console.error("Find booking for bank confirm error:", findErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Don dat lich khong ton tai" });
    }

    const booking = rows[0];

    if (booking.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Ban khong co quyen cap nhat don nay" });
    }

    if (booking.payment_method !== "bank") {
      return res.status(400).json({ success: false, message: "Don dat lich nay khong su dung thanh toan ngan hang" });
    }

    if (booking.payment_status === "paid") {
      return res.json({ success: true, message: "Thanh toan da duoc xac nhan truoc do" });
    }

    const updateSql = "UPDATE bookings SET payment_status = 'paid' WHERE id = ?";
    db.query(updateSql, [id], (updateErr) => {
      if (updateErr) {
        console.error("Confirm bank payment error:", updateErr);
        return res.status(500).json({ success: false, message: "Loi server" });
      }

      createNotification(booking.user_id, `Booking #${id} da xac nhan thanh toan ngan hang`, id);

      return res.json({
        success: true,
        message: "Xac nhan thanh toan ngan hang thanh cong",
      });
    });
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

  db.query("SELECT id, user_id, staff_id, secondary_staff_id, status FROM bookings WHERE id = ?", [id], (findErr, rows) => {
    if (findErr) {
      console.error("Find booking error:", findErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Booking khong ton tai" });
    }

    const booking = rows[0];

    if (req.user.role === "staff") {
      const allowedStaffIds = [booking.staff_id, booking.secondary_staff_id].filter(Boolean);
      if (allowedStaffIds.length > 0 && !allowedStaffIds.includes(req.user.id)) {
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
  const rawStaffIds = bodyValidation.value.staff_ids || [];
  const staffIds = [...new Set(rawStaffIds.map((id) => Number(id)).filter(Boolean))].slice(0, 2);

  if (staffIds.length === 0) {
    return res.status(400).json({ success: false, message: "Can it nhat 1 staff hop le" });
  }

  ensureSecondaryStaffColumn((columnErr) => {
    if (columnErr) {
      console.error("Ensure secondary_staff_id error:", columnErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    const placeholders = staffIds.map(() => "?").join(", ");
    db.query(`SELECT id, role FROM users WHERE id IN (${placeholders})`, staffIds, (staffErr, staffRows) => {
    if (staffErr) {
      console.error("Find staff error:", staffErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (staffRows.length !== staffIds.length || staffRows.some((row) => row.role !== "staff")) {
      return res.status(400).json({ success: false, message: "Danh sach staff khong hop le" });
    }

    const primaryStaffId = staffIds[0];
    const secondaryStaffId = staffIds[1] || null;

    const sql = `
      UPDATE bookings
      SET staff_id = ?,
          secondary_staff_id = ?,
          status = CASE WHEN status = 'pending' THEN 'confirmed' ELSE status END
      WHERE id = ?
    `;

    db.query(sql, [primaryStaffId, secondaryStaffId, id], (err, result) => {
      if (err) {
        console.error("Assign staff error:", err);
        return res.status(500).json({ success: false, message: "Loi server" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Booking khong ton tai" });
      }

      staffIds.forEach((staffId) => {
        createNotification(staffId, `Ban duoc phan cong booking #${id}`, id);
      });

      return res.json({ success: true, message: "Gan nhan vien thanh cong" });
    });
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

  db.query("SELECT id, user_id, staff_id, secondary_staff_id FROM bookings WHERE id = ?", [id], (findErr, rows) => {
    if (findErr) {
      console.error("Find booking for completion error:", findErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Booking khong ton tai" });
    }

    const booking = rows[0];
    const allowedStaffIds = [booking.staff_id, booking.secondary_staff_id].filter(Boolean);
    if (req.user.role === "staff" && allowedStaffIds.length > 0 && !allowedStaffIds.includes(req.user.id)) {
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
