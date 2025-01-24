import axios from 'axios';

const BACKEND_API_URL = import.meta.env.VITE_API_BASE_URL;

// Recupera lista de canciones populares
export const fetchTrendingTracksData = async () => {
    try {
        const response = await axios.get(`${BACKEND_API_URL}/api/trending`);
        return response.data;
    } catch (error) {
        console.error('Error fetching trending tracks:', error);
        throw error;
    }
};

// Recupera lista de canciones relajantes de generos aleatorios
export const fetchRelaxingTracksData = async () => {
    try {
        const response = await axios.get(`${BACKEND_API_URL}/api/relax`);
        return response.data;
    } catch (error) {
        console.error('Error fetching relaxing tracks:', error);
        throw error;
    }
};

// Obtener detalles de una canción por ID
export const fetchTrackDetails = async (trackId) => {
    try {
        const response = await axios.get(`${BACKEND_API_URL}/api/songs/${trackId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching track details:', error);
        throw error;
    }
};

// Obtener la URL de streaming de una canción
export const fetchSongStream = async (trackId) => {
    console.log("Fetching stream for track ID:", trackId);
    if (!trackId) {
      throw new Error('Invalid trackId: no se puede obtener la URL de streaming.');
    }
  
    try {
      const response = await axios.get(`${BACKEND_API_URL}/api/songs/${trackId}/play`);
      return response.data;
    } catch (error) {
      console.error('Error fetching song stream:', error);
      throw error;
    }
  };