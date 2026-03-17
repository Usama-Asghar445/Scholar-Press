const express = require("express");
const userModule = require("../../module/user/index")
const paperModule = require("../../module/paper/index")
const chiefEditorModule = require("../../module/chief-editor/index")

const router = express.Router();

router.use("/user",userModule)
router.use("/paper",paperModule)
router.use("/editor-in-chief",chiefEditorModule)


module.exports = router;
