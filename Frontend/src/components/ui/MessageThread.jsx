// import React, { useState, useRef, useEffect } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import MessageBubble from './MessageBubble';

// const MessageThread = ({ contact, onClose }) => {
//   const { user } = useAuth();
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       sender: contact.name,
//       content: 'Hi! I wanted to discuss the upcoming project.',
//       timestamp: '10:30 AM',
//       isOwn: false
//     },
//     {
//       id: 2,
//       sender: user.name,
//       content: 'Sure, what would you like to know?',
//       timestamp: '10:32 AM',
//       isOwn: true
//     },
//     {
//       id: 3,
//       sender: contact.name,
//       content: 'I have some questions about the requirements.',
//       timestamp: '10:35 AM',
//       isOwn: false
//     }
//   ]);
//   const [newMessage, setNewMessage] = useState('');
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const message = {
//       id: Date.now(),
//       sender: user.name,
//       content: newMessage,
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       isOwn: true
//     };

//     setMessages([...messages, message]);
//     setNewMessage('');
//   };

//   return (
//     <div className="flex flex-col h-full">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b bg-white">
//         <div className="flex items-center space-x-3">
//           <img
//             src={contact.avatar}
//             alt={contact.name}
//             className="w-10 h-10 rounded-full"
//           />
//           <div>
//             <h3 className="font-semibold text-gray-900">{contact.name}</h3>
//             <p className="text-sm text-gray-500 capitalize">{contact.role}</p>
//           </div>
//         </div>
//         <button
//           onClick={onClose}
//           className="text-gray-400 hover:text-gray-600"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {messages.map(message => (
//           <MessageBubble
//             key={message.id}
//             message={message}
//             isOwn={message.isOwn}
//           />
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Message Input */}
//       <div className="p-4 border-t bg-white">
//         <form onSubmit={handleSendMessage} className="flex space-x-2">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MessageThread;

// import React, { useState, useRef, useEffect } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import MessageBubble from "./MessageBubble";
// import { socket } from "../../api/socket";

// import axios from "axios";

// const MessageThread = ({ contact, onClose }) => {
//   const { user } = useAuth();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   const messagesEndRef = useRef(null);

//   // Scroll always to latest message
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // 1️⃣ Load previous messages when conversation opens
//   useEffect(() => {
//     if (!contact?._id || !user?._id) return;

//     async function loadMessages() {
//       const convRes = await axios.get(
//         `http://localhost:4000/api/chat/messages/${contact.conversationId}`
//       );

//       setMessages(convRes.data.messages);
//     }

//     loadMessages();
//   }, [contact, user]);

//   // 2️⃣ Listen for incoming messages from Socket.IO
//   useEffect(() => {
//     socket.on("message:new", ({ message }) => {
//       if (
//         message.sender === contact._id ||
//         message.sender === user._id
//       ) {
//         setMessages((prev) => [...prev, message]);
//       }
//     });

//     return () => socket.off("message:new");
//   }, [contact, user]);

//   // 3️⃣ Send message function
//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const payload = {
//       from: user._id,
//       to: contact._id,
//       text: newMessage,
//       tempId: Date.now(),
//     };

//     // Optimistic UI
//     setMessages((prev) => [
//       ...prev,
//       {
//         ...payload,
//         sender: user._id,
//         content: newMessage,
//         isOwn: true,
//       },
//     ]);

//     socket.emit("sendMessage", payload);

//     setNewMessage("");
//   };

//   return (
//     <div className="flex flex-col h-full">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b bg-white">
//         <div className="flex items-center space-x-3">
//           <img
//             src={contact.avatar}
//             alt={contact.name}
//             className="w-10 h-10 rounded-full"
//           />
//           <div>
//             <h3 className="font-semibold text-gray-900">{contact.name}</h3>
//             <p className="text-sm text-gray-500 capitalize">{contact.role}</p>
//           </div>
//         </div>
//         <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//           X
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {messages.map((message) => (
//           <MessageBubble
//             key={message._id || message.tempId}
//             message={message}
//             isOwn={message.sender === user._id}
//           />
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="p-4 border-t bg-white">
//         <form onSubmit={handleSendMessage} className="flex space-x-2">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//           >
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MessageThread;

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import MessageBubble from "./MessageBubble";
import { socket } from "../../api/socket";
import { getMessages, postMessage, markSeen, deleteConversation  } from "../../api/chatApi";

const MessageThread = ({ contact, onClose }) => {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- LOAD MESSAGES + MARK SEEN ----------------
  useEffect(() => {
    if (!contact?.id) return;

    let mounted = true;

    (async () => {
      const msgs = await getMessages(contact.id);
      if (mounted) {
        setMessages(msgs);
        await markSeen(contact.id);
        // Emit socket event to notify all participants
        socket.emit("seen", { conversationId: contact.id });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [contact]);

  // ---------------- SOCKET LISTENER FOR NEW MESSAGES ----------------
  useEffect(() => {
    if (!contact?.id) return;

    const handler = ({ message }) => {
      if (message.conversationId === contact.id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("message:new", handler);
    return () => socket.off("message:new", handler);
  }, [contact]);

  // ---------------- SOCKET LISTENER FOR MESSAGES SEEN ----------------
  useEffect(() => {
    if (!contact?.id) return;

    const seenHandler = ({ conversationId, userId }) => {
      if (conversationId === contact.id && userId !== user._id) {
        // Other user has seen the messages
        // Mark all our sent messages in this conversation as seen
        setMessages((prev) =>
          prev.map((m) =>
            m.sender === user._id ? { ...m, seenBy: [userId] } : m
          )
        );
      }
    };

    socket.on("messages:seen", seenHandler);
    return () => socket.off("messages:seen", seenHandler);
  }, [contact, user]);

  // ---------------- SEND MESSAGE ----------------
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const optimistic = {
      _id: `temp-${Date.now()}`,
      sender: user._id,
      text: newMessage,
      createdAt: new Date().toISOString(),
      conversationId: contact.id,
    };

    setMessages((prev) => [...prev, optimistic]);
    setNewMessage("");

    try {
      await postMessage({
        conversationId: contact.id,
        text: optimistic.text,
      });
    } catch {
      // rollback
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
    }
  };

  const handleDeleteChat = async () => {
    if (!contact?.partner?.id) return;

    const confirmDelete = window.confirm(
      "This conversation will be removed only for you. Continue?",
    );

    if (!confirmDelete) return;

    try {
      await deleteConversation(contact.partner.id);

      // Clear messages
      setMessages([]);

      // Close chat panel
      onClose();
    } catch (err) {
      console.error("Failed to delete conversation", err);
      alert("Failed to delete conversation");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <img
            src={contact.partner?.avatar}
            alt={contact.partner?.name || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-gray-900">
              {contact.partner?.name || "Unknown User"}
            </div>
            <div className="text-sm text-gray-500">
              {contact.partner?.role || ""}
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={handleDeleteChat}
            className="px-4 py-2 text-red-500 hover:bg-gray-100 rounded"
          >
            Delete Chat
          </button>
        </div>

        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <MessageBubble
            key={m._id}
            message={m}
            isOwn={m.sender === user._id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageThread;
