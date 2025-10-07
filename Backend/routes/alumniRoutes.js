const express = require("express");
const router = express.Router();
const {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni
} = require("../controller/alumni");

router.get("/", getAllAlumni);
router.get("/:id", getAlumniById);
router.post("/", createAlumni);
router.put("/:id", updateAlumni);
router.delete("/:id", deleteAlumni);

module.exports = router;
