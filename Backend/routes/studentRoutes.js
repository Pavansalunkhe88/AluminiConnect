const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const {
  handleStudentProfileDelete,
  handleUpdateStudentProfile,
  handleGetMyProfile,
  handleGetUserById,
  handleInsertDataToStudentModel,
  handleGetStudentProfile
} = require("../controller/student");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const { verifyToken } = require("../middlewares/authMiddleware");

router.use(verifyToken, authorizeRoles("Student"));

// router.get("/dashboard", (req, res) => {
//   res.send("welcome to Student Dashboard");
// });

router.get("/dashboard", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      stats: [
        { label: "Events Attended", value: 12 },
        { label: "Alumni Connections", value: 45 },
        { label: "Projects Completed", value: 8 }
      ],
      activities: [
        {
          type: "connection",
          title: "New Connection",
          description: "Connected with John Doe",
          timestamp: "2 hours ago"
        },
        {
          type: "event",
          title: "Event Registration",
          description: "Registered for Workshop",
          timestamp: "1 day ago"
        }
      ]
    }
  });
});


// GET: Student profile
router.get("/profile", handleGetStudentProfile);

router.post(
  "/profile",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  handleInsertDataToStudentModel
);
router.put("/profile/update", handleUpdateStudentProfile);

// DELETE: Delete student profile
router.delete("/profile/delete", handleStudentProfileDelete);

// GET: All events (open to students)
// router.get("/events", handleGetAllEvents);

//GET: Specific user by id
router.get("/user/:id", handleGetUserById);

// // POST: Register for an event
// router.post("/events/:eventId/register", handleRegisterForEvent);

// // GET: Mentorship list
// router.get("/mentors", handleGetAllMentors);

// router.get("/", getAllStudents);
// router.get("/:id", getStudentById);
// router.post("/", createStudent);
// router.put("/:id", updateStudent);
// router.delete("/:id", deleteStudent);

module.exports = router;
