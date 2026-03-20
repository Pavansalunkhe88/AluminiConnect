// Notification socket handler
// Manages real-time notification delivery via Socket.IO

let ioInstance = null;

function setupNotificationSocket(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    // User joins their personal notification room
    socket.on("join-notifications", (userId) => {
      if (!userId) return;
      socket.join(`notifications:${userId}`);
      console.log(`🔔 User ${userId} joined notification room`);
    });
  });
}

// Send a real-time notification to a specific user
function sendNotification(userId, notification) {
  if (ioInstance) {
    ioInstance.to(`notifications:${String(userId)}`).emit("notification:new", notification);
  }
}

module.exports = { setupNotificationSocket, sendNotification };
