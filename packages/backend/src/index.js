import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/mongodb.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./model/user.js";
import playlistRoutes from './routes/playlistRoutes.js';
import { PORT, SECRET_JWT_KEY } from "./config/config.js";
import musicRoutes from './routes/musicRoutes.js';
import { validateRegister, validateLogin } from "./utils/validations.js";
import handleChatMessage from "./controllers/chatController.js"; // Importar el controlador de chat

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectToDatabase();

// Mapa para almacenar datos de usuario asociados a cada socket
const socketToUser = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Manejar el evento "setUserData" para asociar datos del usuario con el socket
  socket.on("setUserData", (userData) => {
    socketToUser.set(socket.id, { username: userData.username });
    console.log(`User data set for socket ${socket.id}:`, socketToUser.get(socket.id));
  });

  // Usar el controlador para manejar mensajes de chat
  handleChatMessage(io, socket, socketToUser); // Aquí se llama al controlador y se pasa el mapa

  // Manejar la desconexión del socket
  socket.on("disconnect", () => {
    socketToUser.delete(socket.id);
    console.log(`User disconnected: ${socket.id}`);
  });
});

// --- Rutas de Express ---
// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    validateLogin({ username, password });

    const user = await User.findOne({ user: username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, username: user.user },
      SECRET_JWT_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", accessToken, { httpOnly: true, maxAge: 3600000 });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken: "dummyRefreshToken",
      user: {
        id: user._id,
        username: user.user,
      },
    });
  } catch (error) {
    console.error("Error in /login:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    validateRegister({ username, password });

    const existingUser = await User.findOne({ user: username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      user: username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully", id: newUser._id });
  } catch (error) {
    console.error("Error in /register:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Verify Token
app.get("/verify-token", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verificar el token JWT
    const decoded = jwt.verify(token, SECRET_JWT_KEY);

    // Buscar al usuario en la base de datos
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      username: user.user,
    });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// Default Route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Rutas adicionales
app.use("/api", musicRoutes);
app.use("/mymusic", playlistRoutes);

// --- Iniciar el servidor ---
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
