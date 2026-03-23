const express = require("express");
const router = express.Router();
const { getRecommendedUsers } = require("./controller");
const { verifyToken } = require("../../middlewares/authMiddleware");

// All recommendation routes are protected
router.use(verifyToken);

router.get("/users", getRecommendedUsers);

module.exports = router;
