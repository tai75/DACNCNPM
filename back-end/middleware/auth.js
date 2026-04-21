const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../config/jwt");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc thiếu Bearer" });
  }

  const secret = getJwtSecret();
  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "JWT_SECRET chưa được cấu hình đúng. Cần tối thiểu 32 ký tự.",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Token không hợp lệ" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Chỉ admin mới có quyền truy cập" });
  }
  next();
};

const staffMiddleware = (req, res, next) => {
  if (req.user.role !== "staff") {
    return res.status(403).json({ success: false, message: "Chỉ nhân viên mới có quyền truy cập" });
  }
  next();
};

const adminOrStaffMiddleware = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({ success: false, message: "Chỉ admin hoặc nhân viên mới có quyền truy cập" });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, staffMiddleware, adminOrStaffMiddleware };