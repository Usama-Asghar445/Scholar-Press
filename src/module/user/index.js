const express = require("express");
const {
  verifyTokenAndAttachUser,
} = require("../../middlewares/auth-state/index");
const validate = require("../../middlewares/validation/user/validate");
const controller = require("./controller");

const router = express.Router();

router.post("/register", [validate.registerValidator], controller.registerUser);

router.post(
  "/email-verify",
  [validate.verifyUserValidator],
  controller.verifyUser,
);
router.post(
  "/forget-password",
  [validate.forgetPasswordValidator],
  controller.forgetPassword,
);
router.post(
  "/reset-password",
  [validate.verifyUserValidator],
  controller.ResetPassword,
);

module.exports = router;
