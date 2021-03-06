var express = require("express");
const AuthController = require("../controllers/AuthController");

var router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/update/:id", AuthController.update);
router.get("/view/:id", AuthController.view);
router.post("/changePassword/:id", AuthController.changePassword);
router.get("/forgetPassword/:id", AuthController.view);
router.post("/verify-otp", AuthController.verifyConfirm);
router.post("/resend-verify-otp", AuthController.resendConfirmOtp);



module.exports = router;