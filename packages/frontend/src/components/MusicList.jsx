import React, { useEffect, useState } from "react";
import { fetchTrendingTracksData, fetchRelaxingTracksData, fetchTrackDetails } from "../services/data";

const MusicList = ({ onTrackSelect }) => {
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [relaxingTracks, setRelaxingTracks] = useState([]);

  useEffect(() => {
    const fetchTrendingTracks = async () => {
      try {
        const response = await fetchTrendingTracksData();
        const shuffledTracks = response.data.data.sort(() => Math.random() - 0.5).slice(0, 8);
        setTrendingTracks(shuffledTracks); 
      } catch (error) {
        console.error("Error fetching trending tracks:", error);
      }
    };

    const fetchRelaxingTracks = async () => {
      try {
        const relaxingTracks = await fetchRelaxingTracksData();
        const shuffledTracks = relaxingTracks.sort(() => Math.random() - 0.5).slice(0, 8);
        setRelaxingTracks(shuffledTracks); 
      } catch (error) {
        console.error("Error fetching relaxing tracks:", error);
      }
    };

    fetchTrendingTracks();
    fetchRelaxingTracks();
  }, []);

  const handleTrackClick = async (trackId) => {
    try {
        const trackDetails = await fetchTrackDetails(trackId);
        onTrackSelect(trackDetails);
    } catch (error) {
        console.error('Error selecting track:', error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-secondary">
      <section>
        <h2 className="text-white text-xl mb-4">Descubre lo nuevo</h2>
        <div className="grid grid-cols-4 gap-4">
          {trendingTracks.length > 0 ? (
            trendingTracks.map((track) => (
              <div
                key={track.id}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-red-500"
                onClick={() => handleTrackClick(track.id)}
              >
                <div className="w-full h-full bg-gray-800"></div>
              </div>
            ))
          ) : (
            <p className="text-white">Cargando...</p>
          )}
        </div>
      </section>
      <section className="mt-8">
        <h2 className="text-white text-xl mb-4">Para relajarse con lo mejor!</h2>
        <div className="grid grid-cols-4 gap-4">
          {relaxingTracks.length > 0 ? (
            relaxingTracks.map((track) => (
              <div
                key={track.id}
                className="aspect-square bg-contrast rounded-lg overflow-hidden cursor-pointer border-2 border-red-500"
                onClick={() => handleTrackClick(track.id)}
              >
                <div className="w-full h-full bg-gray-800"></div>
              </div>
            ))
          ) : (
            <p className="text-white">Próximamente...</p>
          )}
        </div>
      </section>
      </div>
  );
};

export default MusicList;
