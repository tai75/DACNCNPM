const express = require("express");
const router = express.Router();
const revenueController = require("../controller/revenueController");
<<<<<<< HEAD
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, adminMiddleware, revenueController.getRevenue);
router.get("/by-date", authMiddleware, adminMiddleware, revenueController.getRevenueByDate);
=======

router.get("/", revenueController.getRevenue);
router.get("/by-date", revenueController.getRevenueByDate);
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

module.exports = router;