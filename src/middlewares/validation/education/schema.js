const Joi = require("joi");

const educationValidationSchema = Joi.object({
  appliedRole: Joi.string()
    .valid("Reviewer", "Editor", "Associate Editor")
    .required()
    .messages({
      "any.only": "You can only apply to be a Reviewer, Editor, or Associate Editor.",
      "any.required": "Please specify the role you are applying for.",
    }),
  degree: Joi.string()
    .trim()
    .required()
    .messages({
      "any.required": "Degree is required",
      "string.empty": "Degree cannot be empty",
    }),
  institution: Joi.string().trim().required().messages({
    "any.required": "Institution is required",
    "string.empty": "Institution cannot be empty",
  }),
  passingYear: Joi.string().trim().pattern(/^\d{4}$/).required().messages({
    "any.required": "Passing year is required",
    "string.pattern.base": "Passing year must be a 4-digit year",
  }),
  major: Joi.string().trim().required().messages({
    "any.required": "Major/Subject is required",
    "string.empty": "Major/Subject cannot be empty",
  }),
});

module.exports = { educationValidationSchema };