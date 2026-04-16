const db = require("../config/db");
const Joi = require("joi");

const revenueRangeSchema = Joi.object({
  from: Joi.date().iso(),
  to: Joi.date().iso(),
});

const queryWithBookingItemsFallback = (sqlWithItems, sqlFallback, params, callback) => {
  db.query(sqlWithItems, params, (err, result) => {
    if (!err) return callback(null, result);

    if (err.code === "ER_NO_SUCH_TABLE") {
      return db.query(sqlFallback, params, callback);
    }

    return callback(err);
  });
};

// Tổng doanh thu
exports.getRevenue = (req, res) => {
  const { error, value } = revenueRangeSchema.validate(req.query);
  if (error) return res.status(400).json({ success: false, message: "Query không hợp lệ" });

  const { from, to } = value;

  const sql = `
    SELECT SUM(COALESCE(bi_totals.booking_total, s.price)) AS total_revenue
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    LEFT JOIN (
      SELECT booking_id, SUM(quantity * unit_price) AS booking_total
      FROM booking_items
      GROUP BY booking_id
    ) bi_totals ON bi_totals.booking_id = b.id
    WHERE (? IS NULL OR DATE(b.booking_date) >= DATE(?))
      AND (? IS NULL OR DATE(b.booking_date) <= DATE(?))
      AND b.status <> 'cancelled'
      AND (b.status = 'completed' OR b.payment_status = 'paid')
  `;

  const fallbackSql = `
    SELECT SUM(s.price) AS total_revenue
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    WHERE (? IS NULL OR DATE(b.booking_date) >= DATE(?))
      AND (? IS NULL OR DATE(b.booking_date) <= DATE(?))
      AND b.status <> 'cancelled'
      AND (b.status = 'completed' OR b.payment_status = 'paid')
  `;

  queryWithBookingItemsFallback(
    sql,
    fallbackSql,
    [from || null, from || null, to || null, to || null],
    (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
    }
  );
};

// Doanh thu theo ngày
exports.getRevenueByDate = (req, res) => {
  const { error, value } = revenueRangeSchema.validate(req.query);
  if (error) return res.status(400).json({ success: false, message: "Query không hợp lệ" });

  const { from, to } = value;

  const sql = `
    SELECT
      DATE(b.booking_date) AS date,
      SUM(COALESCE(bi_totals.booking_total, s.price)) AS revenue
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    LEFT JOIN (
      SELECT booking_id, SUM(quantity * unit_price) AS booking_total
      FROM booking_items
      GROUP BY booking_id
    ) bi_totals ON bi_totals.booking_id = b.id
    WHERE (? IS NULL OR DATE(b.booking_date) >= DATE(?))
      AND (? IS NULL OR DATE(b.booking_date) <= DATE(?))
      AND b.status <> 'cancelled'
      AND (b.status = 'completed' OR b.payment_status = 'paid')
    GROUP BY DATE(b.booking_date)
    ORDER BY date DESC
  `;

  const fallbackSql = `
    SELECT
      DATE(b.booking_date) AS date,
      SUM(s.price) AS revenue
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    WHERE (? IS NULL OR DATE(b.booking_date) >= DATE(?))
      AND (? IS NULL OR DATE(b.booking_date) <= DATE(?))
      AND b.status <> 'cancelled'
      AND (b.status = 'completed' OR b.payment_status = 'paid')
    GROUP BY DATE(b.booking_date)
    ORDER BY date DESC
  `;

  queryWithBookingItemsFallback(
    sql,
    fallbackSql,
    [from || null, from || null, to || null, to || null],
    (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
    }
  );
};