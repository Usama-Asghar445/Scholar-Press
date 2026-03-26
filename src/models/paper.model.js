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
        "Under Review",
        "Minor Revision",
        "Major Revision",
        "Accepted",
        "Rejected",
        "Published",
      ],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("papers", paperSchema);
