const express = require("express");
const router = express.Router();
const revenueController = require("../controller/revenueController");

router.get("/", revenueController.getRevenue);
router.get("/by-date", revenueController.getRevenueByDate);

module.exports = router;