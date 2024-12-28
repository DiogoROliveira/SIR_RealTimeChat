const { register, login, authenticate } = require("./auth");
const { Router } = require("express");
const Room = require("../models/Room");
const router = new Router();

const crypto = require("crypto");

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

router.post("/login", login);

// Criar uma sala (rota protegida)
router.post("/rooms", authenticate, async (req, res) => {
    try {
        const { name, isPrivate, capacity } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, error: "O nome da sala é obrigatório." });
        }

        // Verificar se já existe uma sala com o mesmo nome
        const existingRoom = await Room.findOne({ name });
        if (existingRoom) {
            return res
                .status(400)
                .json({ success: false, error: "Uma sala com esse nome já existe." });
        }

        // Gerar código de acesso se a sala for privada
        const accessCode = isPrivate ? crypto.randomBytes(4).toString("hex") : null;

        const room = new Room({
            name,
            isPrivate: isPrivate || false,
            accessCode,
            capacity: capacity || 10,
            users: [req.user.id],
            creator: req.user.id,
        });

        await room.save();

        res.status(201).json({
            success: true,
            message: "Sala criada com sucesso",
            data: {
                id: room.id,
                name: room.name,
                isPrivate: room.isPrivate,
                accessCode: room.accessCode || null,
                capacity: room.capacity,
            },
        });
    } catch (err) {
        console.error("Erro ao criar sala:", err);
        res.status(500).json({ success: false, error: "Erro ao criar sala." });
    }
});

// Listar salas (rota protegida)
router.get("/rooms", authenticate, async (req, res) => {
    try {
        // Buscar salas públicas e privadas em que o usuário é membro
        const rooms = await Room.find({
            $or: [
                { isPrivate: false }, // Salas públicas
                { isPrivate: true, users: req.user.id }, // Salas privadas do usuário
            ],
        }).sort({ createdAt: -1 }); // Ordena pelas mais recentes (descendente)

        res.status(200).json({
            success: true,
            message: "Salas listadas com sucesso",
            data: rooms,
        });
    } catch (err) {
        console.error("Erro ao listar salas:", err);
        res.status(500).json({
            success: false,
            error: "Erro ao listar salas",
        });
    }
});

// Excluir sala (rota protegida)
router.delete("/rooms/:roomId", authenticate, async (req, res) => {
    try {
        const room = await Room.findById(req.params.roomId);

        if (!room) {
            return res.status(404).json({ error: "Sala não encontrada" });
        }

        // Verificar se o usuário atual é o criador da sala
        if (room.creator.toString() !== req.user.id) {
            return res.status(403).json({ error: "Você não tem permissão para excluir essa sala" });
        }

        await Room.deleteOne({ _id: req.params.roomId });
        res.status(200).json({ message: "Sala excluída com sucesso" });
    } catch (err) {
        console.error("Erro ao excluir sala:", err);
        res.status(500).json({ error: "Erro ao excluir sala" });
    }
});

// Editar uma sala (rota protegida)
router.put("/rooms/:roomId", authenticate, async (req, res) => {
    try {
        const { name, isPrivate, capacity } = req.body; // Campos que podem ser atualizados
        const { roomId } = req.params;

        // Buscar a sala pelo ID
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: "Sala não encontrada" });
        }

        // Verificar se o usuário é o criador da sala
        if (room.creator.toString() !== req.user.id) {
            return res.status(403).json({ error: "Você não tem permissão para editar essa sala" });
        }

        // Atualizar os campos permitidos
        if (name) room.name = name;
        if (isPrivate !== undefined) room.isPrivate = isPrivate;
        if (capacity !== undefined) {
            if (capacity < room.users.length) {
                return res.status(400).json({
                    error: "A capacidade não pode ser menor que o número atual de usuários na sala",
                });
            }
            room.capacity = capacity;
        }

        // Salvar as alterações
        await room.save();

        res.status(200).json({
            message: "Sala atualizada com sucesso",
            room,
        });
    } catch (err) {
        console.error("Erro ao editar sala:", err);
        res.status(500).json({ error: "Erro ao editar sala" });
    }
});

// Entrar em uma sala (rota protegida)
router.post("/rooms/:roomId/join", authenticate, async (req, res) => {
    try {
        const room = await Room.findById(req.params.roomId);

        if (!room) {
            return res.status(404).json({ error: "Sala não encontrada" });
        }

        // Se a sala for privada, verificar o código de acesso (pode ser feito de várias formas)
        if (room.isPrivate) {
            const { accessCode } = req.body;
            if (!accessCode || accessCode !== room.accessCode) {
                return res.status(403).json({ error: "Código de acesso inválido" });
            }
        }

        // Verificar se o usuário já está na sala
        if (room.users.includes(req.user.id)) {
            return res.status(400).json({ error: "Você já está nesta sala" });
        }

        // Verificar se a sala tem capacidade para mais participantes
        if (room.capacity && room.users.length >= room.capacity) {
            return res.status(400).json({ error: "Sala cheia" });
        }

        // Adicionar o usuário à sala
        room.users.push(req.user.id);
        await room.save();

        res.status(200).json({ message: "Você entrou na sala com sucesso", room });
    } catch (err) {
        console.error("Erro ao entrar na sala:", err);
        res.status(500).json({ error: "Erro ao entrar na sala" });
    }
});

// Rota para o usuário sair da sala
router.post("/rooms/:roomId/leave", authenticate, async (req, res) => {
    try {
        const { roomId } = req.params;

        // Buscar a sala pelo ID
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: "Sala não encontrada" });
        }

        // Verificar se o usuário está na sala
        if (!room.users.includes(req.user.id)) {
            return res.status(400).json({ error: "Você não está nesta sala" });
        }

        // Remover o usuário da sala
        room.users = room.users.filter((userId) => userId.toString() !== req.user.id);

        // Salvar as alterações
        await room.save();

        res.status(200).json({ message: "Você saiu da sala com sucesso", room });
    } catch (err) {
        console.error("Erro ao sair da sala:", err);
        res.status(500).json({ error: "Erro ao sair da sala" });
    }
});

// Rota para o admin/criador expulsar um usuário
router.post("/rooms/:roomId/kick", authenticate, async (req, res) => {
    try {
        const { roomId } = req.params;
        const { userId } = req.body;

        // Buscar a sala pelo ID
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: "Sala não encontrada" });
        }

        // Verificar se o usuário que está tentando expulsar é o criador/admin da sala
        if (room.creator.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ error: "Você não tem permissão para expulsar usuários desta sala" });
        }

        // Verificar se o usuário a ser expulso está na sala
        if (!room.users.includes(userId)) {
            return res.status(400).json({ error: "O usuário não está nesta sala" });
        }

        // Remover o usuário da sala
        room.users = room.users.filter((user) => user.toString() !== userId);

        // Salvar as alterações
        await room.save();

        res.status(200).json({ message: "Usuário expulso com sucesso", room });
    } catch (err) {
        console.error("Erro ao expulsar usuário:", err);
        res.status(500).json({ error: "Erro ao expulsar usuário" });
    }
});

module.exports = router;
