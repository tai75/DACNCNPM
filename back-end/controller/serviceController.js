const db = require("../config/db");

// ================= GET ALL =================
exports.getAll = (req, res) => {
  db.query("SELECT * FROM services", (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    res.json(result);
  });
};

// ================= GET ONE =================
exports.getOne = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM services WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    if (result.length === 0) return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    res.json(result[0]);
  });
};

// ================= CREATE =================
exports.create = (req, res) => {
  // 🔥 QUAN TRỌNG: req.body có thể undefined nếu frontend gửi FormData
  const body = req.body || {};
  const name = body.name;
  const price = body.price;
  const description = body.description;
  const image = req.file ? req.file.filename : null;

  console.log("CREATE BODY:", body);
  console.log("CREATE FILE:", req.file);

  // VALIDATION
  if (!name || name.trim().length < 3)
    return res.status(400).json({ message: "Tên dịch vụ phải >= 3 ký tự" });
  if (!price || isNaN(price) || Number(price) <= 0)
    return res.status(400).json({ message: "Giá phải là số > 0" });

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
  const { id } = req.params;
  const body = req.body || {};
  const name = body.name;
  const price = body.price;
  const description = body.description;
  const image = req.file ? req.file.filename : null;

  console.log("UPDATE BODY:", body);
  console.log("UPDATE FILE:", req.file);

  // VALIDATION
  if (!name || name.trim().length < 3)
    return res.status(400).json({ message: "Tên dịch vụ phải >= 3 ký tự" });
  if (!price || isNaN(price) || Number(price) <= 0)
    return res.status(400).json({ message: "Giá phải là số > 0" });

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
  const { id } = req.params;
  db.query("DELETE FROM services WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi xóa" });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    res.json({ message: "Xóa thành công" });
  });
};