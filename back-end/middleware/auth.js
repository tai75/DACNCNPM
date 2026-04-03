const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc thiếu Bearer" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ success: false, message: "JWT_SECRET chưa được cấu hình" });
  }

  const secret = process.env.JWT_SECRET;
  const strongSecretPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{32,}$/;
  if (!strongSecretPattern.test(secret)) {
    return res.status(500).json({ success: false, message: "JWT_SECRET quá yếu hoặc không đủ 32 ký tự" });
  }

  try {
    const decoded = jwt.verify(token, secret);
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