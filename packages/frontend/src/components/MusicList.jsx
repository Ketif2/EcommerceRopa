import React, { useEffect, useState } from "react";
import { fetchTrendingTracksData, fetchRelaxingTracksData, fetchTrackDetails  } from "../services/data";
import Song from "./Song";

const MusicList = ({ onTrackSelect }) => {
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [relaxingTracks, setRelaxingTracks] = useState([]);

  useEffect(() => {
    const fetchRelaxingTracks = async () => {
      try {
        const response = await fetchRelaxingTracksData();
        const shuffledTracks = response.sort(() => Math.random() - 0.5).slice(0, 8);
        setRelaxingTracks(shuffledTracks); 
      } catch (error) {
        console.error("Error fetching relaxing tracks:", error);
      }
    };

    const fetchTrendingTracks = async () => {
      try {
        const response = await fetchTrendingTracksData();
        const shuffledTracks = response.sort(() => Math.random() - 0.5).slice(0, 10);
        setTrendingTracks(shuffledTracks); 
      } catch (error) {
        console.error("Error fetching trending tracks:", error);
      }
    };

    fetchRelaxingTracks();
    fetchTrendingTracks();
  }, []);

  const handleTrackClick = (trackId, index) => {
    const allTracks = [...trendingTracks]; // Can be combined with other tracks if needed
    onTrackSelect(trackId, allTracks, index);
  };
  

  return (
    <div className="flex-1 overflow-y-scroll h-screen p-6 bg-secondary">
      <div>
        <h2 className="text-white text-xl mb-4">Descubre lo nuevo</h2>
        <div className="grid grid-cols-3 gap-6">
        {relaxingTracks.length > 0 ? (
            relaxingTracks.map((track, index) => (
              <div
                key={track.id}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-red-500"
                onClick={() => handleTrackClick(track.id, index)}
              >
                <img
                  src={track.artwork["480x480"]}
                  alt={track.description || "Cover image"}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <p className="text-white">Cargando...</p>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-white text-xl mb-4">Para relajarse con lo mejor!</h2>
        <div className="grid grid-cols-1 gap-6">
          {trendingTracks.length > 0 ? (
            trendingTracks.map((track) => (
              <Song
              key={track.id}
              artwork={track.artwork["480x480"]}
              title={track.title}
              genre={track.genre}
              author={track.user.name}
              onClick={() => handleTrackClick(track.id)}
              />
            ))
          ) : (
            <p className="text-white">Próximamente...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicList;
