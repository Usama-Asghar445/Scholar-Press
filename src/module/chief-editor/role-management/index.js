const express = require("express");
const controller = require("./controller");
// const {
//   verifyChiefEditorKey,
// } = require("../../../middlewares/chief-editor/auth-state");

const router = express.Router();

router.post ("/get-applications",controller.getPendingApplications)
router.post ("/accept-status",controller.acceptStatus)
module.exports = router;
