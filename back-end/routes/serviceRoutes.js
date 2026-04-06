const express = require("express");
const router = express.Router();
const serviceController = require("../controller/serviceController");
const multer = require("multer");
const path = require("path");
<<<<<<< HEAD
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

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
<<<<<<< HEAD
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), serviceController.create); // "image" phải đúng với frontend
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), serviceController.update);
router.delete("/:id", authMiddleware, adminMiddleware, serviceController.remove);
=======
router.post("/", upload.single("image"), serviceController.create); // "image" phải đúng với frontend
router.put("/:id", upload.single("image"), serviceController.update);
router.delete("/:id", serviceController.remove);
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

module.exports = router;