const express = require("express");
const router = express.Router();
const { handleGetSettings, handleUpdateSettings } = require("../controller/settingsController");
const { verifyToken } = require("../middlewares/authMiddleware");

// All settings routes require authentication
router.use(verifyToken);

router.get("/", handleGetSettings);
router.put("/", handleUpdateSettings);

module.exports = router;
