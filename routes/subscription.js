var express = require("express");
const SubscriptionController = require("../controllers/subscription.controller");

var router = express.Router();

router.post("/new", SubscriptionController.newSubcription);

router.get("/check", SubscriptionController.checkSubcription);






module.exports = router;