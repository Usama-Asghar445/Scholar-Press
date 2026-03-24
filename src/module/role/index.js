const express = require("express");
const controller = require("./controller");
const {
  verifyTokenAndAttachUser,
} = require("../../middlewares/auth-state/index");
const upload = require("../../middlewares/file-handled/multer");
const {appliedRoleValidator} = require("../../middlewares/validation/education/validation")

const router = express.Router();

// Apply for role
router.patch(
  "/applied-for-role",
  [
    verifyTokenAndAttachUser,
    upload.single("document"),
   appliedRoleValidator,
  ],
  controller.appliedForRole
);

module.exports = router;