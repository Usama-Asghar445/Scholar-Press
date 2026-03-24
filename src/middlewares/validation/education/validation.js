const schema = require("./schema");

module.exports = {
  appliedRoleValidator: (req, res, next) => {
    const { error, value } = schema.educationValidationSchema.validate(
      req.body,
      {
        abortEarly: false,
      },
    );

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
