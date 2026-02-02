const express = require("express");
const v1Module = require("./v1/index");

const router = express.Router();

router.use("/v1", v1Module);

module.exports = router;
