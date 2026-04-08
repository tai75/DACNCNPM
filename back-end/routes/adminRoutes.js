const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const adminController = require("../controller/adminController");
const userController = require("../controller/userController");
const serviceController = require("../controller/serviceController");
const bookingController = require("../controller/bookingController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// ==== Multer setup ====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, "image-" + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// DASHBOARD
router.get("/dashboard", authMiddleware, adminMiddleware, adminController.getDashboardStats);

// USERS
router.get("/users", authMiddleware, adminMiddleware, userController.getUsers);
router.delete("/users/:id", authMiddleware, adminMiddleware, userController.deleteUser);
router.put("/users/:id", authMiddleware, adminMiddleware, userController.updateUserRole);

// STAFF
router.get("/staff", authMiddleware, adminMiddleware, adminController.getStaffList);
router.get("/staff/:id/schedule", authMiddleware, adminMiddleware, adminController.getStaffSchedule);

// REVIEWS
router.get("/reviews", authMiddleware, adminMiddleware, adminController.getReviews);
router.patch("/reviews/:id/visibility", authMiddleware, adminMiddleware, adminController.updateReviewVisibility);
router.delete("/reviews/:id", authMiddleware, adminMiddleware, adminController.deleteReview);

// BOOKINGS
router.get("/bookings", authMiddleware, adminMiddleware, bookingController.getBookings);
router.put("/bookings/:id/assign-staff", authMiddleware, adminMiddleware, bookingController.assignStaff);

// SERVICES
router.get("/services", authMiddleware, adminMiddleware, serviceController.getAll);
router.post("/services", authMiddleware, adminMiddleware, upload.single("image"), serviceController.create);
router.put("/services/:id", authMiddleware, adminMiddleware, upload.single("image"), serviceController.update);
router.delete("/services/:id", authMiddleware, adminMiddleware, serviceController.remove);

module.exports = router;
