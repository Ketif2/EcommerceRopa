import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MusicPlayer from "./pages/MusicPlayer";
import NotFound from "./pages/NotFound";
import Comunidad from "./components/Community";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { PlaylistsProvider } from "./context/PlaylistsContext";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#141D26] text-white">
        Cargando...
      </div>
    );
  }
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {

  return (
    <AuthProvider>
      <ChatProvider>
        <PlaylistsProvider>
          <BrowserRouter>
            <div className="h-screen flex flex-col">
              <div className="flex-1">
                <Routes>
                  {/* Ruta principal */}
                  <Route path="/" element={<HomePage />} />

                  {/* Rutas públicas */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Rutas protegidas */}
                  <Route path="/musicplayer" element={<ProtectedRoute element={<MusicPlayer />} />} />
                  <Route path="/comunidad" element={<ProtectedRoute element={<Comunidad />} />} />

                  {/* Ruta para páginas no encontradas */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </BrowserRouter>
        </PlaylistsProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
