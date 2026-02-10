// // /backend/chat/sockets/chatSocket.js

// // MODELS
// const Conversation = require("../models/Conversation");
// const Message = require("../models/Message");

// // CACHE UTILS
// const {
//   pushCachedMessage,
//   incrementUnread,
//   resetUnread
// } = require("../utils/chatCache");

// // MAIN SOCKET FUNCTION
// function setupChatSocket(io) {
//   io.on("connection", (socket) => {
//     console.log("⚡ New socket connected:", socket.id);

//     // 1. JOIN USER ROOM (required for private messaging)

//     socket.on("join", (userId) => {
//       if (!userId) return;

//       socket.join(String(userId));
//       console.log(`🔗 User ${userId} joined personal room`);
//     });

//     // 2. SEND MESSAGE EVENT

//     socket.on("sendMessage", async (payload) => {
//       try {
//         // Validate payload (PROTECT BACKEND)
//         if (
//           !payload ||
//           !payload.from ||
//           !payload.to ||
//           (!payload.text && !payload.attachment)
//         ) {
//           return socket.emit("error", { message: "Invalid message payload" });
//         }

//         const { conversationId, from, to, text, attachment, tempId } = payload;

//         let conv = null;
//         let convId = conversationId;

//         // (A) FIND / CREATE CONVERSATION — with single DB access

//         if (!convId) {
//           conv = await Conversation.findOne({
//             participants: { $all: [from, to], $size: 2 }
//           });

//           // create new conversation if needed
//           if (!conv) {
//             conv = await Conversation.create({
//               participants: [from, to],
//               unreadCount: {}
//             });
//           }

//           convId = conv._id;
//         } else {
//           // if conversationId provided — fetch once
//           conv = await Conversation.findById(convId);
//         }

//         if (!conv) {
//           return socket.emit("error", { message: "Conversation not found" });
//         }

//         // (B) CREATE MESSAGE (DB WRITE)

//         const newMessage = await Message.create({
//           conversationId: convId,
//           sender: from,
//           text,
//           attachment
//         });

//         // (C) UPDATE CONVERSATION UNREAD & LAST MESSAGE — 1 write

//         conv.lastMessage = newMessage._id;

//         conv.participants.forEach((p) => {
//           const pid = String(p);
//           if (pid !== String(from)) {
//             const prev = conv.unreadCount.get(pid) || 0;
//             conv.unreadCount.set(pid, prev + 1);
//             incrementUnread(pid, convId);  // cache update
//           }
//         });

//         await conv.save();

//         // (D) CACHE UPDATE — keep recent 20 messages in RAM

//         pushCachedMessage(convId, newMessage);

//         // (E) SEND BACK TO SENDER (ack with tempId)

//         io.to(String(from)).emit("message:sent", {
//           message: newMessage,
//           tempId
//         });

//         //  (F) SEND MESSAGE TO RECEIVER

//         io.to(String(to)).emit("message:new", {
//           message: newMessage
//         });

//         // (G) UPDATE BOTH SIDEBARS

//         io.to(String(from)).emit("conversation:update", {
//           conversationId: convId,
//           lastMessage: newMessage
//         });

//         io.to(String(to)).emit("conversation:update", {
//           conversationId: convId,
//           lastMessage: newMessage
//         });

//       } catch (err) {
//         console.error("❌ sendMessage error:", err);
//         socket.emit("error", { message: "Failed to send message" });
//       }
//     });

//     // 3. SEEN EVENT — mark messages as seen

//     socket.on("seen", async ({ conversationId, userId }) => {
//       try {
//         if (!conversationId || !userId) return;

//         // Update only unseen messages — NOT all messages (performance)
//         await Message.updateMany(
//           { conversationId, seenBy: { $ne: userId } },
//           { $addToSet: { seenBy: userId } }
//         );

//         // Update unread counter
//         const conv = await Conversation.findById(conversationId);
//         if (conv) {
//           conv.unreadCount.set(String(userId), 0);
//           await conv.save();
//         }

//         resetUnread(userId, conversationId);

//         // Broadcast seen event
//         if (conv && conv.participants) {
//           conv.participants.forEach((p) => {
//             io.to(String(p)).emit("message:seen", {
//               conversationId,
//               userId
//             });
//           });
//         }

//       } catch (err) {
//         console.error("❌ seen error:", err);
//       }
//     });

//     // 4. ADD REACTION

//     socket.on("addReaction", async ({ messageId, reaction, userId }) => {
//       try {
//         if (!messageId || !reaction || !userId) return;

//         const msg = await Message.findByIdAndUpdate(
//           messageId,
//           { $addToSet: { [`reactions.${reaction}`]: userId } },
//           { new: true }
//         );

//         if (!msg) return;

//         const conv = await Conversation.findById(msg.conversationId);
//         if (!conv) return;

//         conv.participants.forEach((p) => {
//           io.to(String(p)).emit("message:reaction", { message: msg });
//         });

//       } catch (err) {
//         console.error("❌ addReaction error:", err);
//       }
//     });

//     // 5. REMOVE REACTION

//     socket.on("removeReaction", async ({ messageId, reaction, userId }) => {
//       try {
//         if (!messageId || !reaction || !userId) return;

