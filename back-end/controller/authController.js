const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const db = require("../config/db");
<<<<<<< HEAD
const { getJwtSecret } = require("../config/jwt");

// Helper function to promisify database queries
const query = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
<<<<<<< HEAD
  password: Joi.string().min(8).required(),
=======
  password: Joi.string().min(6).required(),
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.register = async (req, res) => {
<<<<<<< HEAD
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ: " + error.details[0].message,
      });
    }

    const { name, email, phone, password } = value;

    // Check if email already exists
    const existingUsers = await query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: "Email đã được sử dụng" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert new user
    await query(
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone, hashed]
    );

    res.json({ success: true, message: "Đăng ký thành công" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

exports.login = async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ: " + error.details[0].message,
      });
    }

    const { email, password } = value;

    // Query user from database
    const results = await query("SELECT * FROM users WHERE email = ?", [email]);

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }

    const user = results[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }

    const secret = getJwtSecret();
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET chưa được cấu hình đúng. Cần tối thiểu 32 ký tự.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role || "user" },
      secret,
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
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
=======
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
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
};