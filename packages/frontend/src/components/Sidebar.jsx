const Sidebar = ({ onSectionChange }) => {
    const menuItems = [
      { id: 1, label: "Music List", component: "MusicList" },
      { id: 2, label: "Favoritas", component: "Favoritas" },
      { id: 3, label: "Playlists", component: "Playlists" },
      { id: 4, label: "Community", component: "Comunidad" },
      { id: 5, label: "Suscripciones", component: "Suscripciones" },
    ];
  
    return (
      <div className="w-full bg-secondary text-white p-4 border-r border-contrast flex flex-col">
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.component)}
              className="w-full text-left py-2 px-4 hover:bg-contrast hover:text-black rounded-lg"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    );
  };
export default Sidebar;
  