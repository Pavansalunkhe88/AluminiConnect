const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  handleStudentProfileDelete,
  handleUpdateStudentProfile,
  handleGetMyProfile,
  handleGetUserById
} = require("../controller/student");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const { verifyToken } = require("../middlewares/authMiddleware");

router.use(verifyToken, authorizeRoles("student"));

// router.route("/").get(getAllStudents).post(createStudent);

// router
//   .route("/:id")
//   .get(getStudentById)
//   .put(updateStudent)
//   .delete(deleteStudent);

// router.get("/dashboard", (req, res) => {
//   res.send("welcome to Student Dashboard");
// });

// GET: Student profile
router.get("/profile/me", handleGetMyProfile);
 
// PUT: Update student profile
 router.put("/profile/update", handleUpdateStudentProfile);

// DELETE: Delete student profile
router.delete('/profile/delete', handleStudentProfileDelete)

// GET: All events (open to students)
// router.get("/events", handleGetAllEvents);

//GET: Specific user by id
router.get('/user/:id', handleGetUserById);

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
