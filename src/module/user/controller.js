const userRepo = require("../../utils/repositories/user/index");
const { hashPassword } = require("../../utils/bcryptHelper/index");
const services = require("./service");
const TOKEN = require("../../utils/token");

module.exports = {
  registerUser: async (req, res) => {
    try {
      const userDetail = req.validatedBody;
      const userExist = await userRepo.findUserByEmail(userDetail.email);

      if (userExist) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      userDetail.password = await hashPassword(userDetail.password);

      userDetail.emailVerificationCode = services.generateRandomNumber();

      userDetail.emailCodeExpires = services.codeExpireTime();

      const userData = await userRepo.createUser(userDetail);

      return res.status(201).json({
        success: true,
        message:
          "Registration successful. Please check your email for the verification code.",
      });
    } catch (error) {
      console.error("Register Error:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  verifyUser: async (req, res) => {
    try {
      const { email, emailVerificationCode } = req.validatedBody;

      const userExist = await userRepo.findUserByEmail(email);
      if (!userExist) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      if (userExist.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: "User already verified",
        });
      }
      services.verifyEmailCode(userExist, emailVerificationCode);
      services.clearEmailCode(userExist);

      userExist.isEmailVerified = true;
      userExist.isActive = true;

      await userExist.save();

      return res.status(201).json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      // If error has a statusCode (from AppError), use it. Otherwise, default to 500.
      const statusCode = error.statusCode || 500;

      return res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? "Internal Server Error" : error.message,
        error: error.message,
      });
    }
  },

  // resendVerificationCode: async (req, res) => {
  //   try {
  //     const { email } = req.validatedBody;
  //     const userExist = await userRepo.findUserByEmail(email);
  //     if (!userExist) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "User not found",
  //       });
  //     }

  //     if(email.)
  //   } catch (error) {
  //     // If error has a statusCode (from AppError), use it. Otherwise, default to 500.
  //     const statusCode = error.statusCode || 500;

  //     return res.status(statusCode).json({
  //       success: false,
  //       message: statusCode === 500 ? "Internal Server Error" : error.message,
  //       error: error.message,
  //     });
  //   }
  // },

  forgetPassword: async (req, res) => {
    try {
      const { email } = req.validatedBody;

      const userExist = await userRepo.findUserByEmail(email);
      if (!userExist) {
        return res.status(200).json({
          success: true,
          message:
            "If an account exists with this email, a code has been sent.",
        });
      }

      userExist.emailVerificationCode = services.generateRandomNumber();
      userExist.emailCodeExpires = services.codeExpireTime();

      await userExist.save();
      //send email here
      return res.status(201).json({
        success: true,
        message: "A six-digit code has been sent to your email",
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: "Error processing request",
        error: error.message,
      });
    }
  },

  ResetPassword: async (req, res) => {
    try {
      const { email, emailVerificationCode } = req.validatedBody;
      const userExist = await userRepo.findUserByEmail(email);
      if (!userExist) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }
      services.verifyEmailCode(userExist, emailVerificationCode);
      services.clearEmailCode(userExist);
      await userExist.save()
      //usama code bi db ma lena hy or is ko has bi kerna hy ok
      const token = TOKEN.generateToken(
        {
          userId: userExist._id,
          role: userExist.roles,
        },
        "123GH",
      );

      return res.status(201).json({
        success: true,
        token: token,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: "Error processing request",
        error: error.message,
      });
    }
  },

  loginUser: async (req, res) => {
    try {
    } catch (error) {}
  },
};
