const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const isAuth = require("../middleware/is-auth");

const { signUpValidation, loginValidation } = require("./validation");

//signup
router.post("/signup", signUpValidation, authController.signup);

//login
router.post("/login", loginValidation, authController.login);

//logout
router.post("/logout", isAuth, authController.logout);

//get CurrentUser
router.get("/user", isAuth, authController.getCurrentUser);

module.exports = router;
