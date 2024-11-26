import fs from "fs/promises";
import { existsSync, writeFileSync } from "fs";


const PLAYLISTS_FILE = "./playlists.json"; // Archivo donde se guardarán las playlists

// Asegurar que el archivo playlists.json exista
const initializePlaylistsFile = async () => {
  if (!existsSync(PLAYLISTS_FILE)) {
    console.log("Archivo playlists.json no encontrado. Creando uno nuevo...");
    writeFileSync(PLAYLISTS_FILE, JSON.stringify({})); // Crea el archivo vacío
  }
};

// Llamar a la función de inicialización al iniciar el servidor
initializePlaylistsFile().catch((err) => {
  console.error("Error al inicializar playlists.json:", err);
});

// Guardar playlists de un usuario
export const savePlaylists = async (req, res) => {
  const { username, playlists } = req.body;

  try {
    const fileData = await fs.readFile(PLAYLISTS_FILE, "utf8").catch(() => "{}");
    const allPlaylists = JSON.parse(fileData);

    allPlaylists[username] = playlists;

    await fs.writeFile(PLAYLISTS_FILE, JSON.stringify(allPlaylists, null, 2));
    res.status(200).json({ message: "Playlists saved successfully" });
  } catch (error) {
    console.error("Error saving playlists:", error);
    res.status(500).json({ error: "Failed to save playlists" });
  }
};

// Cargar playlists de un usuario
export const loadPlaylists = async (req, res) => {
  const { username } = req.params;

  try {
    const fileData = await fs.readFile(PLAYLISTS_FILE, "utf8").catch(() => "{}");
    const allPlaylists = JSON.parse(fileData);

    const playlists = allPlaylists[username] || [];
    res.status(200).json({ playlists });
  } catch (error) {
    console.error("Error loading playlists:", error);
    res.status(500).json({ error: "Failed to load playlists" });
  }
};

// Borrar una playlist específica de un usuario
export const deletePlaylist = async (req, res) => {
  const { username, playlistId } = req.body;

  try {
    const fileData = await fs.readFile(PLAYLISTS_FILE, "utf8").catch(() => "{}");
    const allPlaylists = JSON.parse(fileData);

    if (allPlaylists[username]) {
      allPlaylists[username] = allPlaylists[username].filter(
        (playlist) => playlist.id !== playlistId
      );
      await fs.writeFile(PLAYLISTS_FILE, JSON.stringify(allPlaylists, null, 2));
    }
    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
};
