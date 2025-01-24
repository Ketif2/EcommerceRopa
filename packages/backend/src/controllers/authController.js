import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.js";
import { validateRegister, validateLogin } from "../utils/validations.js";

dotenv.config();
const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;
const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY;

// Login
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    validateLogin({ username, password });

    const user = await User.findOne({ user: username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = jwt.sign(
      { userId: user._id, username: user.user },
      SECRET_JWT_KEY,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, username: user.user },
      REFRESH_TOKEN_KEY,
      { expiresIn: "7d" }
    );
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    // Guarda el refreshToken en la base de datos
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.user },
    });
  } catch (error) {
    console.error("Error in /login:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Register
export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    validateRegister({ username, password });

    const existingUser = await User.findOne({ user: username });
    if (existingUser) return res.status(400).json({ error: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ user: username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", id: newUser._id });
  } catch (error) {
    console.error("Error in /register:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Verify Token
export const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_JWT_KEY);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ id: user._id, username: user.user });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Refresh Access Token
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token not provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, SECRET_JWT_KEY);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, username: user.user },
      SECRET_JWT_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error refreshing access token:", error.message);
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};
