const express = require("express");
const router = express.Router();

const contactController = require("../controller/contactController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Public contact form submission
router.post("/", contactController.createContact);

// Admin contact management
router.get("/", authMiddleware, adminMiddleware, contactController.getContacts);
router.put("/:id/status", authMiddleware, adminMiddleware, contactController.updateContactStatus);
router.delete("/:id", authMiddleware, adminMiddleware, contactController.deleteContact);

module.exports = router;
