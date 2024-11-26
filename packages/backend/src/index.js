import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/mongodb.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./model/user.js";
import { PORT, SECRET_JWT_KEY } from "./config/config.js";
import musicRoutes from './routes/musicRoutes.js'
import { validateRegister, validateLogin } from "./utils/validations.js";

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

const socketToUser = new Map();

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
  
    socket.on("setUserData", (userData) => {
      // Asociar el username al socket
      socketToUser.set(socket.id, { username: userData.username });
      console.log(`User data set for socket ${socket.id}:`, socketToUser.get(socket.id));
    });
  
    socket.on("chatMessage", (message) => {
      const user = socketToUser.get(socket.id);
      if (user) {
        const chatMessage = {
          text: message,
          username: user.username, // Usa el username como identificador
          timestamp: new Date().toISOString(),
        };
        console.log("Broadcasting message:", chatMessage);
        io.emit("chatMessage", chatMessage);
      }
    });
  
    socket.on("disconnect", () => {
      socketToUser.delete(socket.id);
      console.log(`User disconnected: ${socket.id}`);
    });
  });

// --- Rutas de Express ---
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

        // Responder con el token o mensaje de éxito
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
        console.error('Error in /login:', error.message);
        res.status(400).json({ error: error.message });
    }
});

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

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api", musicRoutes);

// --- Iniciar el servidor ---
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
