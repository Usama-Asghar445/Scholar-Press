const express = require("express");
const {
  verifyTokenAndAttachUser,
} = require("../../middlewares/auth-state/index");
const validate = require("../../middlewares/validation/user/validate");
const controller = require("./controller");

const router = express.Router();

router.post("/register", [validate.registerValidator], controller.registerUser);
router.post("/login",controller.userLogin);

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
  [validate.verifyUserValidator],
  controller.ResetPassword,
);

router.post(
  "/resend-code",
  [validate.emailValidator],
  controller.resendVerificationCode,
);

module.exports = router;
