import xss from "xss";

/**
 * Maneja los mensajes de chat, sanitizando y validando los datos.
 * @param {Object} io - Instancia de Socket.IO.
 * @param {Object} socket - Conexión de socket del cliente.
 */
const handleChatMessage = (io, socket) => {
  socket.on("chatMessage", (msg) => {
    // Sanitizar el mensaje recibido
    const sanitizedMessage = xss(msg, {
      whiteList: {}, // Permitir solo texto plano (sin HTML)
    });

    // Validar longitud del mensaje
    if (sanitizedMessage.length > 0 && sanitizedMessage.length <= 200) {
      // Emitir el mensaje a todos los clientes conectados
      io.emit("chatMessage", {
        username: socket.username || "Anonymous",
        text: sanitizedMessage,
      });
    } else {
      // Enviar error si el mensaje no cumple con las validaciones
      socket.emit("errorMessage", "Message is invalid or too long.");
    }
  });
};

export default handleChatMessage; // Exportación por defecto