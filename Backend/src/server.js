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
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

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

// middlewares
app.use(
    cors({
        origin: (origin, callback) => {
            callback(null, true);
        },
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route manager
app.use("/", routes);

// serve static files
app.use(express.static(path.join(__dirname, "../../Frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"));
});

// WebSocket connection
io.on("connection", (socket) => {
    console.log("🔗 User connected: ", socket.id);

    socket.on("authenticate", (token) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
        } catch (err) {
            console.error("Erro na autenticação do socket:", err.message);
            socket.emit("authError", "Erro na autenticação do socket: jwt expired");
        }
    });

    socket.on("createRoom", async (data) => {
        try {
            const { name, description } = data;

            if (!socket.userId) {
                console.log("🔒 User not authenticated");
                return;
            }

            const user = await User.findById(socket.userId);
            if (!user) {
                console.log("❌ User not found");
                return;
            }

            const room = new Room({
                name,
                description,
                owner: user._id,
                members: [user._id],
            });

            await room.save();
            console.log(`🚪 Room created: ${room._id}`);

            user.rooms.push(room._id);
            await user.save();

            socket.emit("roomCreated", room);
        } catch (err) {
            console.error("❌ Error creating room: ", err);
        }
    });

    socket.on("roomDeleted", async (roomId) => {
        try {
            const room = await Room.findById(roomId).populate("users");
            if (!room) return;
            io.to(roomId).emit("roomDeleted", { roomId });
        } catch (err) {
            console.error("Error in roomDeleted: ", err);
        }
    });

    socket.on("joinRoom", async (roomId) => {
        try {
            if (!socket.userId) return;

            const user = await User.findById(socket.userId);

            if (!user) return;

            socket.join(roomId);

            const room = await Room.findById(roomId).populate("users");
            if (!room) return;

            sysMessage = {
                user: null,
                message: `${user.username} entrou na sala!`,
                type: "join",
                timestamp: new Date(),
            };

            room.messages.push(sysMessage);
            await room.save();

            io.to(roomId).emit("systemMessage", sysMessage);

            console.log(`🔊 User ${socket.id} joined room: ${roomId}`);
        } catch (err) {
            console.error("Error in joinRoom:", err);
        }
    });

    socket.on("leaveRoom", async (roomId) => {
        try {
            if (!socket.userId) return;

            const user = await User.findById(socket.userId);
            if (!user) return;

            socket.leave(roomId);

            const room = await Room.findById(roomId).populate("users");
            if (!room) return;

            sysMessage = {
                user: null,
                message: `${user.username} saiu da sala!`,
                type: "leave",
                timestamp: new Date(),
            };

            room.messages.push(sysMessage);
            await room.save();

            io.to(roomId).emit("systemMessage", sysMessage);
            io.to(roomId).emit("updateUsers", room);
            console.log(`🔇 User ${socket.id} left room: ${roomId}`);
        } catch (err) {
            console.error("Error in leaveRoom: ", err);
        }
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
                type: null,
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

    socket.on("kickUser", async (data) => {
        try {
            const { roomId, userId } = data;
            const user = await User.findById(userId);
            if (!user) return;

            const room = await Room.findById(roomId).populate("users");
            if (!room) return;

            sysMessage = {
                user: null,
                message: `${user.username} foi removido da sala!`,
                type: "kick",
                timestamp: new Date(),
            };

            room.messages.push(sysMessage);
            await room.save();
            io.to(roomId).emit("systemMessage", sysMessage);
            io.to(roomId).emit("userKicked", { userId, roomId });
        } catch (err) {
            console.error("Error in kickUser: ", err);
        }
    });

    socket.on("selectRoom", async (roomId) => {
        socket.join(roomId);
        console.log(`🔊 User ${socket.id} joined room: ${roomId}`);
    });

    socket.on("deselectRoom", async (roomId) => {
        socket.leave(roomId);
        console.log(`🔇 User ${socket.id} left room: ${roomId}`);
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected: ", socket.id);
    });
});

// MongoDB and server start
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
