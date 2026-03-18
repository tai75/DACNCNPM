const express = require("express");
const cors = require("cors");

const app = express();

// 👇 KẾT NỐI DB
const db = require("./config/db");

// 👇 ROUTES
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeesRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const revenueRoutes = require("./routes/revenueRoutes");

app.use(cors());
app.use(express.json());

// 👇 CHO PHÉP LOAD ẢNH
app.use("/uploads", express.static("uploads"));

/* TEST */
app.get("/", (req, res) => {
  res.send("API đang chạy...");
});

/* ROUTES */
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/revenue", revenueRoutes);

/* RUN SERVER */
app.listen(5000, () => {
  console.log("🚀 Server chạy tại http://localhost:5000");
});