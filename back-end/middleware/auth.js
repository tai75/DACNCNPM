const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../config/jwt");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Token khÃ´ng há»£p lá»‡ hoáº·c thiáº¿u Bearer" });
  }

  const secret = getJwtSecret();
  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "JWT_SECRET chÆ°a Ä‘Æ°á»£c cáº¥u hÃ¬nh Ä‘Ãºng. Cáº§n tá»‘i thiá»ƒu 32 kÃ½ tá»±.",
    });
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
