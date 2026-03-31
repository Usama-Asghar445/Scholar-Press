const reviewRepo = require("../../utils/repositories/review/index");
const paperRepo = require("../../utils/repositories/paper/index");

module.exports = {
  submitReview: async (req, res) => {
    try {
      const reviewerId = req.userId;
      const { paperId, recommendation, comments } = req.body;

      if (!paperId || !recommendation || !comments) {
        return res.status(400).json({
          success: false,
          message: "paperId, recommendation and comments are required.",
        });
      }

      const review = await reviewRepo.createReview({
        paperId,
        reviewerId,
        recommendation,
        comments,
      });

      await paperRepo.addReviewToHistory(paperId, review);

      return res.status(201).json({
        success: true,
        message: "Review submitted successfully.",
        data: review,
      });
    } catch (error) {
      console.error("Submit Review Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to submit review.",
        error: error.message,
      });
    }
  },

  getPaperReviews: async (req, res) => {
    try {
      const { paperId } = req.params;
      const reviews = await reviewRepo.findReviewsByPaperId(paperId);
      return res.status(200).json({
        success: true,
        message: "Reviews loaded successfully.",
        data: reviews,
      });
    } catch (error) {
      console.error("Get Paper Reviews Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to load reviews.",
        error: error.message,
      });
    }
  },

  getMyReviews: async (req, res) => {
    try {
      const reviewerId = req.userId;
      const reviews = await reviewRepo.findReviewsByReviewer(reviewerId);
      return res.status(200).json({
        success: true,
        message: "Your reviews loaded successfully.",
        data: reviews,
      });
    } catch (error) {
      console.error("Get My Reviews Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to load your reviews.",
        error: error.message,
      });
    }
  },
};
