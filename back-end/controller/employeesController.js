const db = require("../config/db");
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

// GET ALL
exports.getEmployees = (req, res) => {
  db.query("SELECT * FROM employees ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// GET DETAIL
exports.getEmployeeById = (req, res) => {
  const { error, value } = idSchema.validate(req.params);
  if (error) return res.status(400).json({ success: false, message: "ID nhÃ¢n viÃªn khÃ´ng há»£p lá»‡" });

  const { id } = value;

  db.query("SELECT * FROM employees WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// CREATE
exports.createEmployee = (req, res) => {
  const { error, value } = employeePayloadSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: "Dá»¯ liá»‡u khÃ´ng há»£p lá»‡" });

  const { name, phone, role, salary } = value;

  const sql = `
    INSERT INTO employees (name, phone, role, salary)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, phone, role, salary], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "ThÃªm nhÃ¢n viÃªn thÃ nh cÃ´ng" });
  });
};

// UPDATE
exports.updateEmployee = (req, res) => {
  const idValidation = idSchema.validate(req.params);
  if (idValidation.error) return res.status(400).json({ success: false, message: "ID nhÃ¢n viÃªn khÃ´ng há»£p lá»‡" });

  const bodyValidation = employeePayloadSchema.validate(req.body);
  if (bodyValidation.error) return res.status(400).json({ success: false, message: "Dá»¯ liá»‡u khÃ´ng há»£p lá»‡" });

  const { id } = idValidation.value;
  const { name, phone, role, salary } = bodyValidation.value;

  const sql = `
    UPDATE employees
    SET name=?, phone=?, role=?, salary=?
    WHERE id=?
  `;

  db.query(sql, [name, phone, role, salary, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Cáº­p nháº­t thÃ nh cÃ´ng" });
  });
};

// DELETE
exports.deleteEmployee = (req, res) => {
  const { error, value } = idSchema.validate(req.params);
  if (error) return res.status(400).json({ success: false, message: "ID nhÃ¢n viÃªn khÃ´ng há»£p lá»‡" });

  const { id } = value;

  db.query("DELETE FROM employees WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "XÃ³a thÃ nh cÃ´ng" });
  });
};
