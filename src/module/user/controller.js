const userRepo = require("../../utils/repositories/user/index");
const {
  hashPassword,
  comparePassword,
} = require("../../utils/bcryptHelper/index");
const services = require("./service");
const TOKEN = require("../../utils/token");
const user = require("../../utils/repositories/user/index");
const { sendMail } = require("../../utils/send-email/index");

module.exports = {
  registerUser: async (req, res) => {
    let createdUser = null;
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
      userDetail.isVerified = false;

      createdUser = await userRepo.createUser(userDetail);

      try {
        await sendMail(
          userDetail.email,
          "verification-code",
          {
            userName: userDetail.firstName,
            code: userDetail.emailVerificationCode,
          },
          "Your Verification Code",
        );
      } catch (mailError) {
        await userRepo.deleteUserById(createdUser._id);
        console.error("Mail failed, user deleted:", mailError);
        return res.status(503).json({
          success: false,
          message: "Email service unavailable. Please try again later.",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Registration successful. Please check your email.",
      });
    } catch (error) {
      console.error("Register Error:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: "Internal Server Error",
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

      const token = TOKEN.generateToken({
        userId: userExist._id,
        role: userExist.roles,
      });

      await userExist.save();

      return res.status(201).json({
        success: true,
        token: token,
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

  resendVerificationCode: async (req, res) => {
    try {
      const { email } = req.body;
      const userExist = await userRepo.findUserByEmail(email);
      if (!userExist) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      userExist.emailVerificationCode = services.generateRandomNumber();
      userExist.emailCodeExpires = services.codeExpireTime();
      await sendMail(
        userExist.email,
        "verification-code",
        {
          userName: userExist.firstName,
          code: userExist.emailVerificationCode,
        },
        "Your Verification Code",
      );
      await userExist.save();

      return res.status(201).json({
        success: true,
        message: "Code resend successfully.",
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

      await sendMail(
        userExist.email,
        "forgot-password",
        {
          email: userExist.email,
          userName: userExist.firstName,
          code: userExist.emailVerificationCode,
        },
        "Your Verification Code for Password Reset",
      );
      await userExist.save();

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
      const { email, emailVerificationCode, newPassword } = req.validatedBody;
      const userExist = await userRepo.findUserByEmail(email);
      if (!userExist) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }
      services.verifyEmailCode(userExist, emailVerificationCode);
      services.clearEmailCode(userExist);
      userExist.password = await hashPassword(newPassword);
      await userExist.save();
      const token = TOKEN.generateToken({
        email: userExist.email,
        userId: userExist._id,
        role: userExist.roles,
      });

      return res.status(201).json({
        success: true,
        message: "Password reset successfully",
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

  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userExist = await userRepo.findUserByEmail(email);
      if (!userExist) {
        return res.status(401).json({
          success: false,
          message: "No account found with this email address.",
        });
      }

      if (!userExist.isEmailVerified) {
        return res.status(401).json({
          success: false,
          message: "Please verified your email first.",
        });
      }

      const userPassword = await comparePassword(userExist.password, password);
      if (!userPassword)
        return res.status(401).json({
          success: false,
          message: "Incorrect password. Please try again.",
        });

      const token = TOKEN.generateToken({
        userId: userExist._id,
        email: userExist.email,
        role: userExist.roles,
      });

      return res.status(201).json({
        success: true,
        message: "Login successful.",
        token: token,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  },

  getUser: async (req, res) => {
    try {
      const email = req.userEmail;
      console.log(email);

      const userExist = await userRepo.findUserByEmail(email);
      if (!userExist) {
        return res.status(401).json({
          success: false,
          message: "No account found with this email address.",
        });
      }
      return res.status(201).json({
        success: true,
        message: "User get successfully",
        data: userExist,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  },

  completeUserProfile: async (req, res) => {
    try {
      const email = req.userEmail;
      const data = req.validatedBody;

      const userExist = await userRepo.findUserByEmail(email);

      if (!userExist) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (userExist.isProfileComplete) {
        return res.status(400).json({
          success: false,
          message: "Profile already completed. You can only update it now.",
        });
      }

      data.isProfileComplete = true;
      data.profileCompletedAt = new Date();

      const updatedUser = await userRepo.updateByEmail(email, data);

      return res.status(200).json({
        success: true,
        message: "Profile completed successfully.",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  updateUserProfile: async (req, res) => {
    try {
      const email = req.userEmail;
      const data = req.validatedBody;

      const userExist = await userRepo.findUserByEmail(email);

      if (!userExist) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (!userExist.isProfileComplete) {
        return res.status(400).json({
          success: false,
          message: "Please complete your profile first.",
        });
      }

      const updatedUser = await userRepo.updateByEmail(email, data);

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
};
