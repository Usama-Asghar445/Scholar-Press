const Paper = require("../../../models/paper.model");

module.exports = {
  createPaper: async (body) => await Paper.create(body),
  findPapers: async () => await Paper.find().sort({ createdAt: -1 }),
  findPapersByUserId: async (userId, status) => {
    const query = { userId };
    if (status) query.status = status;
    return await Paper.find(query).sort({ createdAt: -1 });
  },
  getPaperStatusCounts : async(userId) => {
    const counts = await Paper.aggregate([
        { $match: { userId: new (require('mongoose').Types.ObjectId)(userId) } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const result = {
        total: 0,
        submitted: 0,
        accepted: 0,
        underReview: 0,
        rejected: 0,
        minorRevision: 0,
        majorRevision: 0
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
            default: break;
        }
    });

    return result;
  }
};
