const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const { authMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, bookingController.getBookings);
router.get("/:id", authMiddleware, bookingController.getBookingDetail);
router.post("/", authMiddleware, bookingController.createBooking);

// 👇 QUAN TRỌNG (đổi tên function)
router.put("/:id/status", authMiddleware, bookingController.updateBookingStatus);
router.put("/:id/payment", authMiddleware, bookingController.updatePaymentStatus);
router.put("/:id/confirm-bank", authMiddleware, bookingController.confirmBankPaymentByUser);
router.put("/:id/assign-staff", authMiddleware, bookingController.assignStaff);
router.put("/:id/completion", authMiddleware, bookingController.updateCompletion);
router.put("/:id/schedule", authMiddleware, bookingController.updateBookingSchedule);

router.delete("/:id", authMiddleware, bookingController.deleteBooking);
router.delete("/:id/items/:itemId", authMiddleware, bookingController.cancelBookingItem);

module.exports = router;