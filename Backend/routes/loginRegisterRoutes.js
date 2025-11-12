const express = require("express");
const router = express.Router();
const {
  handleRegisterUsers,
  handleUserLogin,
} = require("../controller/loginRegister");

//router.route("/login").get(getLoginPage).post(handleUserLogin);

router.route("/login").post(handleUserLogin);

//router.route("/register").get(getRegisterPage).post(handleRegisterUsers);
router.route("/register").post(handleRegisterUsers);

module.exports = router;
