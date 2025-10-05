const express = require("express");
const router = express.Router();
const { getAlumniById } = require("../controller/alumni");

router.get("/", getAlumniById);

module.exports = router;
