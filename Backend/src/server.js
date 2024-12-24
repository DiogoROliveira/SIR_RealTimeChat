const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Configuração de variáveis de ambiente
dotenv.config();

if (!process.env.MONGO_URI) {
    console.error("⚠️  MONGO_URI não está configurado no .env");
    process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
const routes = require("./utils/routes");
app.use("/", routes);

// Endpoint de teste
app.get("/", (req, res) => {
    res.send("Chat App Backend Running");
});

// WebSocket connection
io.on("connection", (socket) => {
    console.log("🔗 User connected: ", socket.id);

    // Gerenciar eventos de mensagem ou outros eventos do chat aqui.

    socket.on("disconnect", () => {
        console.log("❌ User disconnected: ", socket.id);
    });
});

// Conexão com MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("✅ Connected to MongoDB");
        // Só inicia o servidor após conectar ao MongoDB
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error: ", err);
        process.exit(1);
    });
