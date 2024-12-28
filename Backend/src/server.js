const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const jwt = require("jsonwebtoken");
const routes = require("./utils/routes");
const Room = require("./models/Room");
const User = require("./models/User");
const { timeStamp } = require("console");

dotenv.config();

if (!process.env.MONGO_URI) {
    console.error("⚠️ MONGO_URI não está configurado no .env");
    process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
app.set("io", io);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/", routes);

// Endpoint de teste
app.get("/", (req, res) => {
    res.send("Chat App Backend Running");
});

// WebSocket connection
io.on("connection", (socket) => {
    console.log("🔗 User connected: ", socket.id);

    socket.on("authenticate", (token) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
        } catch (err) {
            console.error("Erro na autenticação do socket:", err);
        }
    });

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`🔊 User ${socket.id} joined room: ${roomId}`);
    });

    socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
        console.log(`🔇 User ${socket.id} left room: ${roomId}`);
    });

    socket.on("message", async (data) => {
        try {
            const { roomId, message } = data;

            if (!socket.userId) {
                console.log("🔒 User not authenticated");
                return;
            }

            const room = await Room.findById(roomId);
            if (!room) {
                console.log("❌ Room not found");
                return;
            }

            const messageObj = {
                user: socket.userId,
                message: message.text,
                timeStamp: new Date(),
            };

            room.messages.push(messageObj);
            await room.save();

            const user = await User.findById(socket.userId);
            const messageToSend = {
                id: messageObj._id,
                text: message.text,
                user: {
                    username: user.username,
                    profilePicture: user.profilePicture,
                },
                timeStamp: messageObj.timeStamp,
            };

            io.to(roomId).emit("message", messageToSend);
        } catch (err) {
            console.error("❌ Error sending message: ", err);
        }
    });

    // Enviar uma mensagem para uma sala específica
    socket.on("sendMessage", (roomId, message) => {
        io.to(roomId).emit("message", message); // Enviar a mensagem para todos na sala
        console.log(`📩 Message sent to room ${roomId}: ${message}`);
    });

    // Desconectar o usuário
    socket.on("disconnect", () => {
        console.log("❌ User disconnected: ", socket.id);
    });
});

// Conexão com MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB");
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error: ", err);
        process.exit(1);
    });
