const db = require("../config/db");
const Joi = require("joi");

const reviewSchema = Joi.object({
  service_id: Joi.number().integer().positive().required(),
  booking_id: Joi.number().integer().positive().allow(null),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow("", null).max(1000),
});

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const serviceIdSchema = Joi.object({
  service_id: Joi.number().integer().positive().required(),
});

// Helper function to promisify database queries
const query = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// ================= CREATE REVIEW =================
exports.create = async (req, res) => {
  try {
    const { error, value } = reviewSchema.validate(req.body);
    if (error) return res.status(400).json({ message: "Dữ liệu không hợp lệ", details: error.details[0].message });

    const { service_id, booking_id, rating, comment } = value;
    const user_id = req.user.id;

    if (booking_id) {
      const bookingResult = await query("SELECT * FROM bookings WHERE id = ? AND user_id = ?", [booking_id, user_id]);
      if (bookingResult.length === 0) {
        return res.status(403).json({ message: "Không có quyền đánh giá booking này" });
      }

      const serviceInBooking = await query(
        "SELECT COUNT(*) AS count FROM booking_items WHERE booking_id = ? AND service_id = ?",
        [booking_id, service_id]
      );

      if (serviceInBooking[0].count === 0 && Number(bookingResult[0].service_id) !== Number(service_id)) {
        return res.status(400).json({ message: "Dịch vụ không trùng khớp với booking" });
      }
    }

    // Insert review
    const insertSql = `
      INSERT INTO reviews (user_id, service_id, booking_id, rating, comment, is_visible)
      VALUES (?, ?, ?, ?, ?, 0)
    `;

    await query(insertSql, [user_id, service_id, booking_id, rating, comment || null]);

    res.status(201).json({ message: "Cảm ơn bạn đã đánh giá!" });
  } catch (err) {
    console.error("Create review error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ================= GET REVIEWS BY SERVICE =================
exports.getByService = async (req, res) => {
  try {
    const { error, value } = serviceIdSchema.validate(req.params);
    if (error) return res.status(400).json({ message: "ID dịch vụ không hợp lệ" });

    const { service_id } = value;

    const reviews = await query(`
      SELECT
        r.id,
        r.user_id,
        u.name AS user_name,
        r.rating,
        r.comment,
        r.created_at,
        r.is_visible
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.service_id = ? AND r.is_visible = 1
      ORDER BY r.created_at DESC
      LIMIT 50
    `, [service_id]);

    const stats = await query(`
      SELECT
        AVG(rating) AS avg_rating,
        COUNT(*) AS total_reviews,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS five_stars,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS four_stars,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS three_stars,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS two_stars,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS one_star
      FROM reviews
      WHERE service_id = ? AND is_visible = 1
    `, [service_id]);

    res.json({
      reviews,
      stats: stats[0] || {
        avg_rating: 0,
        total_reviews: 0,
        five_stars: 0,
        four_stars: 0,
        three_stars: 0,
        two_stars: 0,
        one_star: 0
      }
    });
  } catch (err) {
    console.error("Get reviews by service error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ================= CHECK IF USER REVIEWED BOOKING =================
exports.checkUserReview = async (req, res) => {
  try {
    const { error, value } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ message: "ID booking không hợp lệ" });

    const { id: booking_id } = value;
    const user_id = req.user.id;

    const review = await query(
      "SELECT id FROM reviews WHERE user_id = ? AND booking_id = ?",
      [user_id, booking_id]
    );

    res.json({
      hasReview: review.length > 0,
      reviewId: review.length > 0 ? review[0].id : null
    });
  } catch (err) {
    console.error("Check user review error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ================= GET USER'S REVIEWS =================
exports.getUserReviews = async (req, res) => {
  try {
    const user_id = req.user.id;

    const reviews = await query(`
      SELECT
        r.id,
        r.service_id,
        s.name AS service_name,
        r.rating,
        r.comment,
        r.created_at,
        r.booking_id
      FROM reviews r
      JOIN services s ON r.service_id = s.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [user_id]);

    res.json(reviews);
  } catch (err) {
    console.error("Get user reviews error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
