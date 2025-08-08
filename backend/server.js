const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // use actual frontend origin in production
    methods: ["GET", "POST"],
  },
});

connectDB();

app.use(cors());
app.use(express.json());

// Make io globally accessible
app.set("io", io);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/overview", require("./routes/overview"));
app.use("/api/quizzes", require("./routes/quize"));
app.use("/api/users", require("./routes/users"));
app.use("/api/guilds", require("./routes/guilds"));
app.use("/api/ai", require("./routes/ai"));

// Socket.io logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinGuild", (guildId) => {
    socket.join(guildId);
  });

  socket.on("sendMessage", ({ guildId, message }) => {
    socket.to(guildId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
