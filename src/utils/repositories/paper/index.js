const mongoose = require("mongoose");
const Paper = require("../../../models/paper.model");

module.exports = {
  createPaper: async (body) => await Paper.create(body),
  findPapers: async () =>
    await Paper.find()
      .sort({ createdAt: -1 })
      .populate("assignedEditor assignedAE assignedReviewers"),
  findPapersByUserId: async (userId, status) => {
    const query = { userId };
    if (status) query.status = status;
    return await Paper.find(query)
      .sort({ createdAt: -1 })
      .populate("assignedEditor assignedAE assignedReviewers");
  },
  findPaperById: async (id) =>
    await Paper.findById(id).populate(
      "assignedEditor assignedAE assignedReviewers",
    ),
  findPapersByQuery: async (query) =>
    await Paper.find(query)
      .sort({ createdAt: -1 })
      .populate("assignedEditor assignedAE assignedReviewers"),
  updatePaperStatus: async (id, status) => {
    return await Paper.findByIdAndUpdate(id, { status }, { new: true });
  },
  assignEditor: async (paperId, editorId) => {
    return await Paper.findByIdAndUpdate(
      paperId,
      {
        assignedEditor: editorId,
        status: "Under Review",
      },
      { new: true },
    );
  },
  assignAE: async (paperId, aeId) => {
    return await Paper.findByIdAndUpdate(
      paperId,
      {
        assignedAE: aeId,
      },
      { new: true },
    );
  },
  assignReviewers: async (paperId, reviewerIds) => {
    return await Paper.findByIdAndUpdate(
      paperId,
      {
        assignedReviewers: reviewerIds,
      },
      { new: true },
    );
  },
  addReviewToHistory: async (paperId, review) => {
    return await Paper.findByIdAndUpdate(
      paperId,
      {
        $push: {
          reviewHistory: {
            reviewerId: review.reviewerId,
            recommendation: review.recommendation,
            comments: review.comments,
            submittedAt: review.createdAt || new Date(),
          },
        },
      },
      { new: true },
    );
  },
  updateFinalDecision: async (paperId, finalDecision, notes, status) => {
    return await Paper.findByIdAndUpdate(
      paperId,
      {
        finalDecision,
        finalDecisionNotes: notes,
        status,
      },
      { new: true },
    );
  },
  updatePaperFiles: async (paperId, files) => {
    return await Paper.findByIdAndUpdate(
      paperId,
      {
        paperFiles: files,
      },
      { new: true },
    );
  },
  updatePaperById: async (paperId, updateData) => {
    return await Paper.findByIdAndUpdate(paperId, updateData, { new: true });
  },
  findPublishedPapers: async () => {
    return await Paper.find({ status: "Published" })
      .sort({ updatedAt: -1 })
      .populate("assignedEditor assignedAE assignedReviewers");
  },
  getPaperStatusCounts: async (userId) => {
    const counts = await Paper.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const result = {
      total: 0,
      submitted: 0,
      accepted: 0,
      underReview: 0,
      rejected: 0,
      minorRevision: 0,
      majorRevision: 0,
      published: 0,
    };

    counts.forEach((item) => {
      const count = item.count;
      result.total += count;
      switch (item._id) {
        case "Submitted":
          result.submitted = count;
          break;
        case "Accepted":
          result.accepted = count;
          break;
        case "Under Review":
          result.underReview = count;
          break;
        case "Rejected":
          result.rejected = count;
          break;
        case "Minor Revision":
          result.minorRevision = count;
          break;
        case "Major Revision":
          result.majorRevision = count;
          break;
        case "Published":
          result.published = count;
          break;
        default:
          break;
      }
    });

    return result;
  },
};
