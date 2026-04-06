const db = require("../config/db");
<<<<<<< HEAD
const Joi = require("joi");

const serviceIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const servicePayloadSchema = Joi.object({
  name: Joi.string().trim().min(3).max(150).required(),
  price: Joi.number().positive().required(),
  description: Joi.string().allow("", null).max(1000),
});
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

// ================= GET ALL =================
exports.getAll = (req, res) => {
  db.query("SELECT * FROM services", (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    res.json(result);
  });
};

// ================= GET ONE =================
exports.getOne = (req, res) => {
<<<<<<< HEAD
  const { error, value } = serviceIdSchema.validate(req.params);
  if (error) return res.status(400).json({ message: "ID dịch vụ không hợp lệ" });

  const { id } = value;
=======
  const { id } = req.params;
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
  db.query("SELECT * FROM services WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    if (result.length === 0) return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    res.json(result[0]);
  });
};

// ================= CREATE =================
exports.create = (req, res) => {
<<<<<<< HEAD
  // req.body có thể undefined nếu frontend gửi FormData
  const body = req.body || {};
  const { error, value } = servicePayloadSchema.validate(body);
  if (error) return res.status(400).json({ message: "Dữ liệu không hợp lệ" });

  const { name, price, description } = value;
=======
  // 🔥 QUAN TRỌNG: req.body có thể undefined nếu frontend gửi FormData
  const body = req.body || {};
  const name = body.name;
  const price = body.price;
  const description = body.description;
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
  const image = req.file ? req.file.filename : null;

  console.log("CREATE BODY:", body);
  console.log("CREATE FILE:", req.file);

<<<<<<< HEAD
=======
  // VALIDATION
  if (!name || name.trim().length < 3)
    return res.status(400).json({ message: "Tên dịch vụ phải >= 3 ký tự" });
  if (!price || isNaN(price) || Number(price) <= 0)
    return res.status(400).json({ message: "Giá phải là số > 0" });

>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
  const sql = "INSERT INTO services (name, price, description, image) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, price, description, image], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Lỗi thêm dịch vụ" });
    }
    res.status(201).json({ message: "Thêm dịch vụ thành công", id: result.insertId });
  });
};

// ================= UPDATE =================
exports.update = (req, res) => {
<<<<<<< HEAD
  const idValidation = serviceIdSchema.validate(req.params);
  if (idValidation.error) return res.status(400).json({ message: "ID dịch vụ không hợp lệ" });

  const body = req.body || {};
  const bodyValidation = servicePayloadSchema.validate(body);
  if (bodyValidation.error) return res.status(400).json({ message: "Dữ liệu không hợp lệ" });

  const { id } = idValidation.value;
  const { name, price, description } = bodyValidation.value;
=======
  const { id } = req.params;
  const body = req.body || {};
  const name = body.name;
  const price = body.price;
  const description = body.description;
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
  const image = req.file ? req.file.filename : null;

  console.log("UPDATE BODY:", body);
  console.log("UPDATE FILE:", req.file);

<<<<<<< HEAD
=======
  // VALIDATION
  if (!name || name.trim().length < 3)
    return res.status(400).json({ message: "Tên dịch vụ phải >= 3 ký tự" });
  if (!price || isNaN(price) || Number(price) <= 0)
    return res.status(400).json({ message: "Giá phải là số > 0" });

>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
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
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    res.json({ message: "Cập nhật thành công" });
  });
};

// ================= DELETE =================
exports.remove = (req, res) => {
<<<<<<< HEAD
  const { error, value } = serviceIdSchema.validate(req.params);
  if (error) return res.status(400).json({ message: "ID dịch vụ không hợp lệ" });

  const { id } = value;
=======
  const { id } = req.params;
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
  db.query("DELETE FROM services WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi xóa" });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    res.json({ message: "Xóa thành công" });
  });
};