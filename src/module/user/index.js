const express = require("express");
const {
  verifyTokenAndAttachUser,
  authorizeRoles,
} = require("../../middlewares/auth-state/index");
const validate = require("../../middlewares/validation/user/validate");
const controller = require("./controller");
const upload = require("../../middlewares/file-handled/multer");

const router = express.Router();

router.post("/register", [validate.registerValidator], controller.registerUser);
router.post("/login", [validate.loginValidator], controller.userLogin);

router.post(
  "/email-verify",
  [validate.verifyUserValidator],
  controller.verifyUser,
);
router.post(
  "/forget-password",
  [validate.emailValidator],
  controller.forgetPassword,
);
router.post(
  "/reset-password",
  [validate.resetPasswordValidator],
  controller.ResetPassword,
);

router.post(
  "/resend-code",
  [validate.emailValidator],
  controller.resendVerificationCode,
);

router.get("/get", [verifyTokenAndAttachUser], controller.getUserById);
router.get("/get-users", [verifyTokenAndAttachUser], controller.getUsers);
router.get(
  "/related-users",
  [verifyTokenAndAttachUser, authorizeRoles("Editor", "Associate Editor")],
  controller.getRelatedUsers,
);
router.patch(
  "/update-profile",
  [
    verifyTokenAndAttachUser,
    upload.single("profileImage"),
    validate.updateUserProfileValidator,
  ],
  controller.updateUserProfile,
);

router.patch(
  "/complete-profile",
  [
    verifyTokenAndAttachUser,
    upload.single("profileImage"),
    validate.completeUserProfileValidator,
  ],
  controller.completeUserProfile,
);
module.exports = router;
