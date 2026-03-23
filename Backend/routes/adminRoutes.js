const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const {
  getDashboardStats,
  handleGetAllUsers,
  deleteUser,
  verifyUser,
  rejectUser,
  getPendingTeachers,
  createAlumniAccount,
  updateUserRole,
  getMonitoringData,
  searchUsersForSecurity,
  suspendUser,
  unsuspendUser,
  getSecurityStats,
  exportUsers,
} = require("../controller/admin");

// All routes are protected — admin/superadmin only
router.use(verifyToken, authorizeRoles("admin", "superadmin", "Admin"));

/* ─── Dashboard & Analytics ─── */
router.get("/dashboard-stats", getDashboardStats);

/* ─── User Database ─── */
router.get("/users", handleGetAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateUserRole);

/* ─── User Verification ─── */
router.patch("/users/:id/verify", verifyUser);
router.patch("/users/:id/reject", rejectUser);

/* ─── Teacher Verification ─── */
router.get("/pending-teachers", getPendingTeachers);

/* ─── Alumni Creation ─── */
router.post("/create-alumni", createAlumniAccount);

/* ─── Platform Monitoring ─── */
router.get("/monitoring", getMonitoringData);

/* ─── Security & Control ─── */
router.get("/security/search", searchUsersForSecurity);
router.get("/security/stats", getSecurityStats);
router.patch("/users/:id/suspend", suspendUser);
router.patch("/users/:id/unsuspend", unsuspendUser);

/* ─── Data Export ─── */
router.get("/export-users", exportUsers);

/* ─── Data Import (CSV) ─── */
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { importUsersCSV } = require("../controller/admin");

router.post("/import-users", upload.single("file"), importUsersCSV);

module.exports = router;
