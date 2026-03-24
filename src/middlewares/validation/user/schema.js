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

  updateUserProfile: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).optional().messages({
      "string.empty": "First name cannot be empty.",
      "string.min": "First name must be at least 2 characters long.",
      "string.max": "First name must not exceed 50 characters.",
    }),

    lastName: Joi.string().trim().min(2).max(50).optional().messages({
      "string.empty": "Last name cannot be empty.",
      "string.min": "Last name must be at least 2 characters long.",
      "string.max": "Last name must not exceed 50 characters.",
    }),

    // userType: Joi.string()
    //   .valid("Reader", "Author")
    //   .optional()
    //   .messages({
    //     "any.only": "User type must be either Reader or Author.",
    //   }),

    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]{7,20}$/)
      .optional()
      .messages({
        "string.pattern.base": "Please enter a valid phone number.",
      }),

    institution: Joi.string().trim().max(150).optional().messages({
      "string.empty": "Institution cannot be empty.",
      "string.max": "Institution must not exceed 150 characters.",
    }),

    department: Joi.string().trim().max(150).optional().messages({
      "string.empty": "Department cannot be empty.",
      "string.max": "Department must not exceed 150 characters.",
    }),

    designation: Joi.string().trim().max(100).optional().messages({
      "string.empty": "Designation cannot be empty.",
      "string.max": "Designation must not exceed 100 characters.",
    }),

    country: Joi.string().trim().max(100).optional().messages({
      "string.empty": "Country cannot be empty.",
      "string.max": "Country must not exceed 100 characters.",
    }),

    city: Joi.string().trim().max(100).optional().messages({
      "string.empty": "City cannot be empty.",
      "string.max": "City must not exceed 100 characters.",
    }),

    address: Joi.string().trim().max(300).allow("").optional().messages({
      "string.max": "Address must not exceed 300 characters.",
    }),

    specializations: Joi.array()
      .items(
        Joi.string().trim().max(100).required().messages({
          "string.empty": "Specialization cannot be empty.",
          "any.required": "Specialization is required.",
        }),
      )
      .min(1)
      .optional()
      .messages({
        "array.base": "Specializations must be an array.",
        "array.min": "At least one specialization is required.",
      }),

    biography: Joi.string().trim().max(1000).optional().messages({
      "string.empty": "Biography cannot be empty.",
      "string.max": "Biography must not exceed 1000 characters.",
    }),

    // profileImage: Joi.string().uri().optional().messages({
    //   "string.uri": "Profile image must be a valid URL.",
    // }),
  }),

  completeUserProfile: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).optional().messages({
      "string.empty": "First name cannot be empty.",
      "string.min": "First name must be at least 2 characters long.",
      "string.max": "First name must not exceed 50 characters.",
    }),

    lastName: Joi.string().trim().min(2).max(50).optional().messages({
      "string.empty": "Last name cannot be empty.",
      "string.min": "Last name must be at least 2 characters long.",
      "string.max": "Last name must not exceed 50 characters.",
    }),

    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]{7,20}$/)
      .optional()
      .messages({
        "string.pattern.base": "Please enter a valid phone number.",
      }),

    // userType: Joi.string()
    //   .valid("Reader", "Author")
    //   .required()
    //   .messages({
    //     "any.only": "User type must be either Reader or Author.",
    //     "any.required": "User type is required.",
    //   }),

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

    address: Joi.string().trim().max(300).required().messages({
      "string.empty": "Address is required.",
      "any.required": "Address is required.",
    }),

    fieldOfStudy: Joi.string()
      .trim()
      .valid("Biology", "Computer Science", "Physics")
      .required()
      .messages({
        "string.empty": "Field of Study is required.",
        "any.required": "Field of Study is required.",
        "any.only": "Please select a valid field of study.",
      }),

    specializations: Joi.array()
      .items(
        Joi.string().trim().max(100).required().messages({
          "string.empty": "Specialization cannot be empty.",
        }),
      )
      .min(1)
      .required()
      .messages({
        "array.base": "Specializations must be an array.",
        "array.min": "Please select at least one specialization.",
        "any.required": "Specializations are required.",
      }),

    biography: Joi.string().trim().max(1000).required().messages({
      "string.empty": "Biography is required.",
      "any.required": "Biography is required.",
    }),
  }),

  login: Joi.object({
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
  }),

  appliedForRole: Joi.object({
    appliedRole: Joi.string()
      .valid("Reviewer", "Editor", "Associate Editor")
      .required()
      .messages({
        "any.only":
          "You can only apply to be a Reviewer, Editor, or Associate Editor.",
        "any.required": "Please specify the role you are applying for.",
      }),
    degree: Joi.string().trim().required().messages({
      "string.empty": "Degree is required for role application",
    }),
    institution: Joi.string().trim().required().messages({
      "string.empty": "Institution is required",
    }),
    passingYear: Joi.string().trim().required().messages({
      "string.empty": "Passing year is required",
    }),
    major: Joi.string().trim().required().messages({
      "string.empty": "Major/Subject is required",
    }),
  }),
};
