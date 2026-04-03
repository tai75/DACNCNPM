const db = require("../config/db");

// GET ALL
exports.getEmployees = (req, res) => {
  db.query("SELECT * FROM employees ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// GET DETAIL
exports.getEmployeeById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM employees WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// CREATE
exports.createEmployee = (req, res) => {
  const { name, phone, role, salary } = req.body;

  if (!name || !phone || !role || !salary) {
    return res.status(400).json({ message: "Thiếu dữ liệu" });
  }

  const sql = `
    INSERT INTO employees (name, phone, role, salary)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, phone, role, salary], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Thêm nhân viên thành công" });
  });
};

// UPDATE
exports.updateEmployee = (req, res) => {
  const { id } = req.params;
  const { name, phone, role, salary } = req.body;

  const sql = `
    UPDATE employees
    SET name=?, phone=?, role=?, salary=?
    WHERE id=?
  `;

  db.query(sql, [name, phone, role, salary, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Cập nhật thành công" });
  });
};

// DELETE
exports.deleteEmployee = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM employees WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Xóa thành công" });
  });
};