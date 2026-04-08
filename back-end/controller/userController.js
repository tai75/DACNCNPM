const db = require("../config/db");
const Joi = require("joi");

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const updateRoleSchema = Joi.object({
  role: Joi.string().valid("user", "staff", "admin").required(),
});

/* ======================
   GET ALL USERS
====================== */
exports.getUsers = (req, res) => {
  db.query(
    "SELECT id, name, email, phone, role FROM users",
    (err, result) => {
      if (err) {
        console.error("Lá»—i getUsers:", err);
        return res.status(500).json({
          success: false,
          message: "Lá»—i server",
        });
      }

      res.json({
        success: true,
        data: result,
      });
    }
  );
};

/* ======================
   DELETE USER
====================== */
exports.deleteUser = (req, res) => {
  const { error, value } = idSchema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "ID user khÃ´ng há»£p lá»‡",
    });
  }

  const { id } = value;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Lá»—i deleteUser:", err);
      return res.status(500).json({
        success: false,
        message: "Lá»—i server",
      });
    }

    // náº¿u khÃ´ng cÃ³ user nÃ o bá»‹ xÃ³a
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User khÃ´ng tá»“n táº¡i",
      });
    }

    res.json({
      success: true,
      message: "XÃ³a user thÃ nh cÃ´ng",

      
    });
  });
};
/* ======================
   UPDATE USER ROLE
====================== */
exports.updateUserRole = (req, res) => {
  const idValidation = idSchema.validate(req.params);
  if (idValidation.error) {
    return res.status(400).json({
      success: false,
      message: "ID user khÃ´ng há»£p lá»‡",
    });
  }

  const roleValidation = updateRoleSchema.validate(req.body);
  if (roleValidation.error) {
    return res.status(400).json({
      success: false,
      message: "Role khÃ´ng há»£p lá»‡",
    });
  }

  const { id } = idValidation.value;
  const { role } = roleValidation.value;

  db.query(
    "UPDATE users SET role = ? WHERE id = ?",
    [role, id],
    (err, result) => {
      if (err) {
        console.error("Lá»—i updateUserRole:", err);
        return res.status(500).json({
          success: false,
          message: "Lá»—i server",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "User khÃ´ng tá»“n táº¡i",
        });
      }

      res.json({
        success: true,
        message: "Cáº­p nháº­t role thÃ nh cÃ´ng",
      });
    }
  );
};
