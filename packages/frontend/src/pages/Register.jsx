import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../utils/api";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState(""); // Validación de contraseña

  const validatePassword = (password) => {
    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      return; // Detén el envío si la contraseña no es válida
    }

    try {
      await registerUser(username, password);
      navigate("/login"); // Redirige al login después del registro exitoso
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
        <h2 className="text-3xl font-fugaz text-contrast2 mb-6">Registro</h2>
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
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value); // Validación en tiempo real
            }}
            required
            className="w-full p-2 mt-1 mb-2 rounded bg-secondary text-white border border-contrast2 focus:outline-none focus:border-white"
          />
        </label>
        {passwordError && <p className="text-contrast2 mb-4">{passwordError}</p>}
        <button
          type="submit"
          className="w-full py-2 bg-contrast2 text-white font-bold rounded hover:bg-white hover:text-contrast2 transition"
        >
          Registrarse
        </button>
        <p className="mt-4">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-contrast2 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
