const db = require("../config/db");
const Joi = require("joi");

const serviceIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const servicePayloadSchema = Joi.object({
  name: Joi.string().trim().min(3).max(150).required(),
  price: Joi.number().positive().required(),
  description: Joi.string().allow("", null).max(1000),
});

// ================= GET ALL =================
exports.getAll = (req, res) => {
  db.query("SELECT * FROM services", (err, result) => {
    if (err) {
      console.error("Get all services error:", err);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
    res.json({ success: true, data: result });
  });
};

// ================= GET ONE =================
exports.getOne = (req, res) => {
  const { error, value } = serviceIdSchema.validate(req.params);
  if (error) return res.status(400).json({ success: false, message: "ID dịch vụ không hợp lệ" });

  const { id } = value;
  db.query("SELECT * FROM services WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Get service error:", err);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
    if (result.length === 0) return res.status(404).json({ success: false, message: "Không tìm thấy dịch vụ" });
    res.json({ success: true, data: result[0] });
  });
};
const body = req.body || {};
  const { error, value } = servicePayloadSchema.validate(body);
  if (error) return res.status(400).json({ success: false,d gửi FormData
  const body = req.body || {};
  const { error, value } = servicePayloadSchema.validate(body);
  if (error) return res.status(400).json({ message: "Dữ liệu không hợp lệ" });

  const { name, price, description } = value;
  const image = req.file ? req.file.filename : null;

  const sql = "INSERT INTO services (name, price, description, image) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, price, description, image], (err, result) => {
    if (err) {
      console.error("Create service error:", err);
      return res.status(500).json({ message: "Lỗi thêm dịch vụ" });
    }success: false, message: "Lỗi thêm dịch vụ" });
    }
    res.status(201).json({ success: true, message: "Thêm dịch vụ thành công", data: { id: result.insertId }
};

// ================= UPDATE =================
exports.update = (req, res) => {
  const idValidation = serviceIdSchema.validate(req.params);
  if (idValidation.error) return res.status(400).json({ message: "ID dịch vụ không hợp lệ" });
success: false, message: "ID dịch vụ không hợp lệ" });

  const body = req.body || {};
  const bodyValidation = servicePayloadSchema.validate(body);
  if (bodyValidation.error) return res.status(400).json({ success: false,
  const { id } = idValidation.value;
  const { name, price, description } = bodyValidation.value;
  const image = req.file ? req.file.filename : null;

  const sql = `
    UPDATE services
    SET name=?, price=?, description=?, image=COALESCE(?, image)
    WHERE id=?
  `;

  db.query(sql, [name, price, description, image, id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Lỗi cập nhật" });
    }
    if (resulterror("Update service error:", ectedRows === 0)
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    res.json({ message: "Cập nhật thành công" });
  });
};

// ================= DELETE =================
exports.remove = (req, res) => {
  const { error, value } = serviceIdSchema.validate(req.params);
  if (error) return res.status(400).json({ success: false, message: "ID dịch vụ không hợp lệ" });

  const { id } = value;
  db.query("DELETE FROM services WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Delete service error:", err);
      return res.status(500).json({ success: false, message: "Lỗi xóa" });
    }
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Không tìm thấy dịch vụ" });
    res.json({ success: true, message: "Xóa thành công" });
  });
};