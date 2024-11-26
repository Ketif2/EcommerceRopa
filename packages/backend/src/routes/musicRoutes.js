import express from 'express';
import { getSongInfo, playSong, getTrendingSongs, getRelaxSongs } from "../controllers/musicController.js";

const router = express.Router();

// Ruta para obtener información de una canción por ID
router.get('/songs/:id', getSongInfo);

// Ruta para obtener la URL de reproducción de una canción
router.get('/songs/:id/play', playSong);

// Canciones populares (una lista de canciones para rellenar la pantalla de inicio)
router.get("/trending", getTrendingSongs);

router.get("/relax", getRelaxSongs);

export default router;

