const express = require("express");
const router = express.Router();
const workflowController = require("./workflow.controller");
const { verifyTokenAndAttachUser } = require("../../middlewares/auth-state/index");

// All workflow routes require authentication
router.use(verifyTokenAndAttachUser);

// EIC Actions
router.post("/desk-reject", workflowController.deskReject);
router.post("/assign-handling-editor", workflowController.assignHandlingEditor);
router.post("/final-decision", workflowController.finalDecision);
router.post("/publish", workflowController.publishPaper);

// Handling Editor Actions
router.post("/assign-associate-editor", workflowController.assignAssociateEditor);

// Associate Editor Actions
router.post("/assign-reviewers", workflowController.assignReviewers);
router.post("/recommend-decision", workflowController.recommendDecision);

// Reviewer Actions
router.post("/respond-invitation", workflowController.respondToInvitation);
router.post("/submit-review", workflowController.submitReview);

// Author Actions
router.post("/submit-revision", workflowController.submitRevision);

module.exports = router;
