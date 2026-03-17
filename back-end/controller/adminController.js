const db = require("../config/db");

exports.getDashboardStats = (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, users) => {
    stats.users = users[0].totalUsers;

    db.query("SELECT COUNT(*) AS totalServices FROM services", (err, services) => {
      stats.services = services[0].totalServices;

      db.query("SELECT COUNT(*) AS totalBookings FROM bookings", (err, bookings) => {
        stats.bookings = bookings[0].totalBookings;

        db.query("SELECT SUM(total_price) AS revenue FROM bookings", (err, revenue) => {
          stats.revenue = revenue[0].revenue || 0;

          res.json({
            success: true,
            data: stats,
          });
        });
      });
    });
  });
};