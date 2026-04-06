const db = require("../config/db");
<<<<<<< HEAD
const Joi = require("joi");

const revenueRangeSchema = Joi.object({
  from: Joi.date().iso(),
  to: Joi.date().iso(),
});

// Tổng doanh thu
exports.getRevenue = (req, res) => {
  const { error, value } = revenueRangeSchema.validate(req.query);
  if (error) return res.status(400).json({ success: false, message: "Query không hợp lệ" });

  const { from, to } = value;

=======

// Tổng doanh thu
exports.getRevenue = (req, res) => {
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
  const sql = `
    SELECT SUM(s.price) AS total_revenue
    FROM bookings b
    JOIN services s ON b.service_id = s.id
<<<<<<< HEAD
    WHERE (? IS NULL OR DATE(b.booking_date) >= DATE(?))
      AND (? IS NULL OR DATE(b.booking_date) <= DATE(?))
  `;

  db.query(sql, [from || null, from || null, to || null, to || null], (err, result) => {
=======
  `;

  db.query(sql, (err, result) => {
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// Doanh thu theo ngày
exports.getRevenueByDate = (req, res) => {
<<<<<<< HEAD
  const { error, value } = revenueRangeSchema.validate(req.query);
  if (error) return res.status(400).json({ success: false, message: "Query không hợp lệ" });

  const { from, to } = value;

=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
  const sql = `
    SELECT DATE(b.booking_date) as date, SUM(s.price) as revenue
    FROM bookings b
    JOIN services s ON b.service_id = s.id
<<<<<<< HEAD
    WHERE (? IS NULL OR DATE(b.booking_date) >= DATE(?))
      AND (? IS NULL OR DATE(b.booking_date) <= DATE(?))
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
    GROUP BY DATE(b.booking_date)
    ORDER BY date DESC
  `;

<<<<<<< HEAD
  db.query(sql, [from || null, from || null, to || null, to || null], (err, result) => {
=======
  db.query(sql, (err, result) => {
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};