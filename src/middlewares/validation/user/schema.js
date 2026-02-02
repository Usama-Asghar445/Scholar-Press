const Joi = require("joi");

module.exports = {
  registerUser: Joi.object({
    email: Joi.string().email().trim().required().messages({
      "string.empty": "Email cannot be empty",
      "any.required": "Email is required",
      "string.email": "Email must be valid",
    }),
    password: Joi.string().trim().required().min(8).messages({
      "string.empty": "Password cannot be empty",
      "any.required": "Password is required",
      "string.min": "Password must be at least 6 characters",
    }),
  }),
  verifyUser: Joi.object({
    email: Joi.string().email().required().trim().message({
      "string.empty": "Email cannot be empty",
      "any.required": "Email is required",
      "string.email": "Email must be valid",
    }),
    emailVerificationCode: Joi.string().trim().length(6).required().messages({
      "string.empty": "Email verification code cannot be empty",
      "any.required": "Email verification code is required",
      "string.length": "Email verification code must be exactly 6 digits",
    }),
  }),

  forgetPassword: Joi.object({
    email: Joi.string().email().required().trim().message({
      "string.empty": "Email cannot be empty",
      "any.required": "Email is required",
      "string.email": "Email must be valid",
    }),
  }),
};

// updateSchema: Joi.object({
//   firstName: Joi.String().trim().required(),
//   lastName: Joi.String().trim().required(),
//   role: Joi.String().trim().required(),
//   profileImage: Joi.String().trim().required(),
//   phone: Joi.String().trim().required(),
//   institution: Joi.String().trim().required(),
//   department: Joi.String().trim().required(),
//   designation: Joi.String().trim().required(),
//   country: Joi.String().trim().required(),
//   city: Joi.String().trim().required(),
//   address: Joi.String().trim().required(),
//   specializations: Joi.String().trim().required(),
//   biography: Joi.String().trim().required(),
//   isActive: Joi.boolean().default("false"),
//   isAvailableForReview: Joi.boolean().default("false"),
// }),
