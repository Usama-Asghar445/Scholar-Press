const Joi = require("joi");
const { ResetPassword } = require("../../../module/user/controller");

module.exports = {
  registerUser: Joi.object({
    firstName: Joi.string().trim().required().messages({
      "string.empty": "First name  cannot be empty",
      "any.required": "First name  is required",
    }),
    lastName: Joi.string().trim().required().messages({
      "string.empty": "Last name  cannot be empty",
      "any.required": "Last name  is required",
    }),
    phone: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must be 10-15 digits",
        "string.empty": "Phone number cannot be empty",
        "any.required": "Phone number is required",
      }),
    email: Joi.string().email().trim().required().messages({
      "string.empty": "Email cannot be empty",
      "any.required": "Email is required",
      "string.email": "Email must be valid",
    }),
    password: Joi.string().trim().required().min(8).messages({
      "string.empty": "Password cannot be empty",
      "any.required": "Password is required",
      "string.min": "Password must be at least 8 characters",
    }),
    agreed: Joi.boolean(),
  }),

  verifyUser: Joi.object({
    email: Joi.string().email().required().trim().messages({
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

  emailExist: Joi.object({
    email: Joi.string().email().required().trim().messages({
      "string.empty": "Email cannot be empty",
      "any.required": "Email is required",
      "string.email": "Email must be valid",
    }),
  }),

  resetPassword: Joi.object({
    email: Joi.string().email().required().trim().messages({
      "string.empty": "Email cannot be empty",
      "any.required": "Email is required",
      "string.email": "Email must be valid",
    }),
    emailVerificationCode: Joi.string().trim().length(6).required().messages({
      "string.empty": "Email verification code cannot be empty",
      "any.required": "Email verification code is required",
      "string.length": "Email verification code must be exactly 6 digits",
    }),
    newPassword: Joi.string().trim().required().min(8).messages({
      "string.empty": "Password cannot be empty",
      "any.required": "Password is required",
      "string.min": "Password must be at least 8 characters",
    }),
  }),

  updateUser: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required().messages({
      "string.empty": "First name is required.",
      "string.min": "First name must be at least 2 characters long.",
      "string.max": "First name must not exceed 50 characters.",
      "any.required": "First name is required.",
    }),

    lastName: Joi.string().trim().min(2).max(50).required().messages({
      "string.empty": "Last name is required.",
      "string.min": "Last name must be at least 2 characters long.",
      "string.max": "Last name must not exceed 50 characters.",
      "any.required": "Last name is required.",
    }),

    // email: Joi.string()
    //   .email()
    //   .trim()
    //   .required()
    //   .messages({
    //     "string.email": "Please enter a valid email address.",
    //     "string.empty": "Email address is required.",
    //     "any.required": "Email address is required.",
    //   }),

    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]{7,20}$/)
      .allow("")
      .messages({
        "string.pattern.base": "Please enter a valid phone number.",
      }),

    institution: Joi.string().trim().max(150).required().messages({
      "string.empty": "Institution name is required.",
      "any.required": "Institution name is required.",
    }),

    department: Joi.string().trim().max(150).required().messages({
      "string.empty": "Department is required.",
      "any.required": "Department is required.",
    }),

    designation: Joi.string().trim().max(100).required().messages({
      "string.empty": "Designation is required.",
      "any.required": "Designation is required.",
    }),

    country: Joi.string().trim().max(100).required().messages({
      "string.empty": "Country is required.",
      "any.required": "Country is required.",
    }),

    city: Joi.string().trim().max(100).required().messages({
      "string.empty": "City is required.",
      "any.required": "City is required.",
    }),

    address: Joi.string().trim().max(300).allow("").messages({
      "string.max": "Address must not exceed 300 characters.",
    }),

    specializations: Joi.string().trim().max(300).required().messages({
      "string.empty": "Specializations are required.",
      "any.required": "Specializations are required.",
    }),

    biography: Joi.string().trim().max(1000).required().messages({
      "string.empty": "Biography is required.",
      "any.required": "Biography is required.",
    }),

    profileImage: Joi.string().uri().allow("").messages({
      "string.uri": "Profile image must be a valid URL.",
    }),
  }),
};
