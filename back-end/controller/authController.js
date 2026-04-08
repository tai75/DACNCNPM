const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const db = require("../config/db");
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

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.register = async (req, res) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Dá»¯ liá»‡u khÃ´ng há»£p lá»‡: " + error.details[0].message,
      });
    }

    const { name, email, phone, password } = value;

    // Check if email already exists
    const existingUsers = await query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: "Email Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert new user
    await query(
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone, hashed]
    );

    res.json({ success: true, message: "ÄÄƒng kÃ½ thÃ nh cÃ´ng" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Lá»—i mÃ¡y chá»§" });
  }
};

exports.login = async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Dá»¯ liá»‡u khÃ´ng há»£p lá»‡: " + error.details[0].message,
      });
    }

    const { email, password } = value;

    // Query user from database
    const results = await query("SELECT * FROM users WHERE email = ?", [email]);

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Email hoáº·c máº­t kháº©u khÃ´ng Ä‘Ãºng" });
    }

    const user = results[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email hoáº·c máº­t kháº©u khÃ´ng Ä‘Ãºng" });
    }

    const secret = getJwtSecret();
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET chÆ°a Ä‘Æ°á»£c cáº¥u hÃ¬nh Ä‘Ãºng. Cáº§n tá»‘i thiá»ƒu 32 kÃ½ tá»±.",
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
    res.status(500).json({ success: false, message: "Lá»—i mÃ¡y chá»§" });
  }
};
