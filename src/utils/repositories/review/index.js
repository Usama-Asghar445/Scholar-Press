const Review = require("../../../models/review.model");

module.exports = {
  createReview: async (body) => await Review.create(body),
  findReviewsByPaperId: async (paperId) =>
    await Review.find({ paperId }).sort({ createdAt: -1 }),
  findReviewByReviewerAndPaper: async (reviewerId, paperId) =>
    await Review.findOne({ reviewerId, paperId }),
  findReviewsByReviewer: async (reviewerId) =>
    await Review.find({ reviewerId }).sort({ createdAt: -1 }),
};
