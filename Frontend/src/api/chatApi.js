import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/chat",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getConversations = async () => {
  const res = await API.get("/conversations");
  return res.data.conversations;
};

export const getMessages = async (conversationId) => {
  const res = await API.get(`/messages/${conversationId}`);
  return res.data.messages;
};

// export const sendMessage = async (payload) => {
//   // payload: { conversationId?, to?, text, attachment? }
//   const res = await API.post("/messages", payload);
//   return res.data.message;
// };

export const markSeen = async (conversationId) => {
  await API.post("/seen", { conversationId });
};

export const reactMessage = async (payload) => {
  await API.post("/reaction", payload);
};

export const postMessage = async (payload) => {
  // payload: { conversationId?, to?, text, attachment? }
  const res = await API.post("/messages", payload);
  return res.data.message;
};

export const deleteConversation = async (otherUserId) => {
  const res = await API.delete(`/conversation/${otherUserId}`, {
    withCredentials: true,
  });

  return res.data;
};