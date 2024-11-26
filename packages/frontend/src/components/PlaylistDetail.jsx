import React from "react";

const PlaylistDetail = ({ playlist, songs, onClose, onPlaySong, onRemoveSong }) => {
  if (!playlist) {
    return <div className="text-white">The selected playlist was not found.</div>;
  }

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
            <li
              key={song.id}
              className="flex items-center justify-between bg-gray-800 rounded-lg p-4 hover:bg-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-600 rounded-md">
                  {song.artwork && (
                    <img
                      src={song.artwork}
                      alt={song.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  )}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{song.title}</h4>
                  <p className="text-gray-400 text-sm">{song.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onPlaySong(song.streamUrl, song.title, song.artwork)}
                  className="text-blue-400 hover:underline"
                >
                  Reproducir
                </button>
                <button
                  onClick={() => onRemoveSong(song.id)}
                  className="text-red-400 hover:underline"
                >
                  Eliminar
                </button>
              </div>
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