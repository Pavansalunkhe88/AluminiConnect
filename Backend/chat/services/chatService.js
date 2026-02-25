// const Conversation = require("../models/Conversation");
// const Message = require("../models/Message");
// const {
//   getCachedMessages,
//   setCachedMessages,
//   pushCachedMessage,
//   incrementUnread,
//   resetUnread
// } = require("../utils/chatCache");

// async function findOrCreateConversation(userAId, userBId) {
//   let conv = await Conversation.findOne({
//     participants: { $all: [userAId, userBId], $size: 2 }
//   });

//   if (!conv) {
//     conv = await Conversation.create({
//       participants: [userAId, userBId],
//       unreadCount: {}
//     });
//   }

//   return conv;
// }

// async function createMessage({ conversationId, sender, text, attachment }) {
//   const msg = await Message.create({
//     conversationId,
//     sender,
//     text,
//     attachment
//   });

//   pushCachedMessage(conversationId, msg);

//   const conv = await Conversation.findById(conversationId);

//   if (conv) {
//     conv.lastMessage = msg._id;

//     conv.participants.forEach(p => {
//       if (String(p) !== String(sender)) {
//         const prev = conv.unreadCount.get(String(p)) || 0;
//         conv.unreadCount.set(String(p), prev + 1);
//         incrementUnread(p, conversationId);
//       }
//     });

//     await conv.save();
//   }

//   return msg;
// }

// async function getMessagesPaginated(conversationId, { before, limit }) {
//   if (!before) {
//     const cached = getCachedMessages(conversationId);
//     if (cached) {
//       return { messages: cached, hasMore: cached.length === limit };
//     }
//   }

//   const query = { conversationId };
//   if (before) query.createdAt = { $lt: new Date(before) };

//   let docs = await Message.find(query)
//     .sort({ createdAt: -1 })
//     .limit(parseInt(limit));

//   let messages = docs.reverse();
//   let hasMore = docs.length === parseInt(limit);

//   if (!before) {
//     setCachedMessages(conversationId, messages.slice(-20));
//   }

//   return { messages, hasMore };
// }

// async function markConversationSeen(conversationId, userId) {
//   await Message.updateMany(
//     { conversationId, seenBy: { $ne: userId } },
//     { $addToSet: { seenBy: userId } }
//   );

//   const conv = await Conversation.findById(conversationId);
//   if (conv) {
//     conv.unreadCount.set(String(userId), 0);
//     await conv.save();
//   }

//   resetUnread(userId, conversationId);
// }

// module.exports = {
//   findOrCreateConversation,
//   createMessage,
//   getMessagesPaginated,
//   markConversationSeen
// };

const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const {
  getCachedMessages,
  setCachedMessages,
  pushCachedMessage,
  incrementUnread,
  resetUnread,
} = require("../utils/chatCache");

/**
 * findOrCreateConversation(userAId, userBId)
 */
async function findOrCreateConversation(userAId, userBId) {
  const conv = await Conversation.findOne({
    participants: { $all: [userAId, userBId], $size: 2 },
  });

  if (conv) return conv;

  const created = await Conversation.create({
    participants: [userAId, userBId],
    unreadCount: {},
  });
  return created;
}

/**
 * createMessage({ conversationId, sender, text, attachment })
 */
async function createMessage({
  conversationId,
  sender,
  text = "",
  attachment = null,
}) {
  const msg = await Message.create({
    conversationId,
    sender,
    text,
    attachment,
  });

  // Update cache
  pushCachedMessage(conversationId, msg);

  // Update conversation lastMessage and unread count
  const conv = await Conversation.findById(conversationId);
  if (conv) {
    conv.lastMessage = msg._id;
    conv.participants.forEach((p) => {
      const pid = String(p);
      if (pid !== String(sender)) {
        const prev = conv.unreadCount.get(pid) || 0;
        conv.unreadCount.set(pid, prev + 1);
        incrementUnread(pid, conversationId);
      }
    });
    await conv.save();
  }

  return msg;
}

/**
 * getMessagesPaginated(conversationId, { before, limit })
 */
async function getMessagesPaginated(
  conversationId,
  { before = null, limit = 20 } = {}
) {
  // If no before and cache exists, return cached messages
  if (!before) {
    const cached = getCachedMessages(conversationId);
    if (cached) {
      const sliced = cached.slice(-limit);
      const hasMore = sliced.length === limit; // conservative
      return { messages: sliced, hasMore };
    }
  }

  const q = { conversationId };
  if (before) q.createdAt = { $lt: new Date(before) };

  const docs = await Message.find(q)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit, 10));

  const messages = docs.reverse();
  const hasMore = docs.length === parseInt(limit, 10);
  if (!before) setCachedMessages(conversationId, messages.slice(-20));
  return { messages, hasMore };
}

/**
 * markConversationSeen(conversationId, userId)
 */
async function markConversationSeen(conversationId, userId) {
  await Message.updateMany(
    { conversationId, seenBy: { $ne: userId } },
    { $addToSet: { seenBy: userId } }
  );

  const conv = await Conversation.findById(conversationId);
  if (conv) {
    conv.unreadCount.set(String(userId), 0);
    await conv.save();
  }

  resetUnread(userId, conversationId);
}

/**
 * addReaction(messageId, reaction, userId)
 */
async function addReaction(messageId, reaction, userId) {
  // Use $addToSet to avoid duplicates
  const update = { $addToSet: {} };
  update.$addToSet[`reactions.${reaction}`] = userId;
  const msg = await Message.findByIdAndUpdate(messageId, update, { new: true });
  return msg;
}

/**
 * removeReaction(messageId, reaction, userId)
 */
async function removeReaction(messageId, reaction, userId) {
  const msg = await Message.findByIdAndUpdate(
    messageId,
    { $pull: { [`reactions.${reaction}`]: userId } },
    { new: true }
  );
  return msg;
}

module.exports = {
  findOrCreateConversation,
  createMessage,
  getMessagesPaginated,
  markConversationSeen,
  addReaction,
  removeReaction,
};
