// const Conversation = require("../models/Conversation");
// const Message = require("../models/Message");
// const {
//   pushCachedMessage,
//   incrementUnread,
//   resetUnread,
// } = require("../utils/chatCache");

// function setupChatSocket(io) {
//   io.on("connection", (socket) => {
//     console.log("Socket connected: ", socket.id);

//     socket.on("join", (userId) => {
//       try {
//         socket.join(String(userId));
//       } catch (err) {
//         console.error("join error", err);
//       }
//     });

//     socket.on("sendMessage", async (payload) => {
//       // payload: { conversationId (optional), to, text, attachment, tempId, from }
//       try {
//         const { conversationId, to, text, attachment, tempId, from } = payload;
//         let convId = conversationId;

//         if (!convId) {
//           // find or create 1-to-1 conv
//           let conv = Conversation.findOne({
//             participants: { $all: [from, to] },
//             $expr: { $eq: [{ $size: "$participants" }, 2] },
//           });

//           if (!conv) {
//             conv = await Conversation.create({
//               participants: [from, to],
//               unreadCount: {},
//             });
//           }
//           convId = conv._id;
//         }

//         const message = await Message.create({
//           conversationId: convId,
//           sender: from,
//           text,
//           attachment,
//         });

//         // update conversation lastMessage and unread
//         const conv = await Conversation.findById(convId);
//         if (conv) {
//           conv.lastMessage = message._id;
//           conv.participants.forEach((p) => {
//             if (String(p) !== String(from)) {
//               const prev = conv.unreadCount.get(String(p)) || 0;
//               conv.unreadCount.set(String(p), prev + 1);
//               incrementUnread(p, convId);
//             }
//           });
//           await conv.save();
//         }

//         // update cache
//         pushCachedMessage(convId, message);

//         // emit ack to sender and new message to recipient
//         io.to(String(from)).emit("message:sent", { message, tempId });
//         io.to(String(to)).emit("message:new", { message });

//         // emit conversation update for sidebar
//         io.to(String(to)).emit("conversation:update", {
//           conversationId: convId,
//           lastMessage: message,
//         });
//         io.to(String(from)).emit("conversation:update", {
//           conversationId: convId,
//           lastMessage: message,
//         });
//       } catch (err) {
//         console.error("sendMessage error:", err);
//         socket.emit("error", { message: "Failed to send message" });
//       }
//     });

//     socket.on("seen", async ({ conversationId, userId }) => {
//       try {
//         await Message.updateMany(
//           { conversationId, seenBy: { $ne: userId } },
//           { $addToSet: { seenBy: userId } }
//         );
//         const conv = await Conversation.findById(conversationId);
//         if (conv) {
//           conv.unreadCount.set(String(userId), 0);
//           await conv.save();
//         }
//         resetUnread(userId, conversationId);
//         if (conv && conv.participants) {
//           conv.participants.forEach((p) => {
//             io.to(String(p)).emit("message:seen", { conversationId, userId });
//           });
//         }
//       } catch (err) {
//         console.error("seen socket error:", err);
//       }
//     });

//     socket.on("addReaction", async ({ messageId, reaction, userId }) => {
//       try {
//         const msg = await Message.findByIdAndUpdate(
//           messageId,
//           { $addToSet: { [`reactions.${reaction}`]: userId } },
//           { new: true }
//         );
//         if (msg) {
//           const conv = await Conversation.findById(msg.conversationId);
//           if (conv && conv.participants) {
//             conv.participants.forEach((p) =>
//               io.to(String(p)).emit("message:reaction", { message: msg })
//             );
//           }
//         }
//       } catch (err) {
//         console.error("addReaction error:", err);
//       }
//     });

//     socket.on("removeReaction", async ({ messageId, reaction, userId }) => {
//       try {
//         const msg = await Message.findByIdAndUpdate(
//           messageId,
//           { $pull: { [`reactions.${reaction}`]: userId } },
//           { new: true }
//         );
//         if (msg) {
//           const conv = await Conversation.findById(msg.conversationId);
//           if (conv && conv.participants) {
//             conv.participants.forEach((p) =>
//               io.to(String(p)).emit("message:reaction", { message: msg })
//             );
//           }
//         }
//       } catch (err) {
//         console.error("removeReaction error:", err);
//       }
//     });

//     socket.on("disconnect", () => {
//       // any cleanup if needed
//     });
//   });
// }

// module.exports = setupChatSocket;



// /backend/chat/sockets/chatSocket.js

// MODELS
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// CACHE UTILS
const {
  pushCachedMessage,
  incrementUnread,
  resetUnread
} = require("../utils/chatCache");


