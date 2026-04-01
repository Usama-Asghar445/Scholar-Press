const paperRepo = require("../../../utils/repositories/paper/index");

module.exports = {
  getPapersByEID: async (req, res) => {
    try {
      const { areaOfResearch, status } = req.body || req.query;
      const query = {};
      if (areaOfResearch) query.areaOfResearch = areaOfResearch;
      if (status) query.status = status;
      const papers = await paperRepo.findPapers(query);

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
