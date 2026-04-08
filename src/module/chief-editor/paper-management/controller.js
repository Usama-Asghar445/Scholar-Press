const paperRepo = require("../../../utils/repositories/paper/index");
const User = require("../../../models/user.model");
const Education = require("../../../models/education.model");
const RoleApplication = require("../../../models/role-application.model");

module.exports = {
  getAssociateEditorsByFieldOfStudy: async (req, res) => {
    try {
      const editorFieldOfStudy = req.user.fieldOfStudy;

      if (!editorFieldOfStudy) {
        return res.status(400).json({
          success: false,
          message:
            "You must complete your profile with a field of study first.",
        });
      }

      const associateEditors = await User.find({
        role: "Associate Editor",
        fieldOfStudy: editorFieldOfStudy,
      }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Associate Editors fetched successfully",
        count: associateEditors.length,
        data: associateEditors,
      });
    } catch (error) {
      console.error("Get Associate Editors Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch associate editors",
        error: error.message,
      });
    }
  },

  getReviewersByFieldOfStudy: async (req, res) => {
    try {
      const editorFieldOfStudy = req.user.fieldOfStudy;

      if (!editorFieldOfStudy) {
        return res.status(400).json({
          success: false,
          message:
            "You must complete your profile with a field of study first.",
        });
      }

      const reviewers = await User.find({
        role: "Reviewer",
        fieldOfStudy: editorFieldOfStudy,
      }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Reviewers fetched successfully",
        count: reviewers.length,
        data: reviewers,
      });
    } catch (error) {
      console.error("Get Reviewers Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch reviewers",
        error: error.message,
      });
    }
  },

  getUserQualifications: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Get education details from role applications
      const education = await Education.find({ userId }).populate(
        "roleApplicationId",
      );

      // Get role application status
      const roleApplication = await RoleApplication.findOne({
        userId,
        status: "Approved",
      }).sort({ processedAt: -1 });

      const qualifications = {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          institution: user.institution,
          department: user.department,
          designation: user.designation,
          country: user.country,
          city: user.city,
          address: user.address,
          fieldOfStudy: user.fieldOfStudy,
          specializations: user.specializations,
          biography: user.biography,
          profileImage: user.profileImage,
          role: user.role,
        },
        education: education,
        roleApplication: roleApplication,
      };

      return res.status(200).json({
        success: true,
        message: "Qualifications fetched successfully",
        data: qualifications,
      });
    } catch (error) {
      console.error("Get Qualifications Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch qualifications",
        error: error.message,
      });
    }
  },

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
