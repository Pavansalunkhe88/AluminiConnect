const express = require("express");
const router = express.Router();
const {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  handleGetTeacherProfile,
  handleGetTeacherProfileToUpdate,
  handleUpdateTeacherProfile
} = require("../controller/teacher");
const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");


// router.post("/register", handleRegisterTeacher);
// router.post("/login", handleTeacherLogin);

router.use(verifyToken, authorizeRoles("teacher", "admin"));

// router.get("/", getAllTeachers);
// router.get("/:id", getTeacherById);
// router.post("/", createTeacher);
// router.put("/:id", updateTeacher);
// router.delete("/:id", deleteTeacher);

router.get("/profile", handleGetTeacherProfile);
router.get("/profile/update", handleGetTeacherProfileToUpdate)
router.put("/profile/update", handleUpdateTeacherProfile);

// Admin-only routes
// router.get("/all", handleGetAllTeachers);
// router.delete("/:id", handleDeleteTeacher);

router.get("/dashboard", (req, res) => {
  res.send("welcome to Teacher Dashboard");
});

module.exports = router;
