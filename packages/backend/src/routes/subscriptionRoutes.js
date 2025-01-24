import express from "express";
import { saveSubscription, getActiveSubscription } from "../controllers/subscriptionController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Guardar suscripción
router.post("/save-subscription", verifyToken, saveSubscription);

// Obtener suscripción activa
router.get("/get-subscription", verifyToken, getActiveSubscription);

export default router;
