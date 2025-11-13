const express = require("express");
const router = express.Router();
const {
  handleUpdateAlumniProfile,
  handleDeleteAlumni,
  handleGetProfile,
  handleGetUserById,
  handleGetDashboardData
} = require("../controller/alumni");
const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.use(verifyToken, authorizeRoles("alumni"));

// router.get("/", getAllAlumni);
// router.get("/:id", getAlumniById);
// router.post("/", createAlumni);
// router.put("/:id", updateAlumni);
// router.delete("/:id", deleteAlumni);

// GET: Alumni dashboard data
router.get("/dashboard", handleGetDashboardData);

//  Profile
router.get("/profile", handleGetProfile);
router.put("/profile", handleUpdateAlumniProfile);
router.delete("/profile", handleDeleteAlumni);

// Jobs
// router.post("/jobs", postJob);
// router.get("/jobs/my", getMyJobs);

// GET /api/users/:id → basic info (name, headline, photo, summary)
// GET /api/users/:id/experience → work experience
// GET /api/users/:id/education → education details
// GET /api/users/:id/posts → user activity
// GET /api/users/:id/connections → mutual connections, etc.


// // Mentorship
// router.post("/mentorship/create", createMentorship);
// router.get("/mentorship/requests", getMentorshipRequests);

// // Events
// router.get("/events", viewEvents);
// router.post("/events/:eventId/register", registerEvent);

// Must be last route
router.get("/:id", handleGetUserById);

module.exports = router;
