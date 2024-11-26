import axios from "axios";

// Configuración base de la API Audius
const BASE_URL = "https://discoveryprovider.audius.co/v1";

// Obtener información de una canción por ID
export const fetchSongInfo = async (songId) => {
  try {
    const response = await axios.get(`${BASE_URL}/tracks/${songId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching song info for ID: ${songId}`, error.message);
    throw new Error("Failed to fetch song information");
  }
};

// Obtener la URL de streaming de una canción
export const fetchSongStream = async (songId) => {
  try {
    const response = await axios.get(`${BASE_URL}/tracks/${songId}/stream`, {
      maxRedirects: 0, // No sigas automáticamente las redirecciones
      validateStatus: (status) => status >= 200 && status < 400, // Acepta códigos de redirección (3xx)
    });

    // Captura la cabecera "location" donde está la URL de redirección
    const streamUrl = response.headers.location;
    if (!streamUrl) {
      throw new Error("Stream URL not found");
    }

    return streamUrl;
  } catch (error) {
    if (error.response && error.response.status === 302) {
      // Si el estado es 302 Found, captura manualmente la redirección
      return error.response.headers.location;
    }

    console.error("Error al obtener la URL de streaming:", error.message);
    throw new Error("Failed to fetch song stream URL");
  }
};

// Obtener canciones populares
export const fetchTrendingSongs = async (limit = 20) => {
  try {
    const response = await axios.get(`${BASE_URL}/tracks/trending`);
    // Limitar el número de resultados a `limit`
    const trendingSongs = response.data.data.slice(0, limit);
    return trendingSongs;
  } catch (error) {
    console.error("Error al obtener canciones populares:", error.message);
    throw new Error("Failed to fetch trending songs");
  }
};

export const fetchRelaxSongs = async (limit = 20) => {
  const genres = ["chill", "ambient", "acoustic", "classical", "jazz", "lo-fi", "soul"];
  const randomGenre = genres[Math.floor(Math.random() * genres.length)]; // Seleccionar género aleatorio

  try {
    // Solicitar canciones trending por género
    const response = await axios.get(`${BASE_URL}/tracks/trending?genre=${randomGenre}`);
    // Limitar el número de resultados
    const trendingSongs = response.data.data.slice(0, limit);
    return trendingSongs;
  } catch (error) {
    console.error("Error al obtener canciones relajantes:", error.message);
    throw new Error("Failed to fetch relaxing songs");
  }
};