import http from "http";
import app from "./server.js"; // Configuración de Express
import initializeSocket from "./socket.js"; // WebSocket
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno

const PORT = process.env.PORT || 3000;

// Validar variables de entorno críticas
if (!process.env.MONGO_URI || !process.env.SECRET_JWT_KEY) {
  console.error("Error: Missing required environment variables.");
  process.exit(1);
}

// Crear servidor HTTP
const server = http.createServer(app);

// Inicializar WebSocket
initializeSocket(server);

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
