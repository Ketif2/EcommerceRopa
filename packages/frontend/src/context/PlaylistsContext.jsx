import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchTrendingTracksData } from '../services/data';
import { saveUserPlaylists, loadUserPlaylists, deleteUserPlaylist } from '../services/data';

const PlaylistsContext = createContext();

export const PlaylistsProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Función para establecer el usuario actual
  const setUser = (user) => {
    setCurrentUser(user);
  };

  // Cargar playlists del usuario al iniciar sesión
  useEffect(() => {
    const loadPlaylists = async () => {
      if (currentUser) {
        try {
          const loadedPlaylists = await loadUserPlaylists(currentUser.username);
          setPlaylists(loadedPlaylists.length > 0 ? loadedPlaylists : []);
        } catch (error) {
          console.error("Error loading playlists:", error);
        }
      }
    };

    loadPlaylists();
  }, [currentUser]);

  // Guardar playlists cada vez que cambian
  useEffect(() => {
    const savePlaylists = async () => {
      if (currentUser && playlists.length > 0) {
        try {
          await saveUserPlaylists(currentUser.username, playlists);
        } catch (error) {
          console.error("Error saving playlists:", error);
        }
      }
    };

    savePlaylists();
  }, [playlists, currentUser]);

  const addPlaylist = (newPlaylist) => {
    const playlistWithId = {
      ...newPlaylist,
      id: Date.now(), // Generar ID único
      songs: [] // Asegurar que tenga una lista de canciones
    };
    setPlaylists([...playlists, playlistWithId]);
  };

  const updatePlaylist = (updatedPlaylist) => {
    // Asegurarse de mantener las canciones existentes
    const playlistToUpdate = playlists.find(p => p.id === updatedPlaylist.id);
    const updatedPlaylistWithSongs = {
      ...updatedPlaylist,
      songs: playlistToUpdate ? playlistToUpdate.songs : []
    };

    setPlaylists(
      playlists.map((p) => (p.id === updatedPlaylist.id ? updatedPlaylistWithSongs : p))
    );
  };

  const removePlaylist = async (id) => {
    // Si hay usuario, intentar eliminar playlist del backend
    if (currentUser) {
      try {
        await deleteUserPlaylist(currentUser.username, id);
      } catch (error) {
        console.error("Error deleting playlist:", error);
      }
    }

    // Eliminar localmente
    setPlaylists(playlists.filter((playlist) => playlist.id !== id));
  };

  const loadSongsForPlaylist = async (playlistId) => {
    try {
      const response = await fetchTrendingTracksData();
      console.log("Respuesta del backend para playlist:", response);
      return response.map((track) => ({
        id: track.id,
        title: track.title,
        artist: track.user.name,
        artwork: track.artwork["150x150"],
        streamUrl: `http://localhost:3000/api/tracks/${track.id}/stream`,
      }));
    } catch (error) {
      console.error("Error al cargar canciones desde el backend:", error);
      return [];
    }
  };

  const updatePlaylistSongs = (playlistId, songs) => {
    setPlaylists(playlists.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, songs } 
        : playlist
    ));
  };

  return (
    <PlaylistsContext.Provider
      value={{
        playlists,
        addPlaylist,
        updatePlaylist,
        removePlaylist,
        loadSongsForPlaylist,
        updatePlaylistSongs, // Añadir método para actualizar canciones
        setUser,
      }}
    >
      {children}
    </PlaylistsContext.Provider>
  );
};

export const usePlaylists = () => {
  return useContext(PlaylistsContext);
};