const express = require("express");
const router = express.Router();
const {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  handleUpdateAlumniProfile,
  handleDeleteAlumni,
  handleGetProfile,
  handleGetUserById
} = require("../controller/alumni");
const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.use(verifyToken, authorizeRoles("alumni"));

// router.get("/", getAllAlumni);
// router.get("/:id", getAlumniById);
// router.post("/", createAlumni);
// router.put("/:id", updateAlumni);
// router.delete("/:id", deleteAlumni);

// router.get("/dashboard", (req, res) => {
//   res.send("welcome to Alumni Dashboard");
// });

//  Profile
router.get("/profile", handleGetProfile);
router.put("/profile", handleUpdateAlumniProfile);
router.delete("/profile", handleDeleteAlumni);

// Jobs
// router.post("/jobs", postJob);
// router.get("/jobs/my", getMyJobs);

// // Mentorship
// router.post("/mentorship/create", createMentorship);
// router.get("/mentorship/requests", getMentorshipRequests);

// // Events
// router.get("/events", viewEvents);
// router.post("/events/:eventId/register", registerEvent);

// Must be last route
router.get("/:id", handleGetUserById);

module.exports = router;




module.exports = router;
