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

/* Get user profile */
exports.getProfile = (req, res) => {
  ensureUserAddressColumn((columnErr) => {
    if (columnErr) {
      console.error("Error checking users.address column:", columnErr);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }

    const selectSql = "SELECT id, name, email, phone, role, address FROM users WHERE id = ? LIMIT 1";

    db.query(selectSql, [req.user.id], (err, rows) => {
      if (err) {
        console.error("Get profile error:", err);
        return res.status(500).json({ success: false, message: "Lỗi server" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "User không tồn tại" });
      }

      return res.json({ success: true, data: rows[0] });
    });
  });
};

/* Update user profile */
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
      console.error("Error checking users.address column:", columnErr);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }

    const updateSql = "UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?";

    const params = [name, phone, address || null, req.user.id];

    db.query(updateSql, params, (err, result) => {
      if (err) {
        console.error("Lỗi updateProfile:", err);
        return res.status(500).json({ success: false, message: "Lỗi server" });
      }Update profile error:", err);
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

/* Get all users */
exports.getUsers = (req, res) => {
  db.query(
    "SELECT id, name, email, phone, role FROM users",
    (err, result) => {
      if (err) {
        console.error("Get users error:", err);
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

/* Delete user */
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
      console.error("Delete user error:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }

    // Check if user exists
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

/* Update user role */
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
        console.error("Update user role error:", err);
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
}; "Cập nhật role thành công",
      });
    }
  );
};