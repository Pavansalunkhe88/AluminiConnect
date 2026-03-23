const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  getAllJobs,
  createJob,
  getRecommendedJobs,
} = require("../controller/jobController");

router.use(verifyToken);

// General endpoints
router.get("/", getAllJobs);
router.post("/", createJob);

// AI Recommendations endpoint
router.get("/recommendations", getRecommendedJobs);

module.exports = router;
