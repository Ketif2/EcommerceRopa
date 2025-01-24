import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AudioPlayer from '../components/AudioPlayer';
import MainContent from "../components/MainContent";
import { fetchSongStream, fetchTrackDetails } from '../services/data';

function MusicPlayer() {
  const [selectedSection, setSelectedSection] = useState('MusicList');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [tracks, setTracks] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const lastTrack = localStorage.getItem('lastTrack');
    if (lastTrack) {
      const parsedTrack = JSON.parse(lastTrack);
      setCurrentTrack(parsedTrack.track);
      setTracks(parsedTrack.tracks);
      setCurrentIndex(parsedTrack.index);
    }
  }, []);

  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem(
        'lastTrack',
        JSON.stringify({ track: currentTrack, tracks: tracks, index: currentIndex })
      );
    }
  }, [currentTrack, tracks, currentIndex]);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleTrackSelect = async (trackId, allTracks = [], selectedIndex = -1) => {
    if (!trackId) {
      console.error('Error: trackId es null o no válido.');
      return;
    }
    console.log("Fetching details for track ID:", trackId);

    try {
      const trackDetailsResponse = await fetchTrackDetails(trackId);
      const trackDetails = trackDetailsResponse.data || trackDetailsResponse;

      if (!trackDetails || !trackDetails.id) {
        console.error('Error: trackDetails es null o no tiene un id válido.', trackDetails);
        return;
      }

      const streamData = await fetchSongStream(trackDetails.id);

      setCurrentTrack({
        url: streamData.url || '', 
        title: trackDetails.title || 'Unknown Title',
        artwork: trackDetails.artwork?.['480x480'] || 'https://via.placeholder.com/480',
        author: trackDetails.user?.name || 'Unknown Author',
      });

      if (allTracks.length > 0) {
        setTracks(allTracks);
        setCurrentIndex(selectedIndex);
      }
    } catch (error) {
      console.error('Error selecting track:', error);
    }
  };

  const handleNextEpisode = () => {
    if (currentIndex >= 0 && currentIndex < tracks.length - 1) {
      const nextIndex = currentIndex + 1;
      handleTrackSelect(tracks[nextIndex].id, tracks, nextIndex);
    } else {
      console.log("No hay más episodios para reproducir");
    }
  };

  const handleBackwardEpisode = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      handleTrackSelect(tracks[prevIndex].id, tracks, prevIndex);
    } else {
      console.log("No hay más episodios para retroceder");
    }
  };

  return (
    <div className="flex flex-col bg-primary scrollbar-thin">
      <div className="px-4 py-2">
      <Header />
      </div>
      <div className="flex flex-1">
        <div className="flex flex-col w-1/5 min-w-72 bg-secondary">
          <div>
            <Sidebar onSectionChange={handleSectionChange} />
          </div>
          <div className="w-full pt-2">
            <AudioPlayer
              url={currentTrack?.url}
              onNextEpisode={handleNextEpisode}
              onBackwardEpisode={handleBackwardEpisode}
              titleEpisode={currentTrack?.title || 'Escoje una canción'}
              podcastImage={currentTrack?.artwork || 'https://via.placeholder.com/480'}
            />
          </div>
        </div>

        <div className="flex-1 bg-secondary">
          <MainContent section={selectedSection} onTrackSelect={handleTrackSelect} />
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
