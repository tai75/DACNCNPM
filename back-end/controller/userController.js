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
        console.error("Lỗi getUsers:", err);
        return res.status(500).json({
          success: false,
          message: "Lỗi server",
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
      message: "ID user không hợp lệ",
    });
  }

  const { id } = value;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Lỗi deleteUser:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }

    // nếu không có user nào bị xóa
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User không tồn tại",
      });
    }

    res.json({
      success: true,
      message: "Xóa user thành công",

      
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
      message: "ID user không hợp lệ",
    });
  }

  const roleValidation = updateRoleSchema.validate(req.body);
  if (roleValidation.error) {
    return res.status(400).json({
      success: false,
      message: "Role không hợp lệ",
    });
  }

  const { id } = idValidation.value;
  const { role } = roleValidation.value;

  db.query(
    "UPDATE users SET role = ? WHERE id = ?",
    [role, id],
    (err, result) => {
      if (err) {
        console.error("Lỗi updateUserRole:", err);
        return res.status(500).json({
          success: false,
          message: "Lỗi server",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "User không tồn tại",
        });
      }

      res.json({
        success: true,
        message: "Cập nhật role thành công",
      });
    }
  );
};