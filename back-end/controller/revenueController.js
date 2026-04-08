const db = require("../config/db");
const Joi = require("joi");

const revenueRangeSchema = Joi.object({
  from: Joi.date().iso(),
  to: Joi.date().iso(),
});

// Tá»•ng doanh thu
exports.getRevenue = (req, res) => {
  const { error, value } = revenueRangeSchema.validate(req.query);
  if (error) return res.status(400).json({ success: false, message: "Query khÃ´ng há»£p lá»‡" });

  const { from, to } = value;

  const sql = `
    SELECT SUM(s.price) AS total_revenue
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    WHERE (? IS NULL OR DATE(b.booking_date) >= DATE(?))
      AND (? IS NULL OR DATE(b.booking_date) <= DATE(?))
  `;

  db.query(sql, [from || null, from || null, to || null, to || null], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// Doanh thu theo ngÃ y
exports.getRevenueByDate = (req, res) => {
  const { error, value } = revenueRangeSchema.validate(req.query);
  if (error) return res.status(400).json({ success: false, message: "Query khÃ´ng há»£p lá»‡" });

  const { from, to } = value;

  const sql = `
    SELECT DATE(b.booking_date) as date, SUM(s.price) as revenue
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    WHERE (? IS NULL OR DATE(b.booking_date) >= DATE(?))
      AND (? IS NULL OR DATE(b.booking_date) <= DATE(?))
    GROUP BY DATE(b.booking_date)
    ORDER BY date DESC
  `;

  db.query(sql, [from || null, from || null, to || null, to || null], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};
