const express = require ("express")
const router = express.Router()
const authcontrollers = require("../controllers/auth-controller")
const authMiddleware = require('../middlewares/auth-middleware')



router.route("/").get(authcontrollers.home);
router.route("/register").post(authcontrollers.register);
router.route("/login").post(authcontrollers.login);
router.route("/user").get(authMiddleware, authcontrollers.user);

router.route("/update_profile").put(authMiddleware, authcontrollers.updateProfile);

router.route("/forgot-password").post(authcontrollers.forgotPassword);
router.route("/reset-password/:resetToken").post(authcontrollers.resetPassword);


router.route("/send-otp").post(authMiddleware,authcontrollers.sendOTP);
router.route("/verify-otp").post(authMiddleware,authcontrollers.verifyOTP);

module.exports = router;