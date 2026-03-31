const express = require("express");
const controller = require("./controller");
const {
  verifyTokenAndAttachUser,
} = require("../../../middlewares/auth-state/index");

const router = express.Router();

router.post(
  "/get-papers",
  [verifyTokenAndAttachUser],
  controller.getPapersByEID,
);
router.post(
  "/assign-editor",
  [verifyTokenAndAttachUser],
  controller.assignFieldEditor,
);
router.post(
  "/assign-ae",
  [verifyTokenAndAttachUser],
  controller.assignAssociateEditor,
);
router.post(
  "/assign-reviewers",
  [verifyTokenAndAttachUser],
  controller.assignReviewers,
);
router.get(
  "/review-summary/:paperId",
  [verifyTokenAndAttachUser],
  controller.getReviewSummary,
);
router.put(
  "/update-status/:id",
  [verifyTokenAndAttachUser],
  controller.updateStatus,
);
router.get(
  "/published-papers",
  [verifyTokenAndAttachUser],
  controller.getPublishedPapers,
);
module.exports = router;
