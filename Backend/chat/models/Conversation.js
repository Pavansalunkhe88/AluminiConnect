const mongoose = require('mongoose');


const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ],
  // for faster sidebar loading
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null
  },
  unreadCount: {
    type: Map,  
    of: Number,  
    default: {}  
    // example:
    // { "userId1": 0, "userId2": 5 }
  }
}, { timestamps: true });


// INDEXES
conversationSchema.index({ conversationId: 1, createdAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;