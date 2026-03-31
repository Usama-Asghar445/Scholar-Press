const paperRepo = require("../../../utils/repositories/paper/index");
const reviewRepo = require("../../../utils/repositories/review/index");

module.exports = {
  getPapersByEID: async (req, res) => {
    try {
      const papers = await paperRepo.findPapers();

      if (!papers || papers.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No papers found",
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: "Papers fetched successfully",
        count: papers.length,
        data: papers,
      });
    } catch (error) {
      console.error("Get Papers  Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch papers",
        error: error.message,
      });
    }
  },

  assignFieldEditor: async (req, res) => {
    try {
      const { paperId, editorId } = req.body;
      if (!paperId || !editorId) {
        return res.status(400).json({
          success: false,
          message: "paperId and editorId are required",
        });
      }

      const updatedPaper = await paperRepo.assignEditor(paperId, editorId);
      if (!updatedPaper) {
        return res.status(404).json({
          success: false,
          message: "Paper not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Field editor assigned successfully",
        data: updatedPaper,
      });
    } catch (error) {
      console.error("Assign Field Editor Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to assign field editor",
        error: error.message,
      });
    }
  },

  assignAssociateEditor: async (req, res) => {
    try {
      const { paperId, aeId } = req.body;
      if (!paperId || !aeId) {
        return res.status(400).json({
          success: false,
          message: "paperId and aeId are required",
        });
      }

      const updatedPaper = await paperRepo.assignAE(paperId, aeId);
      if (!updatedPaper) {
        return res.status(404).json({
          success: false,
          message: "Paper not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Associate editor assigned successfully",
        data: updatedPaper,
      });
    } catch (error) {
      console.error("Assign Associate Editor Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to assign associate editor",
        error: error.message,
      });
    }
  },

  assignReviewers: async (req, res) => {
    try {
      const { paperId, reviewerIds } = req.body;
      if (!paperId || !Array.isArray(reviewerIds) || reviewerIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "paperId and at least one reviewerId are required",
        });
      }

      const updatedPaper = await paperRepo.assignReviewers(
        paperId,
        reviewerIds,
      );
      if (!updatedPaper) {
        return res.status(404).json({
          success: false,
          message: "Paper not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Reviewers assigned successfully",
        data: updatedPaper,
      });
    } catch (error) {
      console.error("Assign Reviewers Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to assign reviewers",
        error: error.message,
      });
    }
  },

  getReviewSummary: async (req, res) => {
    try {
      const { paperId } = req.params;
      const reviews = await reviewRepo.findReviewsByPaperId(paperId);
      const paper = await paperRepo.findPaperById(paperId);

      if (!paper) {
        return res.status(404).json({
          success: false,
          message: "Paper not found",
        });
      }

      const summary = reviews.reduce(
        (acc, review) => {
          acc.total += 1;
          if (review.recommendation === "Accept") acc.accepted += 1;
          if (review.recommendation === "Minor Revision")
            acc.minorRevision += 1;
          if (review.recommendation === "Major Revision")
            acc.majorRevision += 1;
          if (review.recommendation === "Reject") acc.rejected += 1;
          return acc;
        },
        {
          total: 0,
          accepted: 0,
          minorRevision: 0,
          majorRevision: 0,
          rejected: 0,
        },
      );

      return res.status(200).json({
        success: true,
        message: "Review summary fetched successfully",
        data: {
          paper,
          reviews,
          summary,
        },
      });
    } catch (error) {
      console.error("Get Review Summary Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to load review summary",
        error: error.message,
      });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const updatedPaper = await paperRepo.updatePaperStatus(id, status);

      if (!updatedPaper) {
        return res.status(404).json({
          success: false,
          message: "Paper not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: `Paper status updated to ${status} successfully`,
        data: updatedPaper,
      });
    } catch (error) {
      console.error("Update Status Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update paper status",
        error: error.message,
      });
    }
  },

  getPublishedPapers: async (req, res) => {
    try {
      const papers = await paperRepo.findPublishedPapers();

      return res.status(200).json({
        success: true,
        message: "Published papers fetched successfully",
        count: papers.length,
        data: papers,
      });
    } catch (error) {
      console.error("Get Published Papers Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch published papers",
        error: error.message,
      });
    }
  },
};
