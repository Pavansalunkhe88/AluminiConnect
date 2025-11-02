const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cors = require('cors');
const { connectMongoDB } = require("./connection");
const cookieParser = require('cookie-parser');

dotenv.config();


// routes
const adminRoutes = require("./routes/adminRoutes");
const alumniRoutes = require("./routes/alumniRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const loginRegister = require("./routes/loginRegisterRoutes");

const port = 4000;

connectMongoDB("mongodb://127.0.0.1:27017/AlumniPortalDB");

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.urlencoded({ extended: true, limit: "10kb"}));
app.use(express.json({ limit: "10kb" }));




// app.get('/api/alumni', (req, res) => {
//     console.log(`Hey, I am Alumni`);
//     res.send(`Hey buddy`);
// });

//console.log(loginRegister);

app.use("/api", loginRegister);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/alumni", alumniRoutes);

app.use((req, res) => {
  console.log("404, Page Not Found")
  res.status(404).send("Page Not Found!");
})

app.listen(port, () => {
  console.log(`Listening to port : ${port}`);
});
