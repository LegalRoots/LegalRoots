const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const {
  getUserSocketMap,
  setUserSocket,
  removeUserSocket,
} = require("./socketMap");
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./.env" });
const app = require("./app");
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A new user connected!");
  socket.on("register", (userId) => {
    setUserSocket(userId, socket.id);
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
  });

  socket.on("startFollowing", (data) => {
    socket.emit("newNotification", {
      message: data.message,
    });
  });
  socket.on("disconnect", () => {
    const userId = removeUserSocket(socket.id);
    if (userId) {
      console.log(`User ${userId} disconnected`);
    }
  });
});

app.set("io", io);
app.use((req, res, next) => {
  req.io = io;
  next();
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    process.on("unhandledRejection", (err) => {
      console.log("UNHANDLED REJECTION! Shutting down...");
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((err) => console.log(err));
