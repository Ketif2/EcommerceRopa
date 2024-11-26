import mongoose from 'mongoose';

const mongoURL = 'mongodb://localhost:27017/musicplayer';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("Conexión exitosa a la base de datos");
    console.log(`Conectado a la base de datos en ${mongoURL}`);
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    console.error(`Error de conexión a la base de datos en ${mongoURL}`);
    process.exit(1);
  }
};

export default connectToDatabase;