const Joi = require("joi");

const authorSchema = Joi.object({
  fullName: Joi.string().min(2).required().label("Author Full Name").messages({
    "any.required": "{#label} is required",
    "string.min": "{#label} must be at least 2 characters",
  }),
  email: Joi.string().email().required().label("Author Email").messages({
    "any.required": "{#label} is required",
    "string.email": "{#label} must be a valid email",
  }),
  country: Joi.string()
    .required()
    .label("Author Country")
    .messages({ "any.required": "{#label} is required" }),
  affiliation: Joi.string()
    .required()
    .label("Author Affiliation")
    .messages({ "any.required": "{#label} is required" }),
});

// Paper details schema
const paperDetailsSchema = Joi.object({
  title: Joi.string().min(3).required().label("Paper Title"),
  type: Joi.string().required().label("Paper Type"),
  runningTitle: Joi.string().required().label("Running Title"),
  subject: Joi.string().required().label("Paper Subject"),
  abstract: Joi.string().required().label("Abstract"),
  correspondingName: Joi.string().required().label("Corresponding Author Name"),
  correspondingEmail: Joi.string()
    .email()
    .required()
    .label("Corresponding Author Email"),
  keywords: Joi.array()
    .items(Joi.string().min(1).label("Keyword"))
    .min(1)
    .required()
    .label("Keywords")
    .messages({
      "any.required": "{#label} is required",
      "array.min": "At least one keyword is required",
    }),
});

const paperSubmissionSchema = Joi.object({
  paperDetails: paperDetailsSchema.required().label("Paper Details"),
  areaOfResearch: Joi.string()
    .valid("Computer Science", "Physics", "Biology")
    .required()
    .label("Area of Research"),
  authors: Joi.array()
    .items(authorSchema)
    .min(1)
    .required()
    .label("Authors")
    .messages({
      "any.required": "{#label} are required",
      "array.min": "At least one author is required",
    }),
  conflictOfInterest: Joi.boolean().required().label("Conflict of Interest"),
  conflictDescription: Joi.when("conflictOfInterest", {
    is: true,
    then: Joi.string().min(5).required().label("Conflict Description"),
    otherwise: Joi.string().allow("").optional(),
  }),
  dataAvailability: Joi.string().required().label("Data Availability"),
  areaOfResearch: Joi.string()
    .valid("Computer Science", "Physics", "Biology")
    .required()
    .label("Area of Research"),
});

module.exports = { paperSubmissionSchema };
