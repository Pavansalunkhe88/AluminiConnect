const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const {
  handleUpdateAlumniProfile,
  handleDeleteAlumni,
  handleGetProfile,
  handleGetUserById,
  handleInsertDataToAlumniModel,
  handleGetAlumniProfile,
} = require("../controller/alumni");
const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.use(verifyToken, authorizeRoles("Alumni"));

// Everyone (students, teachers, alumni, admins) can view alumni
//router.get("/", handleGetAllAlumni);
//router.get("/:id", handleGetUserById);

router.get("/dashboard", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      stats: [
        { label: "Events Attended", value: 12 },
        { label: "Alumni Connections", value: 45 },
        { label: "Projects Completed", value: 8 },
      ],
      activities: [
        {
          type: "connection",
          title: "New Connection",
          description: "Connected with John Doe",
          timestamp: "2 hours ago",
        },
        {
          type: "event",
          title: "Event Registration",
          description: "Registered for Workshop",
          timestamp: "1 day ago",
        },
      ],
    },
  });
});

//  Profile
router.get("/profile", handleGetAlumniProfile);
router.post(
  "/profile",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  handleInsertDataToAlumniModel
);
//router.put("/profile", handleInsertDataToAlumniModel);
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
