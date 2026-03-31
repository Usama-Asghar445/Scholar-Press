const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    paperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "papers",
      required: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    recommendation: {
      type: String,
      enum: ["Accept", "Minor Revision", "Major Revision", "Reject"],
      required: true,
    },
    comments: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Submitted"],
      default: "Submitted",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("reviews", reviewSchema);
