const services = require("./service");
const userRepo = require("../../../utils/repositories/user/index");

module.exports = {
  getPendingApplications: async (req, res) => {
    try {
      const applicants = await userRepo.getPendingApplications();
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
    const { role, userId, action } = req.body;

    const user = await userRepo.findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with ID: ${userId}`,
      });
    }

    if (action === "Approved") {
      user.userType = role;
      user.applicationStatus = "Approved"; 
      user.appliedRole = null;
    } else {
      user.applicationStatus = "Rejected";
      user.appliedRole = null;
    }
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User application has been ${action}.`,
      data: user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

};
