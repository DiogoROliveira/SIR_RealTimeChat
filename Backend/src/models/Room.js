const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isPrivate: { type: Boolean, default: false },
    accessCode: { type: String, default: null },
    capacity: { type: Number, default: 10 }, 
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messages: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
