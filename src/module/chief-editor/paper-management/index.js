const express = require("express");
const controller = require("./controller");
const {
  verifyTokenAndAttachUser,
} = require("../../../middlewares/auth-state/index");

const router = express.Router();

router.post ("/get-papers",[verifyTokenAndAttachUser],controller.getPapersByEID)
router.put("/update-status/:id", [verifyTokenAndAttachUser], controller.updateStatus);
router.get("/published-papers", [verifyTokenAndAttachUser], controller.getPublishedPapers);
module.exports = router;
