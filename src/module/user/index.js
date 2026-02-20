const express = require("express");
const {
  verifyTokenAndAttachUser,
} = require("../../middlewares/auth-state/index");
const validate = require("../../middlewares/validation/user/validate");
const controller = require("./controller");

const router = express.Router();

router.post("/register", [validate.registerValidator], controller.registerUser);
router.post("/login", [validate.emailValidator], controller.userLogin);

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

router.get("/get-user", [verifyTokenAndAttachUser], controller.getUser);
updateUserValidator;
router.patch(
  "/update-user",
  [verifyTokenAndAttachUser, validate.updateUserValidator],
  controller.updateUserByEmail,
);

module.exports = router;
