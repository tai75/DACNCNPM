const jwt = require("jsonwebtoken");
<<<<<<< HEAD
const { getJwtSecret } = require("../config/jwt");
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc thiếu Bearer" });
  }

<<<<<<< HEAD
  const secret = getJwtSecret();
  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "JWT_SECRET chưa được cấu hình đúng. Cần tối thiểu 32 ký tự.",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
=======
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ success: false, message: "JWT_SECRET chưa được cấu hình" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};

<<<<<<< HEAD
const staffMiddleware = (req, res, next) => {
  if (req.user.role !== "staff") {
    return res.status(403).json({ success: false, message: "Staff access required" });
  }
  next();
};

const adminOrStaffMiddleware = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({ success: false, message: "Admin or staff access required" });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, staffMiddleware, adminOrStaffMiddleware };
=======
module.exports = { authMiddleware, adminMiddleware };
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
