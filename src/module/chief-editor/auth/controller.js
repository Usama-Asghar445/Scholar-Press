const {
  hashPassword,
  comparePassword,
} = require("../../../utils/bcryptHelper/index");
const services = require("./service");
const userRepo = require("../../../utils/repositories/user/index");
const { sendMail } = require("../../../utils/send-email/index");
const TOKEN = require("../../../utils/token");

module.exports = {
  chiefEditorRegister: async (req, res) => {
    let createdUser = null;
    try {
      const chiefEditorDetail = req.body;
      const chiefEditorExist = await userRepo.existingChief();
      if (chiefEditorExist) {
        return res.status(400).json({
          success: false,
          message: "Chief Editor already exists in the system",
        });
      }
      const isEmail = await userRepo.findUserByEmail(chiefEditorDetail.email);

      if (isEmail) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered",
        });
      }

      chiefEditorDetail.password = await hashPassword(
        chiefEditorDetail.password,
      );
      chiefEditorDetail.emailVerificationCode = services.generateRandomNumber();
      chiefEditorDetail.emailCodeExpires = services.codeExpireTime();
      chiefEditorDetail.isVerified = false;
      chiefEditorDetail.userType = "Editor in Chief";

      createdEditorChief = await userRepo.createUser(chiefEditorDetail);

      try {
        await sendMail(
          chiefEditorDetail.email,
          "verification-code",
          {
            userName: createdEditorChief.firstName,
            code: createdEditorChief.emailVerificationCode,
          },
          "Your Verification Code",
        );
      } catch (mailError) {
        await userRepo.deleteUserById(createdEditorChief._id);
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
        error: error.message,
      });
    }
  },

  chiefEditorLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const chiefEditorExist = await userRepo.findChiefEditorByEmail(email);
      if (!chiefEditorExist) {
        return res.status(401).json({
          success: false,
          message: "Editor in Chief with this email address does not exist.",
        });
      }

      if (!chiefEditorExist.isEmailVerified) {
        return res.status(401).json({
          success: false,
          message: "Please verified your email first.",
        });
      }

      const isPasswordMatch = await comparePassword(
        password,
        chiefEditorExist.password,
      );
      if (!isPasswordMatch)
        return res.status(401).json({
          success: false,
          message: "Incorrect password. Please try again.",
        });

      const token = TOKEN.generateToken({
        userId: chiefEditorExist._id,
        email: chiefEditorExist.email,
        role: chiefEditorExist.role,
      });

      return res.status(200).json({
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
};
