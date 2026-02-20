const TOKEN = require("../../utils/token/index");
const User = require("../../models/user.model")

module.exports = {
  verifyTokenAndAttachUser: async (req, res, next) => {
    
    if (!req.headers.authorization) {
      return res.status(401).json("Unauthorized: No token attached");
    }

    let token = req.headers.authorization.split(" ")[1];
    try {
      req.user = TOKEN.verifyToken(token);
      
      const retrieveUser = await User.findOne({ email: req.user.email });
      if (!retrieveUser) {
        return res.status(404).json({
          success: false,
          message: "User not Found",
        });
      }

      if (retrieveUser.isBlocked) {
        return res.status(405).json({
          success: false,
          message: `Your profile has been blocked due to ${
            retrieveUser?.blockedReason
              ? retrieveUser?.blockedReason
              : "some your bad action "
          } `,
        });
      }

      req.userId = retrieveUser._id;
      req.userEmail = retrieveUser.email;
      req.user = retrieveUser;
      next();
    } catch (error) {
      return res.status(405).json("Invalid token");
    }
  },
};
