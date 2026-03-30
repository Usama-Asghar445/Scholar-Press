const { string } = require("joi");
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
    // journalsId:{ type: mongoose.Schema.Types.ObjectId, ref: "Journals", required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    paperDetails: { type: paperDetailsSchema, required: true },

    authors: { type: [authorSchema], required: true },

    conflictOfInterest: { type: Boolean, default:false },

    conflictDescription: { type: String, default: "" },

    dataAvailability: { type: String, required: true },

    paperFiles: {
      paper: { type: fileSchema, required: true },
      figuresDetails: { type: [fileSchema], default: [] },
      supplementaryDetails: { type: [fileSchema], default: [] },
    },

    status: {
      type: String,
      enum: [
        "Submitted",
        "Assigned to Editor",
        "Assigned to Associate Editor",
        "Under Review",
        "Reviews Completed",
        "Minor Revision",
        "Major Revision",
        "Revised Submission",
        "Accepted",
        "Rejected",
        "Published",
      ],
      default: "Submitted",
    },
    handlingEditorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    associateEditorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    reviewers: [
      {
        reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        invitationStatus: {
          type: String,
          enum: ["Pending", "Accepted", "Declined"],
          default: "Pending",
        },
        reviewStatus: {
          type: String,
          enum: ["Pending", "Completed"],
          default: "Pending",
        },
        decision: {
          type: String,
          enum: ["Accept", "Minor Revision", "Major Revision", "Reject"],
          default: null,
        },
        comments: { type: String, default: "" },
        assignedAt: { type: Date, default: Date.now },
        respondedAt: { type: Date },
        completedAt: { type: Date },
      },
    ],
    workflowHistory: [
      {
        action: { type: String, required: true },
        actorId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        previousStatus: { type: String },
        newStatus: { type: String },
        comments: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("papers", paperSchema);
