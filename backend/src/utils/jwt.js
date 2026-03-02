const jwt = require('jsonwebtoken');

const signAccessToken = (user) => {
  const payload = { id: user._id.toString(), roles: user.roles };
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' });
};

const signRefreshToken = (user) => {
  const payload = { id: user._id.toString() };
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = { signAccessToken, signRefreshToken, verifyRefreshToken };
