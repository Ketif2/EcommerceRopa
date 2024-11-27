import User from "../model/user.js";

// Crear una nueva playlist
export const createPlaylist = async (userId, playlistName) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Usuario no encontrado");

  // Verificar si el usuario ya tiene una playlist con el mismo nombre
  const existingPlaylist = user.playlists.find((playlist) => playlist.name === playlistName);
  if (existingPlaylist) throw new Error("Ya existe una playlist con ese nombre");

  // Crear la nueva playlist
  user.playlists.push({ name: playlistName, songs: [] });
  await user.save();
  return user.playlists;
};

// Añadir canciones a una playlist
export const addSongToPlaylist = async (userId, playlistName, songId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Usuario no encontrado");

  const playlist = user.playlists.find((playlist) => playlist.name === playlistName);
  if (!playlist) throw new Error("Playlist no encontrada");

  // Añadir la canción si no está ya en la playlist
  if (!playlist.songs.includes(songId)) {
    playlist.songs.push(songId);
    await user.save();
  }

  return playlist;
};

// Quitar canciones de una playlist
export const removeSongFromPlaylist = async (userId, playlistName, songId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Usuario no encontrado");

  const playlist = user.playlists.find((playlist) => playlist.name === playlistName);
  if (!playlist) throw new Error("Playlist no encontrada");

  // Quitar la canción si está en la playlist
  playlist.songs = playlist.songs.filter((id) => id !== songId);
  await user.save();

  return playlist;
};

// Eliminar una playlist completa
export const deletePlaylist = async (userId, playlistName) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Usuario no encontrado");

  // Eliminar la playlist
  user.playlists = user.playlists.filter((playlist) => playlist.name !== playlistName);
  await user.save();

  return user.playlists;
};
