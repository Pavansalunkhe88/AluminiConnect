const Settings = require("../model/Settings");

const handleGetSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    let settings = await Settings.findOne({ user: userId });
    
    // Create default settings if not exists
    if (!settings) {
      settings = await Settings.create({ user: userId });
    }
    
    res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ success: false, message: "Server error while fetching settings" });
  }
};

const handleUpdateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = { ...req.body };
    
    // Prevent overriding the user reference or internal fields
    delete updateData.user;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Use $set to update fields cleanly without erasing unspecified nested objects if handled carefully,
    // though Mongoose will merge missing top-level keys safely with $set. 
    // To handle nested objects properly (like 'emailNotifications.messages'), we just let Mongoose replace the whole object if passed, 
    // but the frontend will send the exact full modified nested object anyway.
    
    const settings = await Settings.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    
    res.status(200).json({ success: true, settings, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ success: false, message: "Server error while updating settings" });
  }
};

module.exports = {
  handleGetSettings,
  handleUpdateSettings
};
