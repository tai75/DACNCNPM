const db = require("../config/db");
<<<<<<< HEAD
const Joi = require("joi");

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const employeePayloadSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
  role: Joi.string().min(2).max(50).required(),
  salary: Joi.number().positive().required(),
});
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

// GET ALL
exports.getEmployees = (req, res) => {
  db.query("SELECT * FROM employees ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// GET DETAIL
exports.getEmployeeById = (req, res) => {
<<<<<<< HEAD
  const { error, value } = idSchema.validate(req.params);
  if (error) return res.status(400).json({ success: false, message: "ID nhân viên không hợp lệ" });

  const { id } = value;
=======
  const { id } = req.params;
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

  db.query("SELECT * FROM employees WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// CREATE
exports.createEmployee = (req, res) => {
<<<<<<< HEAD
  const { error, value } = employeePayloadSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ" });

  const { name, phone, role, salary } = value;
=======
  const { name, phone, role, salary } = req.body;

  if (!name || !phone || !role || !salary) {
    return res.status(400).json({ message: "Thiếu dữ liệu" });
  }
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

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
<<<<<<< HEAD
  const idValidation = idSchema.validate(req.params);
  if (idValidation.error) return res.status(400).json({ success: false, message: "ID nhân viên không hợp lệ" });

  const bodyValidation = employeePayloadSchema.validate(req.body);
  if (bodyValidation.error) return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ" });

  const { id } = idValidation.value;
  const { name, phone, role, salary } = bodyValidation.value;
=======
  const { id } = req.params;
  const { name, phone, role, salary } = req.body;
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

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
<<<<<<< HEAD
  const { error, value } = idSchema.validate(req.params);
  if (error) return res.status(400).json({ success: false, message: "ID nhân viên không hợp lệ" });

  const { id } = value;
=======
  const { id } = req.params;
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

  db.query("DELETE FROM employees WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Xóa thành công" });
  });
};