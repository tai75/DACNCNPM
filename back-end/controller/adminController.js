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

exports.getDashboardStats = async (req, res) => {
  try {
    // Run all queries in parallel for better performance
    const [usersResult, servicesResult, bookingsResult, completedResult, revenueResult] = await Promise.all([
      query("SELECT COUNT(*) AS total FROM users"),
      query("SELECT COUNT(*) AS total FROM services"),
      query("SELECT COUNT(*) AS total FROM bookings"),
      query("SELECT COUNT(*) AS total FROM bookings WHERE status = 'completed'"),
      query(`
        SELECT SUM(s.price) AS total
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        WHERE b.status = 'completed'
      `),
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
      revenue: revenueResult[0].total || 0,
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
    res.status(500).json({ success: false, message: "Lá»—i táº£i danh sÃ¡ch Ä‘Ã¡nh giÃ¡" });
  }
};

exports.updateReviewVisibility = async (req, res) => {
  const idValidation = idSchema.validate(req.params);
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID Ä‘Ã¡nh giÃ¡ khÃ´ng há»£p lá»‡" });
  }

  const bodyValidation = visibilitySchema.validate(req.body);
  if (bodyValidation.error) {
    return res.status(400).json({ success: false, message: "Tráº¡ng thÃ¡i hiá»ƒn thá»‹ khÃ´ng há»£p lá»‡" });
  }

  try {
    await ensureReviewVisibilityColumn();

    const result = await query("UPDATE reviews SET is_visible = ? WHERE id = ?", [
      bodyValidation.value.is_visible ? 1 : 0,
      idValidation.value.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "ÄÃ¡nh giÃ¡ khÃ´ng tá»“n táº¡i" });
    }

    res.json({ success: true, message: "Cáº­p nháº­t tráº¡ng thÃ¡i hiá»ƒn thá»‹ thÃ nh cÃ´ng" });
  } catch (err) {
    console.error("Update review visibility error:", err);
    res.status(500).json({ success: false, message: "Lá»—i cáº­p nháº­t tráº¡ng thÃ¡i hiá»ƒn thá»‹" });
  }
};

exports.deleteReview = async (req, res) => {
  const { error, value } = idSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ success: false, message: "ID Ä‘Ã¡nh giÃ¡ khÃ´ng há»£p lá»‡" });
  }

  try {
    const result = await query("DELETE FROM reviews WHERE id = ?", [value.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "ÄÃ¡nh giÃ¡ khÃ´ng tá»“n táº¡i" });
    }

    res.json({ success: true, message: "XÃ³a Ä‘Ã¡nh giÃ¡ thÃ nh cÃ´ng" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ success: false, message: "Lá»—i xÃ³a Ä‘Ã¡nh giÃ¡" });
  }
};

exports.getStaffList = async (req, res) => {
  try {
    const staffs = await query(
      `
        SELECT
          u.id,
          u.name,
          u.phone,
          CASE
            WHEN EXISTS (
              SELECT 1
              FROM bookings b
              WHERE b.staff_id = u.id
                AND b.status IN ('confirmed', 'in_progress')
            ) THEN 'busy'
            ELSE 'available'
          END AS status,
          COALESCE(
            GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR '||'),
            ''
          ) AS specialties
        FROM users u
        LEFT JOIN bookings b2 ON b2.staff_id = u.id
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
    res.status(500).json({ success: false, message: "Lá»—i táº£i danh sÃ¡ch ká»¹ thuáº­t viÃªn" });
  }
};

exports.getStaffSchedule = async (req, res) => {
  const { error, value } = idSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ success: false, message: "ID ká»¹ thuáº­t viÃªn khÃ´ng há»£p lá»‡" });
  }

  try {
    const staffRows = await query(
      "SELECT id, name, phone FROM users WHERE id = ? AND role = 'staff' LIMIT 1",
      [value.id]
    );

    if (staffRows.length === 0) {
      return res.status(404).json({ success: false, message: "Ká»¹ thuáº­t viÃªn khÃ´ng tá»“n táº¡i" });
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
        JOIN users u ON u.id = b.user_id
        JOIN services s ON s.id = b.service_id
        WHERE b.staff_id = ?
        ORDER BY b.booking_date DESC, FIELD(b.time_slot, 'morning', 'afternoon', 'evening') ASC
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
    res.status(500).json({ success: false, message: "Lá»—i táº£i lá»‹ch lÃ m viá»‡c" });
  }
};
