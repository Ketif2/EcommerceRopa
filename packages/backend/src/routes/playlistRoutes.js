import express from "express";
import {
  handleCreatePlaylist,
  handleAddSongToPlaylist,
  handleRemoveSongFromPlaylist,
  handleDeletePlaylist,
} from "../controllers/playlistController.js";

const router = express.Router();

// Crear una playlist
router.post("/playlists", handleCreatePlaylist);

// Añadir una canción a una playlist
router.post("/playlists/songs", handleAddSongToPlaylist);

// Quitar una canción de una playlist
router.delete("/playlists/songs", handleRemoveSongFromPlaylist);

// Eliminar una playlist
router.delete("/playlists", handleDeletePlaylist);

export default router;
