import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePlaylists } from "../context/PlaylistsContext";
import { loginUser } from "../utils/api";

const Login = () => {
  const { login } = useAuth();
  const { setUser } = usePlaylists();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { accessToken, refreshToken, user } = await loginUser(username, password);
      await login(accessToken, refreshToken, user);
      setUser({ username: user.username });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-secondary text-white">
      <form
        onSubmit={handleSubmit}
        className="w-80 p-6 bg-primary rounded-lg shadow-lg text-center"
      >
        <h2 className="text-3xl font-fugaz text-contrast2 mb-6">Iniciar Sesión</h2>
        {error && <p className="text-contrast2 mb-4">{error}</p>}
        <label className="block text-left mb-2">
          Usuario:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 mt-1 mb-4 rounded bg-secondary text-white border border-contrast2 focus:outline-none focus:border-white"
          />
        </label>
        <label className="block text-left mb-2">
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mt-1 mb-4 rounded bg-secondary text-white border border-contrast2 focus:outline-none focus:border-white"
          />
        </label>
        <button
          type="submit"
          className="w-full py-2 bg-contrast2 text-white font-bold rounded hover:bg-white hover:text-contrast2 transition"
        >
          Iniciar Sesión
        </button>
        <p className="mt-4">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-contrast2 hover:underline">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
