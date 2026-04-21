const createRateLimiter = ({ windowMs, max, message }) => {
  const hitsByKey = new Map();

  return (req, res, next) => {
    const key = `${req.ip}:${req.originalUrl}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    const recentHits = (hitsByKey.get(key) || []).filter((timestamp) => timestamp > windowStart);

    if (recentHits.length >= max) {
      return res.status(429).json({
        success: false,
        message: message || "Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau.",
      });
    }

    recentHits.push(now);
    hitsByKey.set(key, recentHits);
    next();
  };
};

module.exports = { createRateLimiter };
