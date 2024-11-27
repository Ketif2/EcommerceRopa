import React, { useState } from "react";
import Song from "./Song";

const PlaylistDetail = ({ playlist, songs: initialSongs, onClose, onTrackSelect }) => {
  const [songs, setSongs] = useState(initialSongs);

  if (!playlist) {
    return <div className="text-white">The selected playlist was not found.</div>;
  }

  const handlePlaySong = (song, index) => {
    if (onTrackSelect) {
      onTrackSelect(song.id, songs, index);
    }
  };

  const handleRemoveSong = (songId) => {
    // Filtrar canciones para "eliminar" visualmente la seleccionada
    setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
  };

  return (
    <div className="p-4">
      <button
        onClick={onClose}
        className="bg-gray-700 text-white py-2 px-4 rounded-md mb-4 hover:bg-gray-600"
      >
        &larr; Return to Playlists list
      </button>

      <div className="flex gap-8 mb-8">
        <div className="w-48 h-48 bg-gray-600 rounded-lg">
          {playlist.cover && (
            <img
              src={playlist.cover}
              alt={playlist.title}
              className="w-full h-full object-cover rounded-md"
            />
          )}
        </div>
        <div>
          <h2 className="text-2xl text-white font-bold mb-2">
            {playlist.title}
          </h2>
          <p className="text-gray-400">{playlist.description}</p>
        </div>
      </div>

      <h3 className="text-xl text-white mb-4">Song List</h3>
      {songs && songs.length > 0 ? (
        <ul className="space-y-4 overflow-y-auto scrollbar-thin max-h-96 pr-2">
          {songs.map((song, index) => (
            <li
              key={song.id}
              className="flex items-center justify-between bg-gray-800 p-4 rounded-lg"
            >
              <div className="flex items-center">
                <Song
                  artwork={song.artwork}
                  title={song.title}
                  genre={song.genre || "Unknown"}
                  author={song.artist || "Unknown"}
                  onClick={() => handlePlaySong(song, index)}
                />
              </div>
              <button
                onClick={() => handleRemoveSong(song.id)}
                className="text-red-500 underline hover:text-red-700 ml-4"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-white">There are no songs available.</div>
      )}
    </div>
  );
};

export default PlaylistDetail;
