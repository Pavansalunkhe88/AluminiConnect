const express = require("express");
const router = express.Router();
const {
  //handleGetTeacherProfile,
  handleGetTeacherProfileToUpdate,
  handleUpdateTeacherProfile,
  handleTeacherProfileDelete,
  handleInsertDataToTacherModel,
  handleGetTeacherProfile,
} = require("../controller/teacher");
const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/multer");

router.use(verifyToken, authorizeRoles("Teacher", "Admin"));

//router.get("/profile", handleGetTeacherProfile);
//router.get("/profile/update", handleGetTeacherProfileToUpdate)

router.get("/dashboard", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      stats: [
        { label: "Events Attended", value: 12 },
        { label: "Alumni Connections", value: 45 },
        { label: "Event Posted", value: 20 },
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

router.get("/profile", handleGetTeacherProfile);
router.post(
  "/profile",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  handleInsertDataToTacherModel
);
// router.put(
//   "/profile",
//   upload.fields([
//     { name: "profileImage", maxCount: 1 },
//     { name: "coverImage", maxCount: 1 },
//   ]),
//   handleInsertDataToTacherModel
// );

router.put("/profile/update", handleUpdateTeacherProfile);
router.delete("/profile/delete", handleTeacherProfileDelete);
//router.get("/users/:id", handleGetTeacherProfile);

// Admin-only routes
// router.get("/all", handleGetAllTeachers);
// router.delete("/:id", handleDeleteTeacher);

//router.get("/dashboard", handleGetDashboardData);

module.exports = router;
