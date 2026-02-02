const express = require("express");
const userModule = require("../../module/user/index")

const router = express.Router();

router.use("/user",userModule)

module.exports = router;
