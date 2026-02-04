const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { verifyToken } = require("../../middlewares/authMiddleware"); // adjust path to your auth middleware

//router.use(verifyToken);

router.get("/conversations", chatController.getConversations);
router.get("/messages/:conversationId", chatController.getMessages);
router.post("/messages", chatController.postMessage);
router.post("/seen", chatController.seenConversation);
router.post("/reaction", chatController.reaction);

module.exports = router;
