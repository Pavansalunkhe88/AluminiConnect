const Conversation = require("../models/Conversation");
const chatService = require("../services/chatService");

/**
 * GET /api/chat/conversations
 */
async function getConversations(req, res) {
  try {
    const userId = req.user._id;
    const convs = await Conversation.find({ participants: userId })
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .lean();

    const formatted = convs.map(c => {
      const other = c.participants.find(p => String(p) !== String(userId));
      return {
        _id: c._id,
        partnerId: other,
        lastMessage: c.lastMessage,
        updatedAt: c.updatedAt,
        unread: c.unreadCount ? (c.unreadCount[String(userId)] || 0) : 0
      };
    });

    return res.json({ conversations: formatted });
  } catch (err) {
    console.error("getConversations error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/chat/messages/:conversationId?limit=20&before=timestamp
 */
async function getMessages(req, res) {
  try {
    const { conversationId } = req.params;
    const { before, limit } = req.query;
    const { messages, hasMore } = await chatService.getMessagesPaginated(conversationId, { before, limit: limit || 20 });
    return res.json({ messages, hasMore });
  } catch (err) {
    console.error("getMessages error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/chat/messages
 * body: { conversationId (optional), to, text, attachment }
 */
async function postMessage(req, res) {
  try {
    const sender = req.user._id;
    const { conversationId, to, text, attachment } = req.body;

    let convId = conversationId;
    if (!convId) {
      const conv = await chatService.findOrCreateConversation(String(sender), String(to));
      convId = conv._id;
    }

    const message = await chatService.createMessage({ conversationId: convId, sender, text, attachment });
    await message.populate("sender", "name profileImage");
    return res.status(201).json({ message });
  } catch (err) {
    console.error("postMessage error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/chat/seen
 * body: { conversationId }
 */
async function seenConversation(req, res) {
  try {
    const userId = req.user._id;
    const { conversationId } = req.body;
    await chatService.markConversationSeen(conversationId, userId);
    return res.json({ ok: true });
  } catch (err) {
    console.error("seenConversation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/chat/reaction
 * body: { messageId, reaction, action } action = "add" | "remove"
 */
async function reaction(req, res) {
  try {
    const userId = req.user._id;
    const { messageId, reaction, action } = req.body;
    let msg;
    if (action === "add") msg = await chatService.addReaction(messageId, reaction, userId);
    else msg = await chatService.removeReaction(messageId, reaction, userId);
    return res.json({ message: msg });
  } catch (err) {
    console.error("reaction error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getConversations,
  getMessages,
  postMessage,
  seenConversation,
  reaction
};
