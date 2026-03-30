const pushFileToCloudinary = require("../../utils/cloudinary-file-storage/index");
const RoleApplication = require("../../models/role-application.model");
const RoleHistory = require("../../models/role-history.model");
const Education = require("../../models/education.model");


module.exports = {
  appliedForRole: async (req, res) => {
    try {
      const { appliedRole, degree, institution, passingYear, major } = req.validatedBody;
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User authentication failed. Please log in again.",
        });
      }

      // 1. Current Role Check
      if (user.role === appliedRole) {
        return res.status(400).json({
          success: false,
          message: `You are already a ${appliedRole}.`,
        });
      }

      // 2. 6-Month Block Check if previously rejected
      const lastRejected = await RoleApplication.findOne({
        userId: user._id,
        appliedRole,
        status: "Rejected",
      }).sort({ processedAt: -1 });

      if (lastRejected && lastRejected.processedAt) {
        const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000;
        const timeSinceRejection = Date.now() - new Date(lastRejected.processedAt).getTime();

        if (timeSinceRejection < sixMonthsInMs) {
          const reapplyDate = new Date(new Date(lastRejected.processedAt).getTime() + sixMonthsInMs);
          return res.status(403).json({
            success: false,
            message: `Your previous application for ${appliedRole} was rejected. You can re-apply after ${reapplyDate.toDateString()}.`,
          });
        }
      }

      // 3. Pending Application Check (any role)
      const existingPending = await RoleApplication.findOne({
        userId: user._id,
        status: "Pending",
      });

      if (existingPending) {
        return res.status(400).json({
          success: false,
          message: `You already have a pending application for ${existingPending.appliedRole}.`,
        });
      }

      // 4. Ensure education document uploaded
        console.log("Received file:", req.file);
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Original degree document is required.",
        });
      }
    

      // 5. Upload education document
      const uploadRes = await pushFileToCloudinary(req.file);
      const educationDocUrl = uploadRes.url;

      // 6. Create Role Application
      const newApplication = await RoleApplication.create({
        userId: user._id,
        appliedRole,
        status: "Pending",
        appliedAt: new Date(),
      });

      // 7. Save Education
      const newEducation = await Education.create({
        userId: user._id,
        roleApplicationId: newApplication._id,
        degree,
        institution,
        passingYear,
        major,
        document: educationDocUrl,
      });

      // 8. Link Education to Application
      newApplication.educationId = newEducation._id;
      await newApplication.save();

      // 9. Optionally, save a RoleHistory entry for logging purposes (action: Application)
      await RoleHistory.create({
        userId: user._id,
        previousRole: user.role,
        newRole: appliedRole,
        changedBy: user._id, // user themselves applied
        reason: "Applied for role",
        action: "Manual Update",
      });

      return res.status(200).json({
        success: true,
        message: "Application submitted with education details for admin review.",
        data: {
          application: newApplication,
          education: newEducation,
        },
      });

    } catch (error) {
      console.error("Critical Role Application Error:", {
        message: error.message,
        stack: error.stack,
        userId: req.user?._id,
      });
      return res.status(500).json({
        success: false,
        message: "An internal server error occurred while processing your application. Please contact support.",
        error: error.message,
      });
    }
  },
};