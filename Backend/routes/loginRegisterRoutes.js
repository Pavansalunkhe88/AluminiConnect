const express = require("express");
const router = express.Router();
const {
  handleRegisterUsers,
  handleUserLogin,
  getLoginPage,
  getRegisterPage,
} = require("../controller/loginRegister");

//router.route("/login").get(getLoginPage).post(handleUserLogin);


router.route("/login").post(handleUserLogin);

//router.route("/register").get(getRegisterPage).post(handleRegisterUsers);
router.route("/register").post(handleRegisterUsers);

// router.get("/login", getLoginPage)
// router.post("/login", handleUserLogin);
// router.get("/register", getRegisterPage);
// router.post("/register", handleRegisterUsers);

module.exports = router;
