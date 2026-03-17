const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");

/* DASHBOARD */
router.get("/dashboard", adminController.getDashboardStats);

module.exports = router;