const express = require("express");
const authModule = require("./auth/index")
const roleModule = require("./role-management/index")
const paperModule = require("./paper-management/index")

const router = express.Router();
router.use("/auth-state",authModule)
router.use("/role-management",roleModule)
router.use("/paper-management",paperModule)


module.exports = router;
