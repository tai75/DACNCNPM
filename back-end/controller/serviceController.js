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
    if (err) return res.status(500).json({ message: "Lá»—i server" });
    res.json(result);
  });
};

// ================= GET ONE =================
exports.getOne = (req, res) => {
  const { error, value } = serviceIdSchema.validate(req.params);
  if (error) return res.status(400).json({ message: "ID dá»‹ch vá»¥ khÃ´ng há»£p lá»‡" });

  const { id } = value;
  db.query("SELECT * FROM services WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Lá»—i server" });
    if (result.length === 0) return res.status(404).json({ message: "KhÃ´ng tÃ¬m tháº¥y dá»‹ch vá»¥" });
    res.json(result[0]);
  });
};

// ================= CREATE =================
exports.create = (req, res) => {
  // req.body cÃ³ thá»ƒ undefined náº¿u frontend gá»­i FormData
  const body = req.body || {};
  const { error, value } = servicePayloadSchema.validate(body);
  if (error) return res.status(400).json({ message: "Dá»¯ liá»‡u khÃ´ng há»£p lá»‡" });

  const { name, price, description } = value;
  const image = req.file ? req.file.filename : null;

  console.log("CREATE BODY:", body);
  console.log("CREATE FILE:", req.file);

  const sql = "INSERT INTO services (name, price, description, image) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, price, description, image], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Lá»—i thÃªm dá»‹ch vá»¥" });
    }
    res.status(201).json({ message: "ThÃªm dá»‹ch vá»¥ thÃ nh cÃ´ng", id: result.insertId });
  });
};

// ================= UPDATE =================
exports.update = (req, res) => {
  const idValidation = serviceIdSchema.validate(req.params);
  if (idValidation.error) return res.status(400).json({ message: "ID dá»‹ch vá»¥ khÃ´ng há»£p lá»‡" });

  const body = req.body || {};
  const bodyValidation = servicePayloadSchema.validate(body);
  if (bodyValidation.error) return res.status(400).json({ message: "Dá»¯ liá»‡u khÃ´ng há»£p lá»‡" });

  const { id } = idValidation.value;
  const { name, price, description } = bodyValidation.value;
  const image = req.file ? req.file.filename : null;

  console.log("UPDATE BODY:", body);
  console.log("UPDATE FILE:", req.file);

  const sql = `
    UPDATE services
    SET name=?, price=?, description=?, image=COALESCE(?, image)
    WHERE id=?
  `;

  db.query(sql, [name, price, description, image, id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Lá»—i cáº­p nháº­t" });
    }
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "KhÃ´ng tÃ¬m tháº¥y dá»‹ch vá»¥" });
    res.json({ message: "Cáº­p nháº­t thÃ nh cÃ´ng" });
  });
};

// ================= DELETE =================
exports.remove = (req, res) => {
  const { error, value } = serviceIdSchema.validate(req.params);
  if (error) return res.status(400).json({ message: "ID dá»‹ch vá»¥ khÃ´ng há»£p lá»‡" });

  const { id } = value;
  db.query("DELETE FROM services WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Lá»—i xÃ³a" });
    if (result.affectedRows === 0) return res.status(404).json({ message: "KhÃ´ng tÃ¬m tháº¥y dá»‹ch vá»¥" });
    res.json({ message: "XÃ³a thÃ nh cÃ´ng" });
  });
};
