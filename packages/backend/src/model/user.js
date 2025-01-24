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

const subscriptionSchema = new mongoose.Schema({
  planId: {
    type: String, // ID del plan en PayPal
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "CANCELLED"],
    default: "ACTIVE",
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
    type: [playlistSchema],
    default: [],
  },
  subscriptions: {
    type: [subscriptionSchema], // Relación con el esquema de suscripciones
    default: [],
  },
});

const User = mongoose.model("User", userSchema);
export default User;
