const Notification = require("../model/Notification");

// Get all notifications for the logged-in user
async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ notifications });
  } catch (err) {
    console.error("getNotifications error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Get unread count
async function getUnreadCount(req, res) {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      read: false,
    });

    res.status(200).json({ count });
  } catch (err) {
    console.error("getUnreadCount error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Mark a single notification as read
async function markAsRead(req, res) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ notification });
  } catch (err) {
    console.error("markAsRead error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Mark all notifications as read
async function markAllAsRead(req, res) {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("markAllAsRead error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
