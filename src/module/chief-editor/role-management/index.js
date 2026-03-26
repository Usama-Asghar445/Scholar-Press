const express = require("express");
const controller = require("./controller");
const {
  verifyTokenAndAttachUser,
} = require("../../../middlewares/auth-state/index");
const validation = require("../../../middlewares/validation/chief-editor/role-management/validation")

const router = express.Router();

router.get ("/get-pending-applications",[verifyTokenAndAttachUser],controller.getPendingApplications)
router.patch ("/accept-role-status",[verifyTokenAndAttachUser,validation.acceptRoleValidator],controller.acceptRole)
router.get("/users", [verifyTokenAndAttachUser], controller.getUsers);
router.get("/users/:id", [verifyTokenAndAttachUser], controller.getUserProfile);
module.exports = router;
