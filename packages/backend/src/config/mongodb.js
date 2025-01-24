import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // Cargar las variables de entorno

const mongoURL = process.env.MONGO_URI; // Usar la variable del archivo .env

const connectToDatabase = async () => {
  try {
    if (!mongoURL) {
      throw new Error("La variable MONGO_URI no está definida en el archivo .env");
    }

    await mongoose.connect(mongoURL);
    console.log("Conexión exitosa a la base de datos");
    console.log(`Conectado a la base de datos en ${mongoURL}`);
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    console.error(`Error de conexión a la base de datos en ${mongoURL}`);
    process.exit(1);
  }
};

export default connectToDatabase;
