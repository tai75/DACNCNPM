const express = require("express");
const router = express.Router();
const serviceController = require("../controller/serviceController");
const multer = require("multer");
const path = require("path");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// ===== MULTER =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ===== ROUTES =====
router.get("/", serviceController.getAll);
router.get("/:id", serviceController.getOne);
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), serviceController.create); // "image" pháº£i Ä‘Ãºng vá»›i frontend
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), serviceController.update);
router.delete("/:id", authMiddleware, adminMiddleware, serviceController.remove);

module.exports = router;
