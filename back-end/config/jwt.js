const getJwtSecret = () => {
  const secret = (process.env.JWT_SECRET || "").trim();

  if (secret.length < 32) {
    return null;
  }

  return secret;
};

module.exports = { getJwtSecret };