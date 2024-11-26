import React, { useState } from "react";
import imageCompression from "browser-image-compression";

const PlaylistModal = ({ playlist, onSave, onClose }) => {
  const [title, setTitle] = useState(playlist.title || "");
  const [description, setDescription] = useState(playlist.description || "");
  const [cover, setCover] = useState(playlist.cover || "");

  const handleSave = () => {
    onSave({ ...playlist, title, description, cover });
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Opciones de compresión
        const options = {
          maxSizeMB: 1, 
          maxWidthOrHeight: 1024, 
          useWebWorker: true, 
        };
  
        // Comprimir la imagen
        const compressedFile = await imageCompression(file, options);
  
        // Convertir la imagen comprimida a Base64
        const reader = new FileReader();
        reader.onload = () => setCover(reader.result);
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 text-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Edit Playlist</h2>
        <div className="mb-4">
          <label className="block text-sm mb-2">Front Page</label>
          <input type="file" onChange={handleCoverChange} className="w-full bg-gray-800 p-2 rounded-lg" />
          {cover && <img src={cover} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-md" />}
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 p-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-800 p-2 rounded-lg"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;
