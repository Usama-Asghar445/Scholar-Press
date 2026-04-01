const paperRepo = require("../../utils/repositories/paper/index");
const userRepo = require("../../utils/repositories/user/index");
const { PAPER } = require("../../common/constant/index");
// const service = require("./service")
const Paper = require("../../models/paper.model");
const { paperFileUploader } = require("../../common/cloudinary/index");

module.exports = {
  createPaper: async (req, res) => {
    try {
      const authorID = req.userId;
      const paperDetail = req.validatedBody;
      const isAuthorExist = await userRepo.findUserById(authorID);
      if (!isAuthorExist) {
        return res.status(400).json({
          success: false,
          message: "Author not found",
        });
      }

      const uploadedFiles = await paperFileUploader(req.files);

      paperDetail.userId = isAuthorExist._id;
      paperDetail.status = PAPER.SUBMIT;
      paperDetail.paperFiles = uploadedFiles;

      const submittedPaper = await paperRepo.createPaper(paperDetail);

      return res.status(201).json({
        success: true,
        message: "Paper submitted successfully",
        submittedPaper: submittedPaper,
      });
    } catch (error) {
      console.log("error :", error);
      return res.status(500).json({
        success: false,
        message: "Error processing request",
        error: error.message,
      });
    }
  },

  getPapers: async (req, res) => {
    try {
      const { status } = req.query;
      const query = {};

      if (req.user && ["Editor", "Associate Editor"].includes(req.user.role)) {
        query.areaOfResearch = req.user.fieldOfStudy;
      } else if (req.query.areaOfResearch) {
        query.areaOfResearch = req.query.areaOfResearch;
      }

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

  getMyPapers: async (req, res) => {
    try {
      const { userId } = req;
      const { status } = req.query;

      const papers = await paperRepo.findPapersByUserId(userId, status);

      return res.status(200).json({
        success: true,
        message: "Papers fetched successfully",
        count: papers.length,
        data: papers,
      });
    } catch (error) {
      console.error("Get My Papers Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch your papers",
        error: error.message,
      });
    }
  },

  getPaperStatusCounts: async (req, res) => {
    try {
      const { userId } = req;
      const counts = await paperRepo.getPaperStatusCounts(userId);

      return res.status(200).json({
        success: true,
        message: "Paper status counts fetched successfully",
        data: counts,
      });
    } catch (error) {
      console.error("Get Paper Status Counts Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch status counts",
        error: error.message,
      });
    }
  },
};
