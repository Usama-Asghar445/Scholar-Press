const express = require("express");
const {
  verifyTokenAndAttachUser,
} = require("../../middlewares/auth-state/index");


const router = express.Router();


module.exports = router;
