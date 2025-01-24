import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); // Carga las variables de entorno desde el archivo .env

const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No token provided in headers");
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
  
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY);
      req.user = decoded; // Adjunta los datos del usuario al request
      next();
    } catch (error) {
      console.error("Error verifying token:", error.message);
      res.status(401).json({ error: "Invalid or expired token." });
    }
  };
  

export default verifyToken;