// MAIN SOCKET FUNCTION
function setupChatSocket(io) {
  io.on("connection", (socket) => {
    console.log("⚡ New socket connected:", socket.id);

    
    // 1. JOIN USER ROOM (required for private messaging)
    

    socket.on("join", (userId) => {
      if (!userId) return;

      socket.join(String(userId));
      console.log(`🔗 User ${userId} joined personal room`);
    });


    
    // 2. SEND MESSAGE EVENT
    

    socket.on("sendMessage", async (payload) => {
      try {
        // Validate payload (PROTECT BACKEND)
        if (
          !payload ||
          !payload.from ||
          !payload.to ||
          (!payload.text && !payload.attachment)
        ) {
          return socket.emit("error", { message: "Invalid message payload" });
        }

        const { conversationId, from, to, text, attachment, tempId } = payload;

        let conv = null;
        let convId = conversationId;

        
        // (A) FIND / CREATE CONVERSATION — with single DB access
        

        if (!convId) {
          conv = await Conversation.findOne({
            participants: { $all: [from, to], $size: 2 }
          });

          // create new conversation if needed
          if (!conv) {
            conv = await Conversation.create({
              participants: [from, to],
              unreadCount: {}
            });
          }

          convId = conv._id;
        } else {
          // if conversationId provided — fetch once
          conv = await Conversation.findById(convId);
        }

        if (!conv) {
          return socket.emit("error", { message: "Conversation not found" });
        }

       
        // (B) CREATE MESSAGE (DB WRITE)
        

        const newMessage = await Message.create({
          conversationId: convId,
          sender: from,
          text,
          attachment
        });


        
        // (C) UPDATE CONVERSATION UNREAD & LAST MESSAGE — 1 write
        
        conv.lastMessage = newMessage._id;

        conv.participants.forEach((p) => {
          const pid = String(p);
          if (pid !== String(from)) {
            const prev = conv.unreadCount.get(pid) || 0;
            conv.unreadCount.set(pid, prev + 1);
            incrementUnread(pid, convId);  // cache update
          }
        });

        await conv.save();

        // (D) CACHE UPDATE — keep recent 20 messages in RAM
        
        pushCachedMessage(convId, newMessage);

        // (E) SEND BACK TO SENDER (ack with tempId)
        
        io.to(String(from)).emit("message:sent", {
          message: newMessage,
          tempId
        });

        //  (F) SEND MESSAGE TO RECEIVER
        
        io.to(String(to)).emit("message:new", {
          message: newMessage
        });
      
        // (G) UPDATE BOTH SIDEBARS
        
        io.to(String(from)).emit("conversation:update", {
          conversationId: convId,
          lastMessage: newMessage
        });

        io.to(String(to)).emit("conversation:update", {
          conversationId: convId,
          lastMessage: newMessage
        });


      } catch (err) {
        console.error("❌ sendMessage error:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });
    
    // 3. SEEN EVENT — mark messages as seen
    
    socket.on("seen", async ({ conversationId, userId }) => {
      try {
        if (!conversationId || !userId) return;

        // Update only unseen messages — NOT all messages (performance)
        await Message.updateMany(
          { conversationId, seenBy: { $ne: userId } },
          { $addToSet: { seenBy: userId } }
        );

        // Update unread counter
        const conv = await Conversation.findById(conversationId);
        if (conv) {
          conv.unreadCount.set(String(userId), 0);
          await conv.save();
        }

        resetUnread(userId, conversationId);

        // Broadcast seen event
        if (conv && conv.participants) {
          conv.participants.forEach((p) => {
            io.to(String(p)).emit("message:seen", {
              conversationId,
              userId
            });
          });
        }

      } catch (err) {
        console.error("❌ seen error:", err);
      }
    });


    
    // 4. ADD REACTION
    

    socket.on("addReaction", async ({ messageId, reaction, userId }) => {
      try {
        if (!messageId || !reaction || !userId) return;

        const msg = await Message.findByIdAndUpdate(
          messageId,
          { $addToSet: { [`reactions.${reaction}`]: userId } },
          { new: true }
        );

        if (!msg) return;

        const conv = await Conversation.findById(msg.conversationId);
        if (!conv) return;

        conv.participants.forEach((p) => {
          io.to(String(p)).emit("message:reaction", { message: msg });
        });

      } catch (err) {
        console.error("❌ addReaction error:", err);
      }
    });


   
    // 5. REMOVE REACTION
    

    socket.on("removeReaction", async ({ messageId, reaction, userId }) => {
      try {
        if (!messageId || !reaction || !userId) return;

        const msg = await Message.findByIdAndUpdate(
          messageId,
          { $pull: { [`reactions.${reaction}`]: userId } },
          { new: true }
        );

        if (!msg) return;

        const conv = await Conversation.findById(msg.conversationId);
        if (!conv) return;

        conv.participants.forEach((p) => {
          io.to(String(p)).emit("message:reaction", { message: msg });
        });

      } catch (err) {
        console.error("❌ removeReaction error:", err);
      }
    });


    
    // 6. DISCONNECT EVENT
    

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected:", socket.id);
    });

  }); // end io.on
}

module.exports = setupChatSocket;
