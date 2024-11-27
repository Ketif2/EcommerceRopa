import {
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist,
  } from "../services/playlistService.js";
  
  // Crear una nueva playlist
  export const handleCreatePlaylist = async (req, res) => {
    try {
      const { userId, name } = req.body;
      const playlists = await createPlaylist(userId, name);
      res.status(201).json(playlists);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Añadir una canción a una playlist
  export const handleAddSongToPlaylist = async (req, res) => {
    try {
      const { userId, name, songId } = req.body;
      const playlist = await addSongToPlaylist(userId, name, songId);
      res.status(200).json(playlist);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Quitar una canción de una playlist
  export const handleRemoveSongFromPlaylist = async (req, res) => {
    try {
      const { userId, name, songId } = req.body;
      const playlist = await removeSongFromPlaylist(userId, name, songId);
      res.status(200).json(playlist);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Eliminar una playlist completa
  export const handleDeletePlaylist = async (req, res) => {
    try {
      const { userId, name } = req.body;
      const playlists = await deletePlaylist(userId, name);
      res.status(200).json(playlists);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  