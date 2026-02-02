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
    specializations: {
      type: String,
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
    emailVerificationCode: {
      type: String,
    },
    emailCodeExpires: {
      type: Date,
    },
    roles: {
      type: [String],
      enum: [
        "Author",
        "Reviewer",
        "Editor",
        "Associate Editor",
        "Editor in Chief",
        "Editorial Board Member",
      ],
      default: ["Author"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("users", userSchema);
