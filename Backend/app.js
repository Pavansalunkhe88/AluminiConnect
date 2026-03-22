// const dotenv = require("dotenv");
// const express = require("express");
// const app = express();
// const http = require('http')
// const { Server } = require("socket.io");
// const cors = require('cors');
// const { connectMongoDB } = require("./connection");
// const cookieParser = require('cookie-parser');

// dotenv.config();


// // routes
// const chatRoutes = require("./chat/routes/chatRoutes");
// const setupChatSocket = require("./chat/sockets/chatSocket");
// const adminRoutes = require("./routes/adminRoutes");
// const alumniRoutes = require("./routes/alumniRoutes");
// const studentRoutes = require("./routes/studentRoutes");
// const teacherRoutes = require("./routes/teacherRoutes");
// const loginRegister = require("./routes/loginRegisterRoutes");
// const postRoutes = require('./routes/postRoutes')

// const port = 4000;




// // create server and socket.io
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" } // lock this down in prod
// });

// // wire sockets
// setupChatSocket(io);

// connectMongoDB("mongodb://127.0.0.1:27017/AlumniPortalDB");

// app.use(cookieParser());
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));

// app.use(express.urlencoded({ extended: true, limit: "10mb"}));
// app.use(express.json({ limit: "10mb" }));

// // mount chat routes
// app.use("/api/chat", chatRoutes);




// // app.get('/api/alumni', (req, res) => {
// //     console.log(`Hey, I am Alumni`);
// //     res.send(`Hey buddy`);
// // });

// //console.log(loginRegister);

// app.use("/api", loginRegister);
// app.use("/api/post", postRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/student", studentRoutes);
// app.use("/api/teacher", teacherRoutes);
// app.use("/api/alumni", alumniRoutes);

// app.use((req, res) => {
//   console.log("404, Page Not Found")
//   res.status(404).send("Page Not Found!");
// })

// server.listen(port, () => {
//   console.log(`Listening to port : ${port}`);
// });


const dotenv = require("dotenv");
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectMongoDB } = require("./connection");

dotenv.config();

const chatRoutes = require("./chat/routes/chatRoutes");
const setupChatSocket = require("./chat/sockets/chatSocket");
const setupSocket = require("./chat/sockets/index");
const adminRoutes = require("./routes/adminRoutes");
const alumniRoutes = require("./routes/alumniRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const loginRegister = require("./routes/loginRegisterRoutes");
const postRoutes = require("./routes/postRoutes");
const requestRoutes = require("./modules/connections/connectionRoutes");
const NotificationService = require("./modules/notifications/notificationService");
const { router: notificationRouter, setupNotificationRoutes, NotificationController } = require("./modules/notifications/notificationRoutes");

const port = 4000;

// Create REAL HTTP server
const server = http.createServer(app);

// SOCKET.IO SERVER INIT
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",   // React Vite
    credentials: true
  }
});

const notificationService = new NotificationService(io);
setupSocket(io, notificationService);
// Attach chat socket logic
//setupChatSocket(io);


// CONNECT MONGO
connectMongoDB("mongodb://127.0.0.1:27017/AlumniPortalDB");

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// INITIALIZE NOTIFICATION CONTROLLER WITH IO
const notificationController = new NotificationController(notificationService, io);
setupNotificationRoutes(notificationController);

// API routes
app.use("/api/chat", chatRoutes);
app.use("/api", loginRegister);
app.use("/api/post", postRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/connections", requestRoutes);
app.use("/api/notifications", notificationRouter);


// 404 fallback
app.use((req, res) => {
  console.log("404, Page Not Found");
  res.status(404).send("Page Not Found!");
});

// 🚀 START SERVER (IMPORTANT)
server.listen(port, () => {
  console.log(`🚀 Server + Socket.IO running on port ${port}`);
});
