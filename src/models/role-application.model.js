const mongoose = require("mongoose");

const roleApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    appliedRole: {
      type: String,
      enum: ["Reader", "Author", "Reviewer", "Editor", "Associate Editor", "Editor in Chief"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    chiefRejectedNote: { type: String }, // Why was it rejected?
    educationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "educations",
    },
    appliedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("role_applications", roleApplicationSchema);
