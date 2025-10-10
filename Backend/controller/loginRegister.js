
const bcrypt = require("bcrypt");
const User = require('../model/registerUser/UserScehma');
const { validateUserFromSample, validatePassword, validateEmail } = require("../utils/userRegistrationValidator");

async function handleRegisterUsers(req, res) {
  try {
    const { role, name, prn_number, emp_id, email, password } = req.body;

    // Basic field check
    if (!role || !name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    // Validate PRN or Employee ID
    const isValid = await validateUserFromSample(role, prn_number, emp_id);
    if (!isValid)
      return res
        .status(400)
        .json({
          error: `Invalid ${
            role === "Teacher" ? "Employee ID" : "PRN Number"
          } for ${role}`,
        });

    // Check for vaild
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address" });
    }

    // Check for duplicate email
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: "Email already registered" });

    // Validate password
    if (!validatePassword(password))
      return res.status(400).json({
        error:
          "Password must be at least 9 characters long and include uppercase, lowercase, number, and special character",
      });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Save user
    await User.create({
      role,
      name,
      email,
      password: hashed,
      prn_number: prn_number || null,
      emp_id: emp_id || null,
    });

    res.status(201).json({ message: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
}

module.exports = { handleRegisterUsers };
