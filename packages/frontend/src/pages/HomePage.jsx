import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-secondary text-white">
      <div className="max-w-lg p-8 rounded-lg bg-primary shadow-xl text-center">
        <h1 className="text-4xl text-white mb-4 font-fugaz">
          Bienvenido a Music Vibes
        </h1>
        <p className="text-lg text-white mb-6">
          Descubre tus canciones favoritas, explora comunidades y lleva tu música donde quieras.
        </p>
        {!isAuthenticated ? (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 text-lg font-bold text-white bg-contrast2 rounded-lg hover:bg-white hover:text-contrast2 transition"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 text-lg font-bold text-white bg-contrast2 rounded-lg hover:bg-white hover:text-contrast2 transition"
            >
              Regístrate
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-lg text-white mb-4">
              ¡Hola, <strong>{user?.username || "Usuario"}</strong>! 🎵
            </p>
            <button
              onClick={() => navigate("/musicplayer")}
              className="px-6 py-3 text-lg font-bold text-white bg-contrast2 rounded-lg hover:bg-white hover:text-contrast2 transition"
            >
              Ir al Reproductor
            </button>
            <button
              onClick={logout}
              className="px-6 py-3 text-lg font-bold text-white bg-contrast2 rounded-lg hover:bg-white hover:text-contrast2 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
