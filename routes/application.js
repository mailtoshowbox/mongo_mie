var express = require("express");
const ApplicationController = require("../controllers/application.controller");

var router = express.Router();

router.post("/banner", ApplicationController.newBanner);
router.get("/banner/:id", ApplicationController.getBanner);






module.exports = router;