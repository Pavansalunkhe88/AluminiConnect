const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../sampleData", "userSampleData.json");

// Validate PRN or Employee ID using sample data
async function validateUserFromSample(role, prn, emp) {
  const data = await fs.readFile(filePath, "utf-8");
  const users = JSON.parse(data);

  if (role === "Teacher") {
    return users.some((u) => u.role === "teacher" && u.employee_id === emp);
  }
  if (role === "Student" || role === "Alumni") {
    return users.some(
      (u) => u.role === role.toLowerCase() && u.prn_number === prn
    );
  }
  return false;
}

// Validate password strength
function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{9,}$/;
  return regex.test(password);
}

// Validate email format
function validateEmail(email) {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}

module.exports = { validateUserFromSample, validatePassword, validateEmail };
