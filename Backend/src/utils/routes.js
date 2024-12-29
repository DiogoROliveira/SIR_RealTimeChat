const { register, login, authenticate, userAuth } = require("./auth");
const { Router } = require("express");
const { mongoose } = require("mongoose");
const Room = require("../models/Room");
const User = require("../models/User");
const router = new Router();

const crypto = require("crypto");

/*
// Rota de teste
router.get("/test", (req, res) => {
    res.status(200).json({ message: "Rota de teste funcionando" });
});
*/

// ============================== UTILIZADORES ==============================

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

router.get("/user", userAuth, (req, res) => {
    const { username } = req.user;

    res.status(200).json({
        user: {
            _id: req.user._id.toString(),
            username,
            bio: req.user.bio || "Nenhuma biografia disponível",
            profilePicture: req.user.profilePicture || null,
        },
    });
});

router.put("/user/profile", authenticate, async (req, res) => {
    try {
        const { bio, profilePicture } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        if (bio !== undefined) user.bio = bio;
        if (profilePicture !== undefined) user.profilePicture = profilePicture;

        await user.save();

        res.status(200).json({
            message: "Perfil atualizado com sucesso",
            user: {
                username: user.username,
                bio: user.bio,
                profilePicture: user.profilePicture,
            },
        });
    } catch (err) {
        console.error("Erro ao atualizar perfil:", err);
        res.status(500).json({ error: "Erro ao atualizar perfil" });
    }
});

// ============================== SALAS ==============================

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

        const io = req.app.get("io");
        io.to(req.user.id).emit("roomCreated", {
            id: room.id,
            name: room.name,
            isPrivate: room.isPrivate,
            accessCode: room.accessCode || null,
            capacity: room.capacity,
        });

        res.status(201).json({
            success: true,
            message: "Sala criada com sucesso",
            data: {
                _id: room.id,
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
            users: req.user.id, // Salas onde o usuário é membro
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

router.get("/rooms/public", authenticate, async (req, res) => {
    try {
        const rooms = await Room.find({
            isPrivate: false,
            users: { $not: { $eq: req.user.id } },
        }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            message: "Salas públicas listadas com sucesso",
            data: rooms,
        });
    } catch (err) {
        console.error("Erro ao listar salas públicas:", err);
        res.status(500).json({
            success: false,
            error: "Erro ao listar salas públicas",
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

router.get("/rooms/:roomId", authenticate, async (req, res) => {
    try {
        const roomId = req.params.roomId;

        if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(400).json({ error: "ID da sala inválido" });
        }

        const room = await Room.findById(roomId).populate("users").populate("creator");

        if (!room) {
            return res.status(404).json({ error: "Sala não encontrada" });
        }

        // Verifique se o usuário logado é o criador da sala (administrador)
        const isAdmin = room.creator._id.toString() === req.user.id;

        res.json({
            room: {
                name: room.name,
                capacity: room.capacity,
                isPrivate: room.isPrivate,
                users: room.users,
                isAdmin,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar informações da sala" });
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

router.get("/rooms/:roomId/messages", authenticate, async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId).populate({
            path: "messages.user",
            select: "username profilePicture -_id",
        });

        if (!room) {
            return res.status(404).json({ error: "Sala não encontrada" });
        }

        if (room.isPrivate && !room.users.includes(req.user.id)) {
            return res.status(403).json({ error: "Você não tem acesso a esta sala" });
        }

        // Formata as mensagens para retornar
        const messages = room.messages.map((msg) => {
            if (!msg.user) {
                return {
                    id: msg._id,
                    text: msg.message,
                    user: {
                        username: "Sistema",
                        profilePicture: null,
                    },
                    type: msg.type,
                    timestamp: msg.timestamp,
                };
            }
            return {
                id: msg._id,
                text: msg.message,
                user: {
                    username: msg.user.username,
                    profilePicture: msg.user.profilePicture,
                },
                type: msg.type,
                timestamp: msg.timestamp,
            };
        });

        res.status(200).json({ messages });
    } catch (err) {
        console.error("Erro ao buscar mensagens:", err);
        res.status(500).json({ error: "Erro ao buscar mensagens" });
    }
});

module.exports = router;
