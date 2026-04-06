const express = require("express");
const router = express.Router();
const revenueController = require("../controller/revenueController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, adminMiddleware, revenueController.getRevenue);
router.get("/by-date", authMiddleware, adminMiddleware, revenueController.getRevenueByDate);

module.exports = router;