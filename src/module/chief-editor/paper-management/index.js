const express = require("express");
const controller = require("./controller");
const {
  verifyTokenAndAttachUser,
} = require("../../../middlewares/auth-state/index");

const router = express.Router();

router.post ("/get-papers",[verifyTokenAndAttachUser],controller.getPapersByEID)
module.exports = router;
