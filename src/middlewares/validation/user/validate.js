const schema = require("./schema");

module.exports = {
  registerValidator: (req, res, next) => {
    const { error, value } = schema.registerUser.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    req.validatedBody = value;
    next();
  },

  verifyUserValidator: (req, res, next) => {
    const { error, value } = schema.verifyUser.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    req.validatedBody = value;
    next();
  },
  forgetPasswordValidator: (req, res, next) => {
    const { error, value } = schema.forgetPassword.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    req.validatedBody = value;
    next();
  },
};
