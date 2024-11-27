import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import Community from '../components/Community';
import AudioPlayer from '../components/AudioPlayer';
import MusicList from '../components/MusicList';
import { fetchSongStream, fetchTrackDetails } from '../services/data';

function MusicPlayer() {
  const [selectedSection, setSelectedSection] = useState('MusicList');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [tracks, setTracks] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(-1);

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

  const renderMainContent = () => {
    if (selectedSection === 'Comunidad') {
      return <Community />;
    } else if (selectedSection === 'MusicList') {
      return <MusicList onTrackSelect={(trackId, allTracks, index) => handleTrackSelect(trackId, allTracks, index)} />;
    }
    return <MainContent section={selectedSection} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Header />
      <div className="flex flex-1">
        <div className="flex flex-col w-1/5 min-w-72 bg-secondary">
          <div className="">
            <Sidebar onSectionChange={handleSectionChange} />
          </div>
          <div className="w-full">
            <AudioPlayer
              url={currentTrack?.url}
              onNextEpisode={handleNextEpisode}
              onBackwardEpisode={handleBackwardEpisode}
              titleEpisode={currentTrack?.title || 'Escoje una canción'}
              podcastImage={currentTrack?.artwork || 'https://via.placeholder.com/480'}
            />
          </div>
        </div>

        <div className="flex-1 bg-secondary ">
          <div className="min-h-0 h-full">
            {renderMainContent()}
          </div>
      </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
