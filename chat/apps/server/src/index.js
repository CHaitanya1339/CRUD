import { Server } from "socket.io";

const PORT = 8081;
const clients = [];

const io = new Server(PORT, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join", ({ userName }) => {
    if (!userName) return;

    const exists = clients.some((c) => c.userName === userName);
    if (exists) {
      socket.emit("join_error", { message: "Username already taken" });
      return;
    }

    clients.push({
      id: socket.id,
      userName,
      isTyping: false,
    });

    socket.emit("join_success");

    socket.broadcast.emit("user_joined", { userName });

    io.emit(
      "users_changed",
      clients.map((c) => c.userName)
    );

    console.log(`${userName} joined`);
  });

  /* ---------------- MESSAGE ---------------- */
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });

  /* ---------------- TYPING ---------------- */
  socket.on("typing_status_update", ({ isTyping }) => {
    const client = clients.find((c) => c.id === socket.id);
    if (!client) return;

    client.isTyping = isTyping;

    socket.broadcast.emit("typing_data", {
      userNames: clients.filter((c) => c.isTyping).map((c) => c.userName),
    });
  });

  socket.on("disconnect", () => {
    const index = clients.findIndex((c) => c.id === socket.id);
    if (index === -1) return;

    const { userName } = clients[index];
    clients.splice(index, 1);

    socket.broadcast.emit("user_left", { userName });

    io.emit("typing_data", {
      userNames: clients.filter((c) => c.isTyping).map((c) => c.userName),
    });

    io.emit(
      "users_changed",
      clients.map((c) => c.userName)
    );

    console.log(`${userName} disconnected`);
  });
});

console.log(`✅ Socket.io server running on port ${PORT}`);
