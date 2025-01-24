import express from "express";
import musicRoutes from "./musicRoutes.js";
import playlistRoutes from "./playlistRoutes.js";
import authRoutes from "./authRoutes.js";
import subscriptionRoutes from "./subscriptionRoutes.js";

const router = express.Router();

// Rutas principales
router.use("/api", musicRoutes);
router.use("/mymusic", playlistRoutes);
router.use("/auth", authRoutes); 
router.use("/subscriptions", subscriptionRoutes); // Ruta para manejar suscripciones

// Ruta por defecto
router.get("/", (req, res) => {
  res.send("Server is running");
});

export default router;
