import React, { useEffect, useRef, useState } from "react";

const Messages = () => {
  const bottomRef = useRef(null);

  const [conversations, setConversations] = useState([
    {
      id: 1,
      contact: {
        name: "Dr. Sarah Chen",
        role: "teacher",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Chen"
      },
      messages: [
        { id: 1, from: "them", text: "Please review your project.", seen: true },
        { id: 2, from: "me", text: "Sure, thank you!", seen: true }
      ]
    },
    {
      id: 2,
      contact: {
        name: "Alex Thompson",
        role: "alumni",
        avatar: "https://ui-avatars.com/api/?name=Alex+Thompson"
      },
      messages: [
        { id: 1, from: "them", text: "Happy to mentor you.", seen: false }
      ]
    }
  ]);

  const [selectedChatId, setSelectedChatId] = useState(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState(null);

  const selectedChat = conversations.find(c => c.id === selectedChatId);

  /* Auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const close = () => setActiveMessageId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  /* Send message */
  const sendMessage = () => {
    if (!input.trim() || !selectedChat) return;

    const newMsg = {
      id: Date.now(),
      from: "me",
      text: input,
      seen: false
    };

    setConversations(prev =>
      prev.map(chat =>
        chat.id === selectedChat.id
          ? { ...chat, messages: [...chat.messages, newMsg] }
          : chat
      )
    );

    setInput("");
    setTyping(true);

    setTimeout(() => receiveMessage(selectedChat.id), 1200);
  };

  /* Simulate receiving */
  const receiveMessage = (chatId) => {
    setTyping(false);

    const replies = [
      "Noted 👍",
      "Okay, will check.",
      "Thanks for the update.",
      "Sounds good."
    ];

    const reply = {
      id: Date.now(),
      from: "them",
      text: replies[Math.floor(Math.random() * replies.length)],
      seen: true
    };

    setConversations(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: chat.messages
                .map(m => m.from === "me" ? { ...m, seen: true } : m)
                .concat(reply)
            }
          : chat
      )
    );
  };

  /* Delete message */
  const deleteMessage = (msgId) => {
    setConversations(prev =>
      prev.map(chat =>
        chat.id === selectedChat.id
          ? { ...chat, messages: chat.messages.filter(m => m.id !== msgId) }
          : chat
      )
    );
  };

  /* Delete chat */
  const deleteConversation = () => {
    setConversations(prev => prev.filter(c => c.id !== selectedChatId));
    setSelectedChatId(null);
  };

  return (
    <div className="h-screen flex bg-[#f0f2f5]">

      {/* LEFT – CHAT LIST */}
      <div className="w-1/3 bg-white border-r">
        <div className="p-4 font-semibold border-b">Messages</div>

        {conversations.map(chat => (
          <div
            key={chat.id}
            onClick={() => setSelectedChatId(chat.id)}
            className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100
              ${selectedChatId === chat.id ? "bg-gray-100" : ""}
            `}
          >
            <img
              src={chat.contact.avatar}
              alt={chat.contact.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <div className="font-medium">{chat.contact.name}</div>
              <div className="text-xs text-gray-500 capitalize">
                {chat.contact.role}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {chat.messages.at(-1)?.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT – CHAT */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* HEADER */}
            <div className="p-4 bg-white border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src={selectedChat.contact.avatar}
                  alt={selectedChat.contact.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium">{selectedChat.contact.name}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {selectedChat.contact.role}
                  </div>
                </div>
              </div>
              <button
                onClick={deleteConversation}
                className="text-sm text-red-500"
              >
                Delete Chat
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 p-4 bg-[#efeae2] overflow-y-auto">
              {selectedChat.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`mb-3 flex items-end gap-2
                    ${msg.from === "me" ? "justify-end" : "justify-start"}
                  `}
                >
                  {/* Avatar for received messages */}
                  {msg.from === "them" && (
                    <img
                      src={selectedChat.contact.avatar}
                      className="w-8 h-8 rounded-full"
                      alt=""
                    />
                  )}

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMessageId(
                        activeMessageId === msg.id ? null : msg.id
                      );
                    }}
                    className={`relative px-3 py-2 rounded shadow max-w-xs cursor-pointer
                      ${msg.from === "me" ? "bg-[#d9fdd3]" : "bg-white"}
                    `}
                  >
                    <p className="text-sm">{msg.text}</p>

                    <div className="text-[10px] text-gray-400 flex justify-end">
                      {msg.from === "me" && <span>{msg.seen ? "✔✔" : "✔"}</span>}
                    </div>

                    {/* DROPDOWN */}
                    {activeMessageId === msg.id && (
                      <div className="absolute -top-2 right-0 bg-white border shadow rounded z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(msg.text);
                            setActiveMessageId(null);
                          }}
                          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                        >
                          Copy
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(msg.id);
                            setActiveMessageId(null);
                          }}
                          className="block px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {typing && (
              <p className="text-xs px-4 text-gray-500">Typing...</p>
            )}

            {/* INPUT */}
            <div className="p-3 bg-white border-t flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Type a message"
                className="flex-1 px-4 py-2 rounded-full bg-gray-100 outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-green-500 text-white px-4 rounded-full"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
