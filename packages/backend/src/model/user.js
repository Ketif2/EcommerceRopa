import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  songs: {
    type: [String], // IDs de canciones
    default: [],
  },
});

const userSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  playlists: {
    type: [playlistSchema], // Relación con el esquema de playlists
    default: [],
  },
});

const User = mongoose.model("User", userSchema);
export default User;
