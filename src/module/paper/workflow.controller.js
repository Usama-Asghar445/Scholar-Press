const Paper = require("../../models/paper.model");
const User = require("../../models/user.model");

// Helper to log history
const addHistory = async (paperId, action, actorId, previousStatus, newStatus, comments = "") => {
  await Paper.findByIdAndUpdate(paperId, {
    $push: {
      workflowHistory: {
        action,
        actorId,
        previousStatus,
        newStatus,
        comments,
        timestamp: new Date()
      }
    },
    status: newStatus
  });
};

// 1. EIC: Desk Reject
exports.deskReject = async (req, res) => {
  try {
    const { paperId, comments } = req.body;
    const paper = await Paper.findById(paperId);
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    const prevStatus = paper.status;
    await addHistory(paperId, "Desk Reject", req.user.id, prevStatus, "Rejected", comments);
    res.status(200).json({ message: "Paper desk rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. EIC: Assign Handling Editor
exports.assignHandlingEditor = async (req, res) => {
  try {
    const { paperId, editorId } = req.body;
    const paper = await Paper.findByIdAndUpdate(paperId, { handlingEditorId: editorId });
    const prevStatus = paper.status;
    await addHistory(paperId, "Assign Handling Editor", req.user.id, prevStatus, "Assigned to Editor");
    res.status(200).json({ message: "Handling Editor assigned" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Handling Editor: Assign Associate Editor
exports.assignAssociateEditor = async (req, res) => {
  try {
    const { paperId, associateEditorId } = req.body;
    const paper = await Paper.findByIdAndUpdate(paperId, { associateEditorId });
    const prevStatus = paper.status;
    await addHistory(paperId, "Assign Associate Editor", req.user.id, prevStatus, "Assigned to Associate Editor");
    res.status(200).json({ message: "Associate Editor assigned" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Associate Editor: Assign Reviewers
exports.assignReviewers = async (req, res) => {
  try {
    const { paperId, reviewerIds } = req.body; // Array of IDs
    const paper = await Paper.findById(paperId);
    
    const newReviewers = reviewerIds.map(id => ({
      reviewerId: id,
      invitationStatus: "Pending",
      reviewStatus: "Pending"
    }));

    await Paper.findByIdAndUpdate(paperId, {
      $push: { reviewers: { $each: newReviewers } },
      status: "Under Review"
    });

    await addHistory(paperId, "Assign Reviewers", req.user.id, paper.status, "Under Review");
    res.status(200).json({ message: "Reviewers assigned" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Reviewer: Respond to Invitation
exports.respondToInvitation = async (req, res) => {
  try {
    const { paperId, response } = req.body; // "Accepted" or "Declined"
    await Paper.updateOne(
      { _id: paperId, "reviewers.reviewerId": req.user.id },
      { 
        $set: { 
          "reviewers.$.invitationStatus": response,
          "reviewers.$.respondedAt": new Date()
        } 
      }
    );
    res.status(200).json({ message: `Invitation ${response}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Reviewer: Submit Review
exports.submitReview = async (req, res) => {
  try {
    const { paperId, decision, comments } = req.body;
    await Paper.updateOne(
      { _id: paperId, "reviewers.reviewerId": req.user.id },
      { 
        $set: { 
          "reviewers.$.reviewStatus": "Completed",
          "reviewers.$.decision": decision,
          "reviewers.$.comments": comments,
          "reviewers.$.completedAt": new Date()
        } 
      }
    );

    // Check if all reviewers completed
    const paper = await Paper.findById(paperId);
    const allCompleted = paper.reviewers.every(r => r.reviewStatus === "Completed" || r.invitationStatus === "Declined");
    if (allCompleted) {
        await addHistory(paperId, "Review Completed", "System", paper.status, "Reviews Completed");
    }

    res.status(200).json({ message: "Review submitted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. Associate Editor: Recommend Decision
exports.recommendDecision = async (req, res) => {
  try {
    const { paperId, recommendation, comments } = req.body;
    const paper = await Paper.findById(paperId);
    await addHistory(paperId, "Recommend Decision", req.user.id, paper.status, paper.status, `Recommendation: ${recommendation}. ${comments}`);
    res.status(200).json({ message: "Recommendation sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. EIC: Final Decision
exports.finalDecision = async (req, res) => {
  try {
    const { paperId, decision, comments } = req.body; // "Accepted", "Rejected", "Minor Revision", "Major Revision"
    const paper = await Paper.findById(paperId);
    await addHistory(paperId, "Final Decision", req.user.id, paper.status, decision, comments);
    res.status(200).json({ message: `Paper ${decision}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 9. Author: Submit Revision
exports.submitRevision = async (req, res) => {
    try {
        const { paperId, updatedFileData } = req.body;
        const paper = await Paper.findById(paperId);
        // Assuming paperFiles update logic here
        await Paper.findByIdAndUpdate(paperId, { status: "Revised Submission" });
        await addHistory(paperId, "Submit Revision", req.user.id, paper.status, "Revised Submission");
        res.status(200).json({ message: "Revision submitted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 10. EIC: Publish
exports.publishPaper = async (req, res) => {
    try {
        const { paperId } = req.body;
        const paper = await Paper.findById(paperId);
        await addHistory(paperId, "Publish", req.user.id, paper.status, "Published");
        res.status(200).json({ message: "Paper published" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
