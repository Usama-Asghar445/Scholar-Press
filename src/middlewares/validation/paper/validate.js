const schema = require("./schema");

module.exports = {
  paperSubmission: (req, res, next) => {
    console.log(req.body);
    
    const { error, value } = schema.paperSubmissionSchema.validate(req.body, {
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