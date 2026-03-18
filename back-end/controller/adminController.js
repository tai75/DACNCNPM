const db = require("../config/db");

exports.getDashboardStats = (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, users) => {
    if (err) return res.status(500).json(err);
    stats.users = users[0].totalUsers;

    db.query("SELECT COUNT(*) AS totalServices FROM services", (err, services) => {
      if (err) return res.status(500).json(err);
      stats.services = services[0].totalServices;

      db.query("SELECT COUNT(*) AS totalBookings FROM bookings", (err, bookings) => {
        if (err) return res.status(500).json(err);
        stats.bookings = bookings[0].totalBookings;

        // ✅ FIX Ở ĐÂY
        db.query(
          `
          SELECT SUM(s.price) AS revenue
          FROM bookings b
          JOIN services s ON b.service_id = s.id
          `,
          (err, revenue) => {
            if (err) return res.status(500).json(err);

            stats.revenue = revenue[0].revenue || 0;

            res.json({
              success: true,
              data: stats,
            });
          }
        );
      });
    });
  });
};