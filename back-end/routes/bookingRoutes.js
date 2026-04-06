const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const { authMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, bookingController.getBookings);
router.post("/", authMiddleware, bookingController.createBooking);

// 👇 QUAN TRỌNG (đổi tên function)
router.put("/:id/status", authMiddleware, bookingController.updateBookingStatus);
router.put("/:id/payment", authMiddleware, bookingController.updatePaymentStatus);
<<<<<<< HEAD
router.put("/:id/assign-staff", authMiddleware, bookingController.assignStaff);
router.put("/:id/completion", authMiddleware, bookingController.updateCompletion);
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

router.delete("/:id", authMiddleware, bookingController.deleteBooking);

module.exports = router;