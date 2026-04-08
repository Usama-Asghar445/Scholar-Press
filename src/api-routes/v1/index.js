const express = require("express");
const userModule = require("../../module/user/index");
const paperModule = require("../../module/paper/index");
const chiefEditorModule = require("../../module/chief-editor/index");
const roleModule = require("../../module/role/index");

const router = express.Router();

router.use("/user", userModule);
router.use("/paper", paperModule);
router.use("/editor-in-chief", chiefEditorModule);
router.use("/role", roleModule);


module.exports = router;
