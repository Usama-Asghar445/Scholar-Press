const jwt = require("jsonwebtoken");
const KEY = "123GH"

module.exports = {
  verifyToken: (token, key) => jwt.verify(token, key),

  generateToken: (data, key, expiry = "7d") =>
    jwt.sign(data, key, { expiresIn: expiry }),

  decodeToken: (token) => jwt.decode(token),
};
