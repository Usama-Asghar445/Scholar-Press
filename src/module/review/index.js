const express = require("express");
const controller = require("./controller");
const {
  verifyTokenAndAttachUser,
} = require("../../middlewares/auth-state/index");
const router = express.Router();

router.post("/submit", [verifyTokenAndAttachUser], controller.submitReview);
router.get(
  "/paper/:paperId",
  [verifyTokenAndAttachUser],
  controller.getPaperReviews,
);
router.get("/my-reviews", [verifyTokenAndAttachUser], controller.getMyReviews);

module.exports = router;
