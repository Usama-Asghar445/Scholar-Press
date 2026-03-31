const paperRepo = require("../../utils/repositories/paper/index");
const userRepo = require("../../utils/repositories/user/index");
const { PAPER } = require("../../common/constant/index");
const { paperFileUploader } = require("../../common/cloudinary/index");

const parseFormData = (body) => {
  const parsed = { ...body };

  if (typeof parsed.paperDetails === "string") {
    try {
      parsed.paperDetails = JSON.parse(parsed.paperDetails);
    } catch (err) {
      // keep original value
    }
  }

  if (typeof parsed.authors === "string") {
    try {
      parsed.authors = JSON.parse(parsed.authors);
    } catch (err) {
      // keep original value
    }
  }

  if (typeof parsed.conflictOfInterest === "string") {
    parsed.conflictOfInterest = parsed.conflictOfInterest === "true";
  }

  return parsed;
};

module.exports = {
  createPaper: async (req, res) => {
    try {
      const authorID = req.userId;
      const rawBody = parseFormData(req.body);
      const paperDetail = req.validatedBody || rawBody;
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
      paperDetail.finalDecision = "Pending";

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

  getPaperDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const paper = await paperRepo.findPaperById(id);

      if (!paper) {
        return res.status(404).json({
          success: false,
          message: "Paper not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Paper details fetched successfully",
        data: paper,
      });
    } catch (error) {
      console.error("Get Paper Details Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch paper details",
        error: error.message,
      });
    }
  },

  resubmitPaper: async (req, res) => {
    try {
      const { id } = req.params;
      const paper = await paperRepo.findPaperById(id);
      if (!paper) {
        return res.status(404).json({
          success: false,
          message: "Paper not found",
        });
      }

      if (String(paper.userId) !== String(req.userId)) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to resubmit this paper",
        });
      }

      const rawBody = parseFormData(req.body);
      const updateData = {};
      if (rawBody.paperDetails) updateData.paperDetails = rawBody.paperDetails;
      if (rawBody.authors) updateData.authors = rawBody.authors;
      if (rawBody.conflictOfInterest !== undefined)
        updateData.conflictOfInterest = rawBody.conflictOfInterest;
      if (rawBody.conflictDescription !== undefined)
        updateData.conflictDescription = rawBody.conflictDescription;
      if (rawBody.dataAvailability)
        updateData.dataAvailability = rawBody.dataAvailability;
      if (rawBody.areaOfResearch)
        updateData.areaOfResearch = rawBody.areaOfResearch;

      if (req.files && Object.keys(req.files).length > 0) {
        const uploadedFiles = await paperFileUploader(req.files);
        updateData.paperFiles = {
          ...paper.paperFiles,
          ...uploadedFiles,
        };
      }

      updateData.status = "Under Review";

      const updatedPaper = await paperRepo.updatePaperById(id, updateData);

      return res.status(200).json({
        success: true,
        message: "Paper resubmitted successfully",
        data: updatedPaper,
      });
    } catch (error) {
      console.error("Resubmit Paper Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to resubmit paper",
        error: error.message,
      });
    }
  },

  getPapers: async (req, res) => {
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
