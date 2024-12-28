const User = require("../models/User");
const { generateToken } = require("./jwt");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
async function register(username, password) {
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return { status: 400, error: "Username já está em uso" };
        }

        const newUser = new User({ username, password });
        await newUser.save();

        const token = generateToken(newUser._id);
        return { status: 201, token, user: { id: newUser._id, username } };
    } catch (err) {
        console.error("Erro durante o registro:", err);
        return { status: 500, error: "Erro interno no servidor" };
    }
}

// Login
async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "Utilizador não encontrado" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Senha inválida" });
        }

        const token = generateToken(user._id);
        res.status(200).json({
            message: "Login bem-sucedido",
            token,
            user: { id: user._id, username },
        });
    } catch (err) {
        console.error("Erro durante o login:", err);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
}

// Middleware de autenticação
function authenticate(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1]; // "Bearer token"

    if (!token) {
        return res.status(401).json({ error: "Acesso não autorizado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Erro na autenticação:", err);

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expirado" });
        }

        if (err.name === "JsonWebTokenError") {
            return res.status(400).json({ error: "Token inválido" });
        }

        return res.status(500).json({ error: "Erro interno no servidor" });
    }
}

module.exports = { register, login, authenticate };
