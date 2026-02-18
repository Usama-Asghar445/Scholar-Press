const jwt = require("jsonwebtoken");
require("dotenv").config()
const KEY = process.env.SECRET_KEY

console.log("key::",KEY)

module.exports = {
  verifyToken: (token, key=KEY) => jwt.verify(token, key),

  generateToken: (data, key=KEY, expiry = "7d") =>
    jwt.sign(data, key, { expiresIn: expiry }),

  decodeToken: (token) => jwt.decode(token),
};
