import axios from 'axios';

const BACKEND_API_URL = 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
});

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




export const saveUserPlaylists = async (username, playlists) => {
    try {
        const response = await axiosInstance.post(`/api/playlists/save`, { 
            username, 
            playlists 
        });
        return response.data;
    } catch (error) {
        console.error('Error saving playlists:', error);
        throw error;
    }
};

export const loadUserPlaylists = async (username) => {
    try {
        const response = await axios.get(`${BACKEND_API_URL}/api/playlists/load/${username}`);
        return response.data.playlists;
    } catch (error) {
        console.error('Error loading playlists:', error);
        return [];
    }
};

export const deleteUserPlaylist = async (username, playlistId) => {
    try {
        const response = await axios.post(`${BACKEND_API_URL}/api/playlists/delete`, { 
            username, 
            playlistId ,
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting playlist:', error);
        throw error;
    }
};
