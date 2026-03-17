const db = require("../config/db");

// Tổng doanh thu
exports.getRevenue = (req, res) => {
  const sql = `
    SELECT SUM(s.price) AS total_revenue
    FROM bookings b
    JOIN services s ON b.service_id = s.id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// Doanh thu theo ngày
exports.getRevenueByDate = (req, res) => {
  const sql = `
    SELECT DATE(b.date) as date, SUM(s.price) as revenue
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    GROUP BY DATE(b.date)
    ORDER BY date DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};