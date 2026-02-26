const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    phone: {
      type: String,
    },
    institution: {
      type: String,
    },
    department: {
      type: String,
    },
    designation: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    fieldOfStudy: {
      type: String,
      enum: ["Biology", "Computer Science", "Physics"],
    },
    specializations: {
      type: [String],
      default: [],
    },
    biography: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    profileCompletedAt: {
      type: Date,
      default: null,
    },
    emailVerificationCode: {
      type: String,
    },

    emailCodeExpires: {
      type: Date,
    },
    userType: {
      type: String,
      enum: [
        "Reader",
        "Author",
        "Reviewer",
        "Editor",
        "Associate Editor",
        "Editor in Chief",
      ],
      default: "Author",
    },
    appliedRole: {
      type: String,
      enum: ["Reviewer", "Editor", "Associate Editor", null],
      default: null,
    },
    applicationStatus: {
      type: String,
      enum: ["None", "Pending", "Approved", "Rejected"],
      default: "None",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("users", userSchema);

// const qualificationSchema = new mongoose.Schema({
//   degree: { type: String, required: true }, // e.g., PhD, MSc, MD
//   field: { type: String, required: true },  // e.g., Computer Science
//   institution: { type: String },
//   year: { type: Number }
// });
