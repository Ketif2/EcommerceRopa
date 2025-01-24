import React from "react";
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
import { PayPalScriptProvider } from "@paypal/react-paypal-js"; // SDK de PayPal

// Componente de Rutas Protegidas
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center bg-[#141D26] text-white">
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
          {/* Configuración del SDK de PayPal con variable .env */}
          <PayPalScriptProvider
            options={{
              "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, // Usamos la variable de entorno
              currency: "USD",
            }}
          >
            <BrowserRouter>
              <Routes>
                {/* Ruta principal */}
                <Route path="/" element={<HomePage />} />

                {/* Rutas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rutas protegidas */}
                <Route
                  path="/musicplayer"
                  element={<ProtectedRoute element={<MusicPlayer />} />}
                />
                <Route
                  path="/comunidad"
                  element={<ProtectedRoute element={<Comunidad />} />}
                />

                {/* Ruta para páginas no encontradas */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </PayPalScriptProvider>
        </PlaylistsProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
