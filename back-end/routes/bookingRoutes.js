const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");

router.get("/", bookingController.getBookings);
router.post("/", bookingController.createBooking);

// 👇 QUAN TRỌNG (đổi tên function)
router.put("/:id", bookingController.updateBookingStatus);

router.delete("/:id", bookingController.deleteBooking);

module.exports = router;