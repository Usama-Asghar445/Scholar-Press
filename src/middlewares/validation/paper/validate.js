const schema = require("./schema");

const parseMaybeJson = (value) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
};

const normalizeFormData = (body) => {
  const parsedBody = { ...body };
  parsedBody.paperDetails = parseMaybeJson(parsedBody.paperDetails);
  parsedBody.authors = parseMaybeJson(parsedBody.authors);
  if (typeof parsedBody.conflictOfInterest === "string") {
    parsedBody.conflictOfInterest = parsedBody.conflictOfInterest === "true";
  }
  return parsedBody;
};

module.exports = {
  paperSubmission: (req, res, next) => {
    const body = normalizeFormData(req.body);
    const { error, value } = schema.paperSubmissionSchema.validate(body, {
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
