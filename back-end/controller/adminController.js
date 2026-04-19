const db = require("../config/db");
const Joi = require("joi");

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const visibilitySchema = Joi.object({
  is_visible: Joi.boolean().required(),
});

let reviewVisibilityReady = false;

const ensureReviewVisibilityColumn = async () => {
  if (reviewVisibilityReady) return;

  try {
    await query("ALTER TABLE reviews ADD COLUMN is_visible TINYINT(1) NOT NULL DEFAULT 1");
  } catch (err) {
    if (err && err.code !== "ER_DUP_FIELDNAME") {
      throw err;
    }
  }

  reviewVisibilityReady = true;
};

// Helper function to promisify database queries
const query = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const ensureBookingStaffAssignmentsTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS booking_staff_assignments (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      booking_id INT UNSIGNED NOT NULL,
      staff_id INT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_booking_staff_assignments_booking FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_booking_staff_assignments_staff FOREIGN KEY (staff_id)
        REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      UNIQUE KEY uq_booking_staff (booking_id, staff_id),
      KEY idx_booking_staff_assignments_booking_id (booking_id),
      KEY idx_booking_staff_assignments_staff_id (staff_id)
    ) ENGINE=InnoDB
  `);

  await query(`
    INSERT IGNORE INTO booking_staff_assignments (booking_id, staff_id)
    SELECT id, staff_id FROM bookings WHERE staff_id IS NOT NULL
  `);

  await query(`
    INSERT IGNORE INTO booking_staff_assignments (booking_id, staff_id)
    SELECT id, secondary_staff_id FROM bookings WHERE secondary_staff_id IS NOT NULL
  `);
};

exports.getDashboardStats = async (req, res) => {
  try {
    let revenueTotal = 0;

    try {
      const revenueResult = await query(`
        SELECT SUM(COALESCE(bi_totals.booking_total, s.price)) AS total
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        LEFT JOIN (
          SELECT booking_id, SUM(quantity * unit_price) AS booking_total
          FROM booking_items
          GROUP BY booking_id
        ) bi_totals ON bi_totals.booking_id = b.id
        WHERE b.status <> 'cancelled'
          AND (b.status = 'completed' OR b.payment_status = 'paid')
      `);

      revenueTotal = revenueResult[0]?.total || 0;
    } catch (revenueErr) {
      if (revenueErr.code !== "ER_NO_SUCH_TABLE") {
        throw revenueErr;
      }

      const fallbackRevenueResult = await query(`
        SELECT SUM(s.price) AS total
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        WHERE b.status <> 'cancelled'
          AND (b.status = 'completed' OR b.payment_status = 'paid')
      `);

      revenueTotal = fallbackRevenueResult[0]?.total || 0;
    }

    // Run all queries in parallel for better performance
    const [usersResult, servicesResult, bookingsResult, completedResult] = await Promise.all([
      query("SELECT COUNT(*) AS total FROM users"),
      query("SELECT COUNT(*) AS total FROM services"),
      query("SELECT COUNT(*) AS total FROM bookings"),
      query("SELECT COUNT(*) AS total FROM bookings WHERE status = 'completed'"),
    ]);

    const totalBookings = bookingsResult[0].total;
    const completedBookings = completedResult[0].total;

    const stats = {
      users: usersResult[0].total,
      services: servicesResult[0].total,
      bookings: totalBookings,
      completionRate: totalBookings > 0 
        ? Number(((completedBookings / totalBookings) * 100).toFixed(2))
        : 0,
      revenue: revenueTotal,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    await ensureReviewVisibilityColumn();

    const reviews = await query(
      `
        SELECT
          r.id,
          r.rating,
          r.comment,
          r.is_visible,
          r.created_at,
          u.name AS customer_name,
          s.name AS service_name
        FROM reviews r
        JOIN users u ON u.id = r.user_id
        JOIN services s ON s.id = r.service_id
        ORDER BY r.created_at DESC
      `
    );

    res.json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    console.error("Get reviews error:", err);
    res.status(500).json({ success: false, message: "Lỗi tải danh sách đánh giá" });
  }
};

exports.updateReviewVisibility = async (req, res) => {
  const idValidation = idSchema.validate(req.params);
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID đánh giá không hợp lệ" });
  }

  const bodyValidation = visibilitySchema.validate(req.body);
  if (bodyValidation.error) {
    return res.status(400).json({ success: false, message: "Trạng thái hiển thị không hợp lệ" });
  }

  try {
    await ensureReviewVisibilityColumn();

    const result = await query("UPDATE reviews SET is_visible = ? WHERE id = ?", [
      bodyValidation.value.is_visible ? 1 : 0,
      idValidation.value.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Đánh giá không tồn tại" });
    }

    res.json({ success: true, message: "Cập nhật trạng thái hiển thị thành công" });
  } catch (err) {
    console.error("Update review visibility error:", err);
    res.status(500).json({ success: false, message: "Lỗi cập nhật trạng thái hiển thị" });
  }
};

exports.deleteReview = async (req, res) => {
  const { error, value } = idSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ success: false, message: "ID đánh giá không hợp lệ" });
  }

  try {
    const result = await query("DELETE FROM reviews WHERE id = ?", [value.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Đánh giá không tồn tại" });
    }

    res.json({ success: true, message: "Xóa đánh giá thành công" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ success: false, message: "Lỗi xóa đánh giá" });
  }
};

exports.getStaffList = async (req, res) => {
  try {
    await ensureBookingStaffAssignmentsTable();

    const staffs = await query(
      `
        SELECT
          u.id,
          u.name,
          u.phone,
          CASE
            WHEN EXISTS (
              SELECT 1
              FROM booking_staff_assignments bsa
              WHERE bsa.staff_id = u.id
                AND EXISTS (
                  SELECT 1
                  FROM bookings b
                  WHERE b.id = bsa.booking_id
                AND b.status IN ('confirmed', 'in_progress')
                )
            ) THEN 'busy'
            ELSE 'available'
          END AS status,
          COALESCE(
            GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR '||'),
            ''
          ) AS specialties
        FROM users u
        LEFT JOIN booking_staff_assignments bsa2 ON bsa2.staff_id = u.id
        LEFT JOIN bookings b2 ON b2.id = bsa2.booking_id
        LEFT JOIN services s ON s.id = b2.service_id
        WHERE u.role = 'staff'
        GROUP BY u.id, u.name, u.phone
        ORDER BY u.id DESC
      `
    );

    const normalized = staffs.map((staff) => ({
      ...staff,
      specialties: staff.specialties
        ? staff.specialties.split("||").filter(Boolean).slice(0, 3)
        : [],
    }));

    res.json({ success: true, data: normalized });
  } catch (err) {
    console.error("Get staff list error:", err);
    res.status(500).json({ success: false, message: "Lỗi tải danh sách kỹ thuật viên" });
  }
};

exports.getStaffSchedule = async (req, res) => {
  const { error, value } = idSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ success: false, message: "ID kỹ thuật viên không hợp lệ" });
  }

  try {
    await ensureBookingStaffAssignmentsTable();

    const staffRows = await query(
      "SELECT id, name, phone FROM users WHERE id = ? AND role = 'staff' LIMIT 1",
      [value.id]
    );

    if (staffRows.length === 0) {
      return res.status(404).json({ success: false, message: "Kỹ thuật viên không tồn tại" });
    }

    const schedules = await query(
      `
        SELECT
          b.id,
          b.booking_date,
          b.time_slot,
          b.status,
          b.address,
          u.name AS customer_name,
          s.name AS service_name
        FROM bookings b
        JOIN booking_staff_assignments bsa ON bsa.booking_id = b.id
        JOIN users u ON u.id = b.user_id
        JOIN services s ON s.id = b.service_id
        WHERE bsa.staff_id = ?
        ORDER BY b.booking_date DESC, FIELD(b.time_slot, 'morning', 'afternoon') ASC
      `,
      [value.id]
    );

    res.json({
      success: true,
      data: {
        staff: staffRows[0],
        schedules,
      },
    });
  } catch (err) {
    console.error("Get staff schedule error:", err);
    res.status(500).json({ success: false, message: "Lỗi tải lịch làm việc" });
  }
};