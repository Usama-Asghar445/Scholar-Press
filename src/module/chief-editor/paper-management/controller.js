const paperRepo = require("../../../utils/repositories/paper/index");

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
};
