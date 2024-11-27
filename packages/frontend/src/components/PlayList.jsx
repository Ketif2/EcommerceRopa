import React, { useState } from "react";
import { usePlaylists } from "../context/PlaylistsContext";
import PlaylistModal from "./PlaylistModal";
import PlaylistDetail from "./PlaylistDetail";

const Playlists = ({ onTrackSelect  }) => {
  const {
    playlists,
    addPlaylist,
    updatePlaylist,
    removePlaylist,
    loadSongsForPlaylist,
    updatePlaylistSongs,
  } = usePlaylists();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [viewPlaylist, setViewPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPlaylist = () => {
    const newPlaylist = {
      id: playlists.length + 1,
      title: `Nueva Playlist ${playlists.length + 1}`,
      description: "",
      cover: "",
      songs: [],
    };
    addPlaylist(newPlaylist);
  };

  const handleEditPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleViewPlaylist = async (playlist) => {
    try {
      setIsLoading(true);
      const songs = await loadSongsForPlaylist(playlist.id);
      console.log("Canciones cargadas para la playlist:", songs); // Depurar canciones cargadas
      setPlaylistSongs(songs);
      setViewPlaylist(playlist);
    } catch (error) {
      console.error("Error al cargar canciones para la playlist:", error);
      setPlaylistSongs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlaylist = (id) => {
    removePlaylist(id);
  };

  const handleRemoveSong = (songId) => {
    const updatedSongs = playlistSongs.filter((song) => song.id !== songId);
  
    // Usa viewPlaylist en lugar de playlist
    if (viewPlaylist) {
      updatePlaylistSongs(viewPlaylist.id, updatedSongs);
    }
  
    setPlaylistSongs(updatedSongs);
  };

  const handleSavePlaylist = (updatedPlaylist) => {
    updatePlaylist(updatedPlaylist);
    setSelectedPlaylist(null);
  };

  if (isLoading) {
    return <div className="text-white">Loading songs...</div>;
  }

  if (viewPlaylist) {
    return (
      <PlaylistDetail
        playlist={viewPlaylist}
        songs={playlistSongs}
        onClose={() => setViewPlaylist(null)}
        onRemoveSong={handleRemoveSong}
        updatePlaylistSongs={updatePlaylistSongs}
        onTrackSelect={onTrackSelect} // Pasamos onTrackSelect aquí
      />
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-white text-2xl mb-4">Your Playlist</h2>
      <div className="grid grid-cols-3 gap-4">
        <div
          onClick={handleAddPlaylist}
          className="border-2 border-dashed flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-700 rounded-lg"
        >
          <span className="text-xl">+</span>
          <span>New Playlist</span>
        </div>

        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="relative border rounded-lg p-4 cursor-pointer bg-gray-800 hover:bg-gray-700"
            onClick={() => handleViewPlaylist(playlist)}
          >
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditPlaylist(playlist);
                }}
                className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600"
              >
                ✏️
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePlaylist(playlist.id);
                }}
                className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                🗑️
              </button>
            </div>
            <div className="h-32 w-full bg-gray-600 rounded-md mb-2">
              {playlist.cover && (
                <img
                  src={playlist.cover}
                  alt={playlist.title}
                  className="w-full h-full object-cover rounded-md"
                />
              )}
            </div>
            <h3 className="text-white text-lg">{playlist.title}</h3>
            <p className="text-gray-400 text-sm">{playlist.description}</p>
          </div>
        ))}
      </div>

      {selectedPlaylist && (
        <PlaylistModal
          playlist={selectedPlaylist}
          onSave={handleSavePlaylist}
          onClose={() => setSelectedPlaylist(null)}
        />
      )}
    </div>
  );
};

export default Playlists;
