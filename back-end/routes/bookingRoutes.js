const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const { authMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, bookingController.getBookings);
router.post("/", authMiddleware, bookingController.createBooking);

// ðŸ‘‡ QUAN TRá»ŒNG (Ä‘á»•i tÃªn function)
router.put("/:id/status", authMiddleware, bookingController.updateBookingStatus);
router.put("/:id/payment", authMiddleware, bookingController.updatePaymentStatus);
router.put("/:id/assign-staff", authMiddleware, bookingController.assignStaff);
router.put("/:id/completion", authMiddleware, bookingController.updateCompletion);

router.delete("/:id", authMiddleware, bookingController.deleteBooking);

module.exports = router;
