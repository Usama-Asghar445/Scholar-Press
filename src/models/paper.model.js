const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

const authorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  affiliation: { type: String, required: true },
});

const paperDetailsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  runningTitle: { type: String, required: true },
  field: { type: String, required: true },
  subField: { type: String, default: "" },
  subject: { type: String, required: true },
  abstract: { type: String, required: true },
  correspondingName: { type: String, required: true },
  correspondingEmail: { type: String, required: true },
  keywords: [
    {
      type: String,
      lowercase: true,
      trim: true,
    },
  ],
});

const paperSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    paperDetails: { type: paperDetailsSchema, required: true },

    authors: { type: [authorSchema], r
    areaOfResearch: {
      type: String,
      enum: ["Computer Science", "Physics", "Biology"],
    },equired: true },

    conflictOfInterest: { type: Boolean, d    conflictOfInterest: { type: Boolean, default: false },

    conflictDescription: { type: String, default: "" },

    dataAvailability: { type: String, required: true },

    },
    assignedAE: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    assignedReviewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    reviewHistory: [
      {
        reviewerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        recommendation: {
          type: String,
          enum: ["Accept", "Minor Revision", "Major Revision", "Reject"],
        },
        comments: String,
        submittedAt: Date,
      },
    ],
    finalDecision: {
      type: String,
      enum: ["Accepted", "Rejected", "Revision Requested", "Pending"],
      default: "Pending",
    },
    finalDecisionNotes: {
      type: String,
      default: "",
    },
    paperFiles: {
      paper: { type: fileSchema, required: true },
      figuresDetails: { type: [fileSchema], default: [] },
      supplementaryDetails: { type: [fileSchema], default: [] },
    },

    status: {
      type: String,
      enum: [
        "Submitted",
        "Under Review",
        "Minor Revision",
        "Major Revision",
        "Accepted",
        "Rejected",
        "Published",
      ],
      default: "Submitted",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("papers", paperSchema);
