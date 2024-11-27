import React, { useEffect, useState } from "react";
import { fetchTrendingTracksData, fetchRelaxingTracksData } from "../services/data";
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

  const handleTrackClick = (trackId, allTracks, index) => {
    onTrackSelect(trackId, allTracks, index);
  };
  

  return (
    <div className="flex-1 overflow-auto h-screen scrollbar-thin bg-secondary">
      <div>
        <h2 className="text-white text-xl mb-4">Descubre lo nuevo</h2>
        <div className="grid grid-cols-4 gap-4">
        {relaxingTracks.length > 0 ? (
            relaxingTracks.map((track, index) => (
              <div
              key={track.id}
              className="cursor-pointer"
              onClick={() => handleTrackClick(track.id, relaxingTracks, index)}
            >
              <img
                src={track.artwork["480x480"]}
                alt={track.description || "Cover image"}
                className="object-cover rounded-lg border-contrast border-opacity-80 border-r-2 border-b-2"
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
            trendingTracks.map((track, index) => (
              <Song
              key={track.id}
              artwork={track.artwork["480x480"]}
              title={track.title}
              genre={track.genre}
              author={track.user.name}
              onClick={() => handleTrackClick(track.id, trendingTracks, index)}
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
