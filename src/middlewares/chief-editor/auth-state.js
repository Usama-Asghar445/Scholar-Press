require("dotenv").config();

const CIE_KEY = process.env.CIE_REGISTRATION_KEY;

module.exports = {
  verifyChiefEditorKey: async (req, res, next) => {
    try {
      const chiefEditorKey = req.headers.authorization;

      if (!chiefEditorKey) {
        return res.status(401).json({
          success: false,
          message: "Secret key is required",
        });
      }

      if (chiefEditorKey !== CIE_KEY) {
        return res.status(403).json({
          success: false,
          message: "Invalid secret key",
        });
      }

      next();

    } catch (error) {
      console.error("Chief Editor Key Error:", error);

      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
};