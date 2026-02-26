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
  emailValidator: (req, res, next) => {
    const { error, value } = schema.emailExist.validate(req.body, {
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

  resetPasswordValidator: (req, res, next) => {
    const { error, value } = schema.resetPassword.validate(req.body, {
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

  updateUserProfileValidator: (req, res, next) => {
    const { error, value } = schema.updateUserProfile.validate(req.body, {
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

  completeUserProfileValidator: (req, res, next) => {
    const { error, value } = schema.completeUserProfile.validate(req.body, {
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

  loginValidator: (req, res, next) => {
    const { error, value } = schema.login.validate(req.body, {
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

  appliedForRoleValidator: (req, res, next) => {
    const { error, value } = schema.appliedForRole.validate(req.body, {
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
