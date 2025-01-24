import React from "react";
import MusicList from "./MusicList";
import Favorites from "./Favorites";
import Playlists from "./PlayList";
import Community from "./Community";
import Subscription from "./Subscription";

const MainContent = ({ section, onTrackSelect }) => {
  const components = {
    MusicList: <MusicList onTrackSelect={onTrackSelect} />,
    Favoritas: <Favorites />,
    Playlists: <Playlists />,
    Comunidad: <Community />,
    Suscripciones: <Subscription />,
  };

  return components[section] || <div>Sección no encontrada</div>;
};

export default MainContent;
