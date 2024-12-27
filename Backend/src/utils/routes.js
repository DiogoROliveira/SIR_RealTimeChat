const { register, login, authenticate } = require("./auth");
const { Router } = require("express");
const Room = require("../models/Room");
const router = new Router();

// Rota de teste
router.get("/test", (req, res) => {
    res.status(200).json({ message: "Rota de teste funcionando" });
});

// Registro de utilizador
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await register(username, password);

        if (result.status !== 201) {
            return res.status(result.status).json({ error: result.error });
        }

        res.status(201).json({
            message: "Utilizador registado com sucesso",
            token: result.token,
            user: result.user,
        });
    } catch (err) {
        console.error("Erro inesperado no registro:", err);
        res.status(500).json({ error: "Erro inesperado ocorreu" });
    }
});

// Login de utilizador
router.post("/login", login);

// Criar uma sala (rota protegida)
router.post("/rooms", authenticate, async (req, res) => {
    try {
        const { name, isPrivate } = req.body;
        const room = new Room({ name, isPrivate, users: [req.user.id] });
        await room.save();
        res.status(201).json({ message: "Sala criada com sucesso", room });
    } catch (err) {
        console.error("Erro ao criar sala:", err);
        res.status(500).json({ error: "Erro ao criar sala" });
    }
});

// Listar salas (rota protegida)
router.get("/rooms", authenticate, async (req, res) => {
    try {
        const rooms = await Room.find({ users: req.user.id }).populate("users", "username");
        res.status(200).json(rooms);
    } catch (err) {
        console.error("Erro ao listar salas:", err);
        res.status(500).json({ error: "Erro ao listar salas" });
    }
});

// Excluir sala (rota protegida)
router.delete("/rooms/:roomId", authenticate, async (req, res) => {
    try {
        const room = await Room.findById(req.params.roomId);
        if (!room) {
            return res.status(404).json({ error: "Sala não encontrada" });
        }

        if (!room.users.includes(req.user.id)) {
            return res.status(403).json({ error: "Você não tem permissão para excluir essa sala" });
        }

        await Room.deleteOne({ _id: req.params.roomId });

        res.status(200).json({ message: "Sala excluída com sucesso" });
    } catch (err) {
        console.error("Erro ao excluir sala:", err);
        res.status(500).json({ error: "Erro ao excluir sala" });
    }
});

module.exports = router;
