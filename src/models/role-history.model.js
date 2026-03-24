const mongoose = require("mongoose");

const roleHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    previousRole: {
      type: String,
      enum: ["Author", "Reviewer", "Editor", "Associate Editor"],
      required: true,
    },
    newRole: {
      type: String,
      enum: ["Author", "Reviewer", "Editor", "Associate Editor"],
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    reason: {
      type: String,
    },
    action: {
      type: String,
      enum: ["Promotion", "Demotion", "Manual Update", "Rejection"],
      default: "Promotion",
    },

    demotionDate: {
      type: Date, 
    },
    blockedUntil: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("role_histories", roleHistorySchema);
