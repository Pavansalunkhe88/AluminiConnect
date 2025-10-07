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

async function updateAlumni(req, res) {
  const { id } = req.params;
  const data = req.body;
  res.send(`Update Alumni ${id} with data: ${JSON.stringify(data)}`);
}

async function deleteAlumni(req, res) {
  const { id } = req.params;
  res.send(`Delete Alumni with ID: ${id}`);
}

module.exports = {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni
};
