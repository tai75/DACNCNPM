const bcrypt = require("bcrypt");
const db = require("../config/db");
const Joi = require("joi");

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const updateRoleSchema = Joi.object({
  role: Joi.string().valid("user", "staff", "admin").required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  phone: Joi.string().trim().min(8).max(20).required(),
  address: Joi.string().trim().allow("", null).max(255),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(1).required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Mật khẩu xác nhận không khớp",
  }),
});

const hasUserAddressColumn = (callback) => {
  db.query("SHOW COLUMNS FROM users LIKE 'address'", (err, rows) => {
    if (err) {
      return callback(err);
    }
    return callback(null, rows.length > 0);
  });
};

const ensureUserAddressColumn = (callback) => {
  hasUserAddressColumn((checkErr, hasAddress) => {
    if (checkErr) {
      return callback(checkErr);
    }

    if (hasAddress) {
      return callback(null);
    }

    const alterSql = "ALTER TABLE users ADD COLUMN address VARCHAR(255) NULL AFTER phone";
    db.query(alterSql, (alterErr) => {
      if (alterErr) {
        return callback(alterErr);
      }
      return callback(null);
    });
  });
};

/* ======================
   GET MY PROFILE
====================== */
exports.getProfile = (req, res) => {
  ensureUserAddressColumn((columnErr) => {
    if (columnErr) {
      console.error("Lỗi kiểm tra cột address users:", columnErr);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }

    const selectSql = "SELECT id, name, email, phone, role, address FROM users WHERE id = ? LIMIT 1";

    db.query(selectSql, [req.user.id], (err, rows) => {
      if (err) {
        console.error("Lỗi getProfile:", err);
        return res.status(500).json({ success: false, message: "Lỗi server" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "User không tồn tại" });
      }

      return res.json({ success: true, data: rows[0] });
    });
  });
};

/* ======================
   UPDATE MY PROFILE
====================== */
exports.updateProfile = (req, res) => {
  const { error, value } = updateProfileSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ: " + error.details[0].message,
    });
  }

  const { name, phone, address } = value;

  ensureUserAddressColumn((columnErr) => {
    if (columnErr) {
      console.error("Lỗi kiểm tra cột address users:", columnErr);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }

    const updateSql = "UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?";

    const params = [name, phone, address || null, req.user.id];

    db.query(updateSql, params, (err, result) => {
      if (err) {
        console.error("Lỗi updateProfile:", err);
        return res.status(500).json({ success: false, message: "Lỗi server" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "User không tồn tại" });
      }

      return res.json({
        success: true,
        message: "Cập nhật thông tin thành công",
      });
    });
  });
};

/* ======================
   CHANGE PASSWORD
====================== */
exports.changePassword = (req, res) => {
  const { error, value } = changePasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ: " + error.details[0].message,
    });
  }

  const { currentPassword, newPassword } = value;

  db.query("SELECT password FROM users WHERE id = ? LIMIT 1", [req.user.id], async (err, rows) => {
    if (err) {
      console.error("Lỗi changePassword - get user:", err);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User không tồn tại" });
    }

    try {
      const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Mật khẩu hiện tại không đúng" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, req.user.id], (updateErr, result) => {
        if (updateErr) {
          console.error("Lỗi changePassword - update:", updateErr);
          return res.status(500).json({ success: false, message: "Lỗi server" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ success: false, message: "User không tồn tại" });
        }

        return res.json({ success: true, message: "Đổi mật khẩu thành công" });
      });
    } catch (compareErr) {
      console.error("Lỗi changePassword - compare:", compareErr);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
  });
};

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