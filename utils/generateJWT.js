const jwt = require("jsonwebtoken");

const createJWT = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRE_SECRET_KEY,
  });

module.exports = createJWT;
