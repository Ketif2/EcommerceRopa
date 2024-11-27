import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary text-white px-4">
      <div className="w-full max-w-3xl p-6 md:p-10 bg-primary rounded-lg shadow-2xl text-center">
        <h1
          className="text-white font-fugaz mb-6"
          style={{
            fontSize: "clamp(1.5rem, 3vw, 3rem)", // Tamaño dinámico
          }}
        >
          Bienvenido a <span className="text-contrast2">Music Vibes</span>
        </h1>
        <p
          className="text-white mb-8"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)", // Tamaño dinámico para descripciones
          }}
        >
          Descubre tus canciones favoritas, explora comunidades y lleva tu
          música donde quieras.
        </p>
        {!isAuthenticated ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg font-bold text-white bg-contrast2 rounded-lg hover:bg-white hover:text-contrast2 transition-transform transform hover:scale-105"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg font-bold text-white bg-contrast2 rounded-lg hover:bg-white hover:text-contrast2 transition-transform transform hover:scale-105"
            >
              Regístrate
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <p
              className="text-white mb-4 sm:mb-0"
              style={{
                fontSize: "clamp(1rem, 2vw, 1.25rem)", // Tamaño adaptable
              }}
            >
              ¡Hola, <strong>{user?.username || "Usuario"}</strong>! 🎵
            </p>
            <button
              onClick={() => navigate("/musicplayer")}
              className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg font-bold text-white bg-contrast2 rounded-lg hover:bg-white hover:text-contrast2 transition-transform transform hover:scale-105"
            >
              Ir al Reproductor
            </button>
            <button
              onClick={logout}
              className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg font-bold text-white bg-contrast2 rounded-lg hover:bg-white hover:text-contrast2 transition-transform transform hover:scale-105"
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
