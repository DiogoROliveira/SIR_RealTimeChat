const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isPrivate: { type: Boolean, default: false },  // Indica se a sala é privada
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Lista de usuários que participam da sala
    messages: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
