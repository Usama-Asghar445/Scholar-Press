const AppError = require("../../../common/error/app-error")
const userRepo = require("../../../utils/repositories/user/index");

module.exports = {
  generateRandomNumber: () => {
    return Math.floor(100000 + Math.random() * 900000);
  },

  codeExpireTime :()=>{
    return Date.now() + 10 * 60 * 1000;
  },

  
 verifyEmailCode : (user, code) => {

  if (user.emailVerificationCode !== code) {
    throw new AppError("Invalid verification code", 400);
  }

  if (user.emailCodeExpires && Date.now() > user.emailCodeExpires) {
    throw new AppError("Verification code has expired", 400);
  }

  return true;
},

  clearEmailCode: (user) => {
    user.emailVerificationCode = null;
    user.emailCodeExpires = null;
  },
};
