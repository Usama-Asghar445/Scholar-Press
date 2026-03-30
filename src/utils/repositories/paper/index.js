const Paper = require("../../../models/paper.model");

module.exports = {
  createPaper: async (body) => await Paper.create(body),
  findPapers: async (filter = {}) => await Paper.find(filter).populate("userId", "firstName lastName email").sort({ createdAt: -1 }),
  findPapersByUserId: async (userId) => {
    return await Paper.find({ userId }).sort({ createdAt: -1 });
  },
  updatePaperStatus: async (id, status) => {
    return await Paper.findByIdAndUpdate(id, { status }, { new: true });
  },
  findPublishedPapers: async () => {
    return await Paper.find({ status: "Published" }).sort({ updatedAt: -1 });
  },
  getPaperStatusCounts : async(userId) => {
  getPaperStatusCounts: async (userId, role, fieldOfStudy) => {
    let match = {};
    if (role === "Author") {
      match.userId = new (require('mongoose').Types.ObjectId)(userId);
    } else if (role === "Editor") { // Handling Editor
      match.$or = [
        { handlingEditorId: new (require('mongoose').Types.ObjectId)(userId) },
        { "paperDetails.subject": fieldOfStudy }
      ];
    } else if (role === "Associate Editor") {
      match.associateEditorId = new (require('mongoose').Types.ObjectId)(userId);
    } else if (role === "Reviewer") {
      match["reviewers.reviewerId"] = new (require('mongoose').Types.ObjectId)(userId);
    }
    // EIC sees all, so match remains empty {}

    const counts = await Paper.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const result = {
        total: 0,
        submitted: 0,
        accepted: 0,
        underReview: 0,
        rejected: 0,
        minorRevision: 0,
        majorRevision: 0,
        published: 0
    };

    counts.forEach(item => {
        const count = item.count;
        result.total += count;
        switch(item._id) {
            case "Submitted": result.submitted = count; break;
            case "Accepted": result.accepted = count; break;
            case "Under Review": result.underReview = count; break;
            case "Rejected": result.rejected = count; break;
            case "Minor Revision": result.minorRevision = count; break;
            case "Major Revision": result.majorRevision = count; break;
            case "Published": result.published = count; break;
            default: break;
        }
      total: 0,
      submitted: 0,
      assignedToEditor: 0,
      assignedToAssociateEditor: 0,
      underReview: 0,
      reviewsCompleted: 0,
      minorRevision: 0,
      majorRevision: 0,
      revisedSubmission: 0,
      accepted: 0,
      rejected: 0,
      published: 0
    };

    counts.forEach(item => {
      const count = item.count;
      result.total += count;
      switch (item._id) {
        case "Submitted": result.submitted = count; break;
        case "Assigned to Editor": result.assignedToEditor = count; break;
        case "Assigned to Associate Editor": result.assignedToAssociateEditor = count; break;
        case "Under Review": result.underReview = count; break;
        case "Reviews Completed": result.reviewsCompleted = count; break;
        case "Minor Revision": result.minorRevision = count; break;
        case "Major Revision": result.majorRevision = count; break;
        case "Revised Submission": result.revisedSubmission = count; break;
        case "Accepted": result.accepted = count; break;
        case "Rejected": result.rejected = count; break;
        case "Published": result.published = count; break;
        default: break;
      }
    });

    return result;
  }
};
