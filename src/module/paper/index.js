const express = require("express");
const {
  verifyTokenAndAttachUser,
  authorizeRoles,
} = require("../../middlewares/auth-state/index");
const controller = require("./controller");
const upload = require("../../middlewares/file-handled/multer");
const validate = require("../../middlewares/validation/paper/validate");

const router = express.Router();

router.post(
  "/submit",
  [
    verifyTokenAndAttachUser,
    upload.fields([
      { name: "paper", maxCount: 1 },
      { name: "figuresDetails", maxCount: 10 },
      { name: "supplementaryDetails", maxCount: 10 },
    ]),
    validate.paperSubmission,
  ],
  controller.createPaper,
);

router.get(
  "/get-papers",
  verifyTokenAndAttachUser,
  authorizeRoles("Editor", "Associate Editor"),
  controller.getPapers,
);
router.get("/my-papers", verifyTokenAndAttachUser, controller.getMyPapers);
router.get(
  "/status-counts",
  verifyTokenAndAttachUser,
  controller.getPaperStatusCounts,
);
module.exports = router;
