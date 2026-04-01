const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const db = require("../config/db");

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.register = async (req, res) => {
  // Validate input
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ: " + error.details[0].message,
    });
  }

  const { name, email, phone, password } = value;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
      }

      if (result.length > 0) {
        return res.status(400).json({ success: false, message: "Email đã được sử dụng" });
      }

      let hashed;
      try {
        hashed = await bcrypt.hash(password, 10);
      } catch (hashError) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
      }

      db.query(
        "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
        [name, email, phone, hashed],
        (err) => {
          if (err) return res.status(500).json({ success: false, message: "Lỗi máy chủ" });

          res.json({ success: true, message: "Đăng ký thành công" });
        }
      );
    }
  );
};

exports.login = (req, res) => {
  // Validate input
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ: " + error.details[0].message,
    });
  }

  const { email, password } = value;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
      }

      if (result.length === 0) {
        return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
      }

      const user = result[0];
      let isMatch;
      try {
        isMatch = await bcrypt.compare(password, user.password);
      } catch (compareError) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
      }

      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
      }

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ success: false, message: "JWT_SECRET chưa được cấu hình" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role || "user" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
        },
      });
    }
  );
};