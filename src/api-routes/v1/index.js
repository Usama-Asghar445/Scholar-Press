const express = require("express");
const userModule = require("../../module/user/index")
const paperModule = require("../../module/paper/index")

const router = express.Router();

router.use("/user",userModule)
router.use("/paper",paperModule)

module.exports = router;
