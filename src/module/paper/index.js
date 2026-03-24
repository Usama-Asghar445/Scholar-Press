const express = require("express");
const {
  verifyTokenAndAttachUser,
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
    validate.paperSubmission
  ],
  controller.createPaper,
);

router.get("/get-papers", controller.getPapers)
module.exports = router;
