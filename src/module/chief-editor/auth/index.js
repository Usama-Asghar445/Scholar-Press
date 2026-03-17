const express = require("express");
const controller = require("./controller");
const {
  verifyChiefEditorKey,
} = require("../../../middlewares/chief-editor/auth-state");

const router = express.Router();

router.post(
  "/register",
  [verifyChiefEditorKey],
  controller.chiefEditorRegister,
);
router.post(
  "/login",
//   [verifyChiefEditorKey],
  controller.chiefEditorLogin,
);

module.exports = router;
