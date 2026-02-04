// const DEFAULT_KEEP = 20;

// const chatCache = {
//   lastMessages: new Map(),
//   unreadCounts: new Map(),
//   keep: DEFAULT_KEEP
// };

// function getCachedMessages(conversationId) {
//   return chatCache.lastMessages.get(String(conversationId)) || null;
// }

// function setCachedMessages(conversationId, messages) {
//   chatCache.lastMessages.set(String(conversationId), messages.slice(-chatCache.keep));
// }

// function pushCachedMessage(conversationId, message) {
//   const key = String(conversationId);
//   let arr = chatCache.lastMessages.get(key) || [];
//   arr.push(message);

//   if (arr.length > chatCache.keep) {
//     arr.splice(0, arr.length - chatCache.keep);
//   }

//   chatCache.lastMessages.set(key, arr);
// }

// function incrementUnread(userId, conversationId) {
//   const u = String(userId);
//   const c = String(conversationId);

//   let userMap = chatCache.unreadCounts.get(u) || new Map();
//   let prev = userMap.get(c) || 0;

//   userMap.set(c, prev + 1);
//   chatCache.unreadCounts.set(u, userMap);
// }

// function resetUnread(userId, conversationId) {
//   const u = String(userId), c = String(conversationId);
//   let userMap = chatCache.unreadCounts.get(u) || new Map();
//   userMap.set(c, 0);
//   chatCache.unreadCounts.set(u, userMap);
// }

// module.exports = {
//   chatCache,
//   getCachedMessages,
//   setCachedMessages,
//   pushCachedMessage,
//   incrementUnread,
//   resetUnread
// };


// In-memory cache utilities. Replace internals with Redis calls in prod.

const DEFAULT_KEEP = 20;

// Internal maps (module private)
const _lastMessages = new Map(); // Map<conversationId, Array<message>>
const _unreadCounts = new Map(); // Map<userId, Map<conversationId, count>>
let _keep = DEFAULT_KEEP;

function setKeep(n) {
  _keep = parseInt(n, 10) || DEFAULT_KEEP;
}

function getKeep() {
  return _keep;
}

function getCachedMessages(conversationId) {
  return _lastMessages.has(String(conversationId))
    ? [..._lastMessages.get(String(conversationId))]
    : null;
}

function setCachedMessages(conversationId, messages) {
  const arr = Array.isArray(messages) ? messages.slice(-_keep) : [];
  _lastMessages.set(String(conversationId), arr);
}

function pushCachedMessage(conversationId, message) {
  const key = String(conversationId);
  const arr = _lastMessages.get(key) || [];
  arr.push(message);
  if (arr.length > _keep) {
    arr.splice(0, arr.length - _keep);
  }
  _lastMessages.set(key, arr);
}

function clearCachedMessages(conversationId) {
  if (conversationId) _lastMessages.delete(String(conversationId));
  else _lastMessages.clear();
}

function incrementUnread(userId, conversationId) {
  const user = String(userId),
    conversation = String(conversationId);
  const userMap = _unreadCounts.get(user) || new Map();
  const prev = userMap.get(conversation) || 0;
  userMap.set(conversation, prev + 1);
  _unreadCounts.set(user, userMap);
}

function resetUnread(userId, conversationId) {
  const user = String(userId),
    conversation = String(conversationId);
  const userMap = _unreadCounts.get(user) || new Map();
  userMap.set(conversation, 0);
  _unreadCounts.set(user, userMap);
}

function getUnread(userId, conversationId) {
  const user = String(userId),
    conversation = String(conversationId);
  const userMap = _unreadCounts.get(user);
  if (!userMap) return 0;
  return userMap.get(conversation) || 0;
}

function clearAll() {
  _lastMessages.clear();
  _unreadCounts.clear();
}

module.exports = {
  // keep control
  setKeep,
  getKeep,

  // messages cache
  getCachedMessages,
  setCachedMessages,
  pushCachedMessage,
  clearCachedMessages,

  // unread counters
  incrementUnread,
  resetUnread,
  getUnread,

  // dev helper
  clearAll,
};
