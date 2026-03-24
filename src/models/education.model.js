const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    roleApplicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role_applications",
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    passingYear: {
      type: String,
      required: true,
    },
    major: {
      type: String,
      required: true,
    },
    document: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("educations", educationSchema);
