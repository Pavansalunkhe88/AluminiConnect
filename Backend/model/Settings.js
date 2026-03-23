const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "light"
    },
    language: {
      type: String,
      default: "en"
    },
    emailNotifications: {
      messages: { type: Boolean, default: true },
      updates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false }
    },
    pushNotifications: {
      messages: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true }
    },
    privacy: {
      profileVisibility: { type: String, enum: ["public", "connections", "private"], default: "public" },
      showEmail: { type: Boolean, default: false }
    },
    twoFactorAuth: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
