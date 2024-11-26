import { fetchSongInfo, fetchSongStream, fetchTrendingSongs, fetchRelaxSongs} from "../services/audiusService.js";
// Obtener información de una canción

export const getSongInfo = async (req, res) => {
    const { id } = req.params;
  try {
    const songInfo = await fetchSongInfo(id);
    res.status(200).json(songInfo);
  } catch (error) {
    console.error("Error en getSongInfo:", error.message);
    res.status(500).json({ error: "Error al obtener la información de la canción." });
  }
};

// Obtener la URL para reproducir una canción
export const playSong = async (req, res) => {
    const { id } = req.params; // Obtén el ID de la canción desde los parámetros
  try {
    const songStreamURL = await fetchSongStream(id); // Llama al servicio para obtener la URL final
    if (!songStreamURL) {
      return res.status(404).json({ error: "Stream URL not found" });
    }
    res.status(200).json({ url: songStreamURL }); // Devuelve la URL de streaming en la respuesta
  } catch (error) {
    console.error("Error en playSong:", error.message);
    res.status(500).json({ error: "Error al obtener la URL de reproducción." });
  }
};

// Obtener canciones populares
export const getTrendingSongs = async (req, res) => {
  try {
    // Obtener el límite opcional desde la query string (por ejemplo, ?limit=10)
    const limit = parseInt(req.query.limit, 10) || 20;
    const trendingSongs = await fetchTrendingSongs(limit);
    res.status(200).json(trendingSongs);
  } catch (error) {
    console.error("Error en getTrendingSongs:", error.message);
    res.status(500).json({ error: "Error al obtener canciones populares." });
  }
};

// Obtener canciones relajantes
export const getRelaxSongs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20; // Límite opcional pasado como query string
    const songs = await fetchRelaxSongs(limit); // Llama al servicio para obtener las canciones
    res.status(200).json(songs); // Devuelve las canciones al cliente
  } catch (error) {
    console.error("Error en getRelaxSongs:", error.message);
    res.status(500).json({ error: "Error al obtener canciones relajantes." });
  }
};