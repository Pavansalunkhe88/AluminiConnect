const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controller/student");

router.route("/").get(getAllStudents).post(createStudent);

router
  .route("/:id")
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

// router.get("/", getAllStudents);
// router.get("/:id", getStudentById);
// router.post("/", createStudent);
// router.put("/:id", updateStudent);
// router.delete("/:id", deleteStudent);

module.exports = router;
