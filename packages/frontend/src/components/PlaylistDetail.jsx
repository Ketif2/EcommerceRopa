import React, { useState } from "react";
import Song from "./Song";
import AudioPlayer from "./AudioPlayer"; // Asegúrate de que la ruta sea correcta

const PlaylistDetail = ({ playlist, songs, onClose, onRemoveSong }) => {
  const [currentTrack, setCurrentTrack] = useState(null); // Canción seleccionada

  if (!playlist) {
    return <div className="text-white">The selected playlist was not found.</div>;
  }

  // Manejar la selección de una canción
  const handlePlaySong = (song) => {
    console.log("Canción seleccionada:", song);
    setCurrentTrack({
      url: song.streamUrl,
      title: song.title,
      artwork: song.artwork,
    });
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
        <ul className="space-y-4 overflow-y-auto max-h-96 pr-2">
          {songs.map((song) => (
            <li key={song.id}>
              <Song
                artwork={song.artwork}
                title={song.title}
                genre={song.genre || "Unknown"}
                author={song.artist || "Unknown"}
                onClick={() => handlePlaySong(song)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-white">There are no songs available.</div>
      )}

      {/* Integrar el AudioPlayer para reproducir canciones */}
      {currentTrack && (
        <div className="mt-6">
          <AudioPlayer
            url={currentTrack.url}
            titleEpisode={currentTrack.title}
            podcastImage={currentTrack.artwork}
          />
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;
