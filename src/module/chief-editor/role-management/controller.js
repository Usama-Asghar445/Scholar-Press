const RoleApplication = require("../../../models/role-application.model");
const User = require("../../../models/user.model");
const userRepo = require("../../../utils/repositories/user/index");
const RoleHistory = require("../../../models/role-history.model");

module.exports = {
  getPendingApplications: async (req, res) => {
    try {
      const applicants = await RoleApplication.find({
        status: "Pending",
      })
        .sort({
          createdAt: -1,
        })
        .populate("userId");
      if (!applicants || applicants.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No pending applications at this time.",
          data: [],
        });
      }
      return res.status(200).json({
        success: true,
        count: applicants.length,
        data: applicants,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch applications",
        error: error.message,
      });
    }
  },

  acceptStatus: async (req, res) => {
    try {
      const { userId, role, action, chiefNote } = req.body;

      const user = await User.findById(userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found." });

      const application = await RoleApplication.findOne({
        userId,
        appliedRole: role,
        status: "Pending",
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "No pending application found for this role.",
        });
      }

      if (action === "Approved") {
        await RoleHistory.create({
          userId,
          previousRole: user.role,
          newRole: role,
          changedBy: req.user._id,
          action: "Promotion",
          reason: chiefNote || "Standard approval",
        });
        user.role = role;
        await user.save();
      } else if (action === "Rejected") {
        // rejection penalty: 6 months
        const blockedUntil = new Date();
        blockedUntil.setMonth(blockedUntil.getMonth() + 6);

        await RoleHistory.create({
          userId,
          previousRole: user.role,
          newRole: role,
          changedBy: req.user._id,
          action: "Rejection",
          reason: chiefNote || "Application rejected",
          blockedUntil: blockedUntil,
        });
      }

      // 3. Process Rejection (or cleanup after approval)
      application.status = action;
      application.processedAt = new Date();
      application.chiefRejectedNote = action === "Rejected" ? chiefNote : null;
      await application.save();

      return res.status(200).json({
        success: true,
        message: `User has been successfully ${action.toLowerCase()}. ${action === "Rejected" ? "They are blocked from re-applying for 6 months." : ""}`,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
};
