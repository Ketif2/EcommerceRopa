import { Server } from "socket.io";

const socketToUser = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("setUserData", (userData) => {
      if (!userData || typeof userData.username !== "string" || userData.username.length > 50) {
        console.log(`Invalid userData received from ${socket.id}`);
        return;
      }
      socketToUser.set(socket.id, { username: userData.username });
      console.log(`User data set for socket ${socket.id}:`, socketToUser.get(socket.id));
    });

    socket.on("chatMessage", (message) => {
      if (!message || message.length > 500) {
        console.log(`Invalid message received from ${socket.id}`);
        return;
      }
      const user = socketToUser.get(socket.id);
      if (user) {
        const chatMessage = {
          text: message,
          username: user.username,
          timestamp: new Date().toISOString(),
        };
        io.emit("chatMessage", chatMessage);
      }
    });

    socket.on("disconnect", () => {
      socketToUser.delete(socket.id);
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  io.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  return io;
};

export default initializeSocket;
