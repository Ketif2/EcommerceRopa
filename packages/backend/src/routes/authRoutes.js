import express from "express";
import { login, register, verifyToken } from "../controllers/authController.js";

const router = express.Router();

// Ruta para iniciar sesión
router.post("/login", login);

// Ruta para registrar un usuario
router.post("/register", register);

// Ruta para verificar el token
router.get("/verify-token", verifyToken);

export default router;
