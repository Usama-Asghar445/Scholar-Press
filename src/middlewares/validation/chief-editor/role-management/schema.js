const Joi = require("joi");

const acceptRoleStatus = Joi.object({
  userId: Joi.string().hex().length(24).required().messages({
    "string.length": "Invalid User ID format.",
    "any.required": "User ID is required to process the application.",
  }),

  role: Joi.string()
    .valid("Reviewer", "Editor", "Associate Editor")
    .required()
    .messages({
      "any.only": "Invalid role selection.",
    }),

  action: Joi.string().valid("Approved", "Rejected").required().messages({
    "any.only": "Action must be either 'Approved' or 'Rejected'.",
  }),
 chiefNote: Joi.string().allow("").optional().messages({
    "string.base": "Chief note must be a string.",
  }),
});


module.exports = {acceptRoleStatus}
