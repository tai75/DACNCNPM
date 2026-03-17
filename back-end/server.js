const express = require("express");
const cors = require("cors");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const adminRoutes = require("./routes/adminRoutes");

// 👇 THÊM ĐẦY ĐỦ
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeesRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const revenueRoutes = require("./routes/revenueRoutes");

const app = express();

app.use(cors());
app.use(express.json());

/* TEST */
app.get("/", (req, res) => {
  res.send("API đang chạy...");
});

/* ================= ROUTES ================= */

// AUTH (login, register)
app.use("/api", authRoutes);

// USER (CRUD user + role)
app.use("/api", userRoutes); // 👈 THIẾU CÁI NÀY

// SERVICES (client + admin dùng chung)
app.use("/api/services", serviceRoutes);

// ADMIN DASHBOARD
app.use("/api/admin", adminRoutes);

// EMPLOYEES
app.use("/api/employees", employeeRoutes);

// BOOKINGS
app.use("/api/bookings", bookingRoutes);

// REVENUE
app.use("/api/revenue", revenueRoutes);

/* RUN */
app.listen(5000, () => {
  console.log("🚀 Server chạy tại http://localhost:5000");
});