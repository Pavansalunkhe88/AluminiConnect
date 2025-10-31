const express = require('express');
const router = express.Router();
const {handleRegisterUsers} = require("../controller/loginRegister")

router.post("/", handleRegisterUsers);

module.exports = router;