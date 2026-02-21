const bcrypt = require("bcrypt");

const SALT_ROUND = 10;
module.exports = {
  hashPassword: async (password) => {
   return bcrypt.hash(password, SALT_ROUND);
  },

comparePassword: async (password, hashedPassword) => {
   return bcrypt.compare(password, hashedPassword);
},
};
