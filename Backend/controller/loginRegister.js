const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/registerUser/UserScehma");
const {
  validateUserFromSample,
  validatePassword,
  validateEmail,
} = require("../utils/userRegistrationValidator");
const SuperAdmin = require("../model/SuperAdmin");

async function handleRegisterUsers(req, res) {
  try {
    const { role, name, prn_number, emp_id, email, password } = req.body;
    console.log("request body :", req.body);
    //const normalizedRole = role.toLowerCase();
    // Basic field check
    if (!role || !name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    // Validate PRN or Employee ID
    const isValid = await validateUserFromSample(role, prn_number, emp_id);
    if (!isValid)
      return res.status(400).json({
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
    const orConditions = [{ email }];
    if (prn_number) orConditions.push({ prn_number });
    if (emp_id) orConditions.push({ emp_id });

    const existing = await User.findOne({ $or: orConditions });

    if (existing) {
      return res.status(409).json({ error: "User already registered" });
    }

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
      //role: normalizedRole,
      role,
      name,
      email,
      password: hashed,
      prn_number: prn_number || null,
      emp_id: emp_id || null,
    });

    res.status(201).json({ message: "Registration successful!" });
  } catch (err) {
    console.error("Registration Error:", err);

    // Handle duplicate key error (E11000)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        error: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already registered`,
      });
    }

    // Default server error
    res.status(500).json({ error: "Server error", details: err.message });
  }
}

async function handleUserLogin(req, res) {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Invalid request format" });
    }

    console.log("Request body:", req.body);

    const { email, password, role } = req.body;
    const normalizedRole = role.toLowerCase();

    // Validate input
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email, password and role are required" });
    }

    // Check if user exists
    const user = await User.findOne({
      email,
      role: { $regex: new RegExp(`^${role}$`, "i") },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Success
    /* return res.status(200).json({
      message: `Welcome back ${user.name}`,
      role: user.role,
    }); */

    const token = jwt.sign(
      { id: user._id, role: user.role }, // this is the data we convert into token
      process.env.JWT_SECRET_KEY, // secret key (stored in .env)
      { expiresIn: "24h" } // optional expiry time
    );

    res.cookie("accessToken", token, {
      httpOnly: true, //It's a security flag. It means JavaScript running in the browser cannot read this cookie.
      secure: process.env.NODE_ENV === "production", //The cookie will be sent only over HTTPS connections if this is true.
      sameSite: "Lax", //Can work on different domains ex- we have separate frontend domain as well as backend domain
      maxAge: 24 * 60 * 60 * 1000, // 24 hour
    });

    // switch (user.role) {
    //   case "teacher":
    //     return res.redirect("/api/teacher/dashboard");
    //   case "admin":
    //     return res.redirect("/api/admin/dashboard");
    //   case "student":
    //     return res.redirect("/api/student/dashboard");
    //   case "alumni":
    //     return res.redirect("/api/alumni/dashboard");
    //   case "superadmin":
    //     return res.redirect("/api/super-admin/dashboard");
    //   default:
    //     return res.status(403).json({ message: "Unauthorized role" });
    // }

    return res.status(200).json({
      message: `Welcome back ${user.name}`,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        // email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// async function getUser(token) {
//   let user = req.cookie?.token;
//   try {
//     if (!user) res.status(400).json({ message: "Token is invalid" });
//     res.status(200).redirect(`/${user.role}/dashboard`);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: err.message });
//   }
// }

async function getLoginPage(req, res) {
  res.send("Welcome to Login Page");
}

async function getRegisterPage(req, res) {
  res.send("Welcome to Registration Page");
}

/*
async function handleRegisterAdmin(req, res) {
  const token = req.cookies?.accessToken;
  if (!token)
    return res.status(401).json({ message: "Unauthorized: No token" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const isSuperAdmin = await SuperAdmin.findById(user.id);

    if (!isSuperAdmin || user.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "Access denied: Not a SuperAdmin" });
    }
    const { role, emp_id, email, password, name } = req.body;

    if (!role || !emp_id || !email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name: name,
      role: role,
      email: email,
      password: hashedPassword,
      emp_id: emp_id,
      createdBy: user.id,
    });

    return res.status(200).json({ message: "Created admin sucessfully." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
}
*/

async function handleRegisterAdmin(req, res) {
  try {
    const { role, emp_id, email, password, name } = req.body;

    if (!role || !emp_id || !email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      role,
      email,
      password: hashedPassword,
      emp_id,
      createdBy: req.user.id, // because verifyToken put this on req.user
    });

    return res.status(201).json({
      message: "Admin created successfully.",
      admin: { name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
}

module.exports = {
  handleRegisterUsers,
  handleUserLogin,
  getLoginPage,
  getRegisterPage,
  handleRegisterAdmin,
};
