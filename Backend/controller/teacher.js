async function getAllTeachers(req, res) {
  res.send("Get all Teachers");
}

async function getTeacherById(req, res) {
  const { id } = req.params;
  res.send(`Get Teacher with ID: ${id}`);
}

async function createTeacher(req, res) {
  const data = req.body;
  res.send(`Create Teacher with data: ${JSON.stringify(data)}`);
}

async function updateTeacher(req, res) {
  const { id } = req.params;
  const data = req.body;
  res.send(`Update Teacher ${id} with data: ${JSON.stringify(data)}`);
}

async function deleteTeacher(req, res) {
  const { id } = req.params;
  res.send(`Delete Teacher with ID: ${id}`);
}

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
};
