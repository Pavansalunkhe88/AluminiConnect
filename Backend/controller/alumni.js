const User = require("../model/registerUser/UserScehma");
const bcrypt = require("bcrypt");

async function getAllAlumni(req, res) {
  res.send("Get all Alumni");
}

async function getAlumniById(req, res) {
  const { id } = req.params;
  res.send(`Get Alumni with ID: ${id}`);
}

async function createAlumni(req, res) {
  const data = req.body;
  res.send(`Create Alumni with data: ${JSON.stringify(data)}`);
}

async function handleUpdateAlumniProfile(req, res) {
  try {
    const id = req.user?.id;
    const { email, password, name } = req.body;

    const alumni = await User.findById(id);

    if (!alumni) return res.status(404).json({ message: "Alumni not found" });

    if (alumni.role !== "alumni")
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
      
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if (email) alumni.email = email;
    if (name) alumni.name = name;
    if (password) alumni.password = await bcrypt.hash(password, 10);

    await alumni.save();

    const { password: _, __v, ...safeAlumni } = alumni.toObject();


    res.status(200).json({
      message: "Alumni updated sucessfully",
      alumni: safeAlumni,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
}

async function handleDeleteAlumni(req, res) {
  try {
    const id = req.user?.id;
    const deletedAlumni = await User.findByIdAndDelete(id);

    if (!deletedAlumni)
      return res.status(404).json({ message: "Alumni not found" });

    res
      .status(200)
      .json({ message: "Deleted alumni sucessfully", deleteAlumni });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
}

async function handleGetUserById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-password -__v");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User retrieved sucessfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
}

async function handleGetProfile(req, res) {
  try {
    const id = req.user?.id;
    const alumniProfile = await User.findById(id).select("-password -__v");
    if (!alumniProfile)
      return res.status(404).json({ message: "Can't find User" });
    res
      .status(200)
      .json({ message: "User retrieved sucessfuly", alumniProfile });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
}

// async function deleteAlumni(req, res) {
//   const { id } = req.params;
//   res.send(`Delete Alumni with ID: ${id}`);
// }

module.exports = {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  handleUpdateAlumniProfile,
  handleDeleteAlumni,
  handleGetUserById,
  handleGetProfile,
  handleGetUserById
};
