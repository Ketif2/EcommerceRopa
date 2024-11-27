// MainContent.jsx
import React from 'react';
import MusicList from './MusicList';
import Favorites from './Favorites';
import Playlists from './PlayList';
import Community from './Community';

const MainContent = ({ section, onTrackSelect }) => {
  return (
    <div>
      {section === 'MusicList' && <MusicList onTrackSelect={onTrackSelect} />}
      {section === 'Favoritas' && <Favorites onTrackSelect={onTrackSelect} />}
      {section === 'Playlists' && <Playlists onTrackSelect={onTrackSelect} />}
      {section === 'Comunidad' && <Community />}
    </div>
  );
};

export default MainContent;
