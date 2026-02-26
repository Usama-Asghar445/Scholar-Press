const express = require("express");
const controller = require("./controller");
// const {
//   verifyChiefEditorKey,
// } = require("../../../middlewares/chief-editor/auth-state");

const router = express.Router();

router.post ("/get-papers",controller.getPapersByEID)
module.exports = router;
