const express = require("express");
const router = express.Router();
const serviceController = require("../controller/serviceController");
const multer = require("multer");
const path = require("path");

// cấu hình nơi lưu ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // lưu vào thư mục uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ROUTES
router.get("/", serviceController.getAll);
router.get("/:id", serviceController.getOne);

// 👇 THÊM upload vào đây
router.post("/", upload.single("image"), serviceController.create);

// nếu muốn update có ảnh luôn
router.put("/:id", upload.single("image"), serviceController.update);

router.delete("/:id", serviceController.remove);

module.exports = router;