const schema = require("./schema");

module.exports = {
  acceptRoleValidator: (req, res, next) => {
    const { error, value } = schema.acceptRoleStatus.validate(req.body, {
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
}