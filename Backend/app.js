const express = require("express");
const app = express();
const { connectMongoDB } = require("./connection");

// routes
const adminRoutes = require("./routes/adminRoutes");
const alumniRoutes = require("./routes/alumniRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");

const port = 4000;

connectMongoDB("mongodb://127.0.0.1:27017/AlumniPortalDB");

// app.get('/api/alumni', (req, res) => {
//     console.log(`Hey, I am Alumni`);
//     res.send(`Hey buddy`);
// });

app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/alumni", alumniRoutes);

app.listen(port, () => {
  console.log(`Listening to port : ${port}`);
});
