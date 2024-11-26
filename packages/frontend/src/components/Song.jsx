import React from "react";
import { IoIosPlay } from "react-icons/io";

const Song = ({ artwork, title, genre, author, onClick  }) => {
  return (
    <div
      className="flex items-center p-4 rounded-lg overflow-hidden border border-gray-700 bg-gray-800"
    >
      <img
        src={artwork}
        alt={title}
        className="w-16 h-16 rounded-lg mr-4"
      />
      <div className="flex-1">
        <p className="text-white font-bold">{title}</p>
        <p className="text-sm text-gray-400">Género: {genre}</p>
        <p className="text-sm text-gray-400">Autor: {author}</p>
      </div>
      <button className="ml-4 text-white"  onClick={onClick}>
        <IoIosPlay className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Song;