//         const msg = await Message.findByIdAndUpdate(
//           messageId,
//           { $pull: { [`reactions.${reaction}`]: userId } },
//           { new: true }
//         );

//         if (!msg) return;

//         const conv = await Conversation.findById(msg.conversationId);
//         if (!conv) return;

//         conv.participants.forEach((p) => {
//           io.to(String(p)).emit("message:reaction", { message: msg });
//         });

//       } catch (err) {
//         console.error("❌ removeReaction error:", err);
//       }
//     });

//     // 6. DISCONNECT EVENT

//     socket.on("disconnect", () => {
//       console.log("🔌 Socket disconnected:", socket.id);
//     });

//   }); // end io.on
// }

// module.exports = setupChatSocket;

// backend/chat/sockets/chatSocket.js

const chatService = require("../services/chatService");
const jwt = require("jsonwebtoken");

/**
 * Assumptions (MANDATORY):
 * 1. Socket authentication middleware already attaches:
 *    socket.user = { _id: ObjectId }
 * 2. chatService methods are production-safe:
 *    - findOrCreateConversation
 *    - createMessage
 *    - getMessagesPaginated
 *    - markConversationSeen
 *    - addReaction
 *    - removeReaction
 */

function setupChatSocket(io) {
  // ---- SOCKET AUTH GUARD (HARD REQUIREMENT) ----
  // io.use((socket, next) => {
  //   if (!socket.request.user || !socket.request.user.id) {
  //     return next(new Error("Unauthorized socket connection"));
  //   }
  //   socket.userId = String(socket.request.user.id);
  //   next();
  // });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Missing auth token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Attach user to socket
      socket.user = decoded;
      socket.userId = String(decoded.id);

      next();
    } catch (err) {
      return next(new Error("Invalid auth token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("⚡ Socket connected:", socket.id, "User:", socket.userId);

    // 1. JOIN PERSONAL ROOM (NO USER ID FROM CLIENT)

    socket.on("join", () => {
      socket.join(socket.userId);
    });

    // 2. SEND MESSAGE
    // payload: { conversationId?, to, text?, attachment?, tempId }

    socket.on("sendMessage", async (payload) => {
      try {
        if (
          !payload ||
          (!payload.conversationId && !payload.to) ||
          (!payload.text && !payload.attachment)
        ) {
          return socket.emit("error", { message: "Invalid payload" });
        }

        const sender = socket.userId;
        const {
          conversationId,
          to,
          text = "",
          attachment = null,
          tempId,
        } = payload;

        let convId = conversationId;

        // Create conversation if needed
        if (!convId) {
          const conv = await chatService.findOrCreateConversation(
            sender,
            String(to),
          );
          convId = conv._id;
        }

        // Create message (ENCRYPTED inside service)
        const message = await chatService.createMessage({
          conversationId: convId,
          sender,
          text,
          attachment,
        });

        // Ack to sender
        io.to(sender).emit("message:sent", {
          message,
          tempId,
        });

        // Deliver to receiver
        if (to) {
          io.to(String(to)).emit("message:new", {
            message,
          });
        }

        // Sidebar update
        io.to(sender).emit("conversation:update", {
          conversationId: convId,
          lastMessage: message,
        });

        if (to) {
          io.to(String(to)).emit("conversation:update", {
            conversationId: convId,
            lastMessage: message,
          });
        }
      } catch (err) {
        console.error("sendMessage socket error:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // 3. MARK CONVERSATION SEEN
    // payload: { conversationId }

    socket.on("seen", async ({ conversationId }) => {
      try {
        if (!conversationId) return;

        // Mark messages as seen in DB
        await chatService.markConversationSeen(conversationId, socket.userId);

        // Fetch conversation to get all participants
        const Conversation = require("../models/Conversation");
        const conv = await Conversation.findById(conversationId);
        
        if (!conv) return;

        // Broadcast to ALL participants that this user has seen the conversation
        conv.participants.forEach((p) => {
          io.to(String(p)).emit("messages:seen", {
            conversationId,
            userId: socket.userId,
          });
        });
      } catch (err) {
        console.error("seen socket error:", err);
      }
    });

    // 4. ADD REACTION
    // payload: { messageId, reaction }

    socket.on("addReaction", async ({ messageId, reaction }) => {
      try {
        if (!messageId || !reaction) return;

        const msg = await chatService.addReaction(
          messageId,
          reaction,
          socket.userId,
        );

        if (!msg) return;

        io.to(socket.userId).emit("message:reaction", { message: msg });
      } catch (err) {
        console.error("addReaction socket error:", err);
      }
    });

    // 5. REMOVE REACTION
    // payload: { messageId, reaction }

    socket.on("removeReaction", async ({ messageId, reaction }) => {
      try {
        if (!messageId || !reaction) return;

        const msg = await chatService.removeReaction(
          messageId,
          reaction,
          socket.userId,
        );

        if (!msg) return;

        io.to(socket.userId).emit("message:reaction", { message: msg });
      } catch (err) {
        console.error("removeReaction socket error:", err);
      }
    });

    // 6. DISCONNECT
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

module.exports = setupChatSocket;
