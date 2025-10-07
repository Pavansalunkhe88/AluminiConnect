async function getAllStudents(req, res) {
  res.send("Get all Students");
}

async function getStudentById(req, res) {
  const { id } = req.params;
  res.send(`Get Student with ID: ${id}`);
}

async function createStudent(req, res) {
  const data = req.body;
  res.send(`Create Student with data: ${JSON.stringify(data)}`);
}

async function updateStudent(req, res) {
  const { id } = req.params;
  const data = req.body;
  res.send(`Update Student ${id} with data: ${JSON.stringify(data)}`);
}

async function deleteStudent(req, res) {
  const { id } = req.params;
  res.send(`Delete Student with ID: ${id}`);
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
