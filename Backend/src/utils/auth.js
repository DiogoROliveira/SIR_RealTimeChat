const { User } = require("../models/User.js");
const { generateToken } = require("./jwt.js");

// Register
async function register(req, res) {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        const token = generateToken(newUser._id);
        res.status(201).json({ message: "Utilizador criado com sucesso", token });
    } catch (err) {
        res.status(400).json({ error: "Erro ao registrar o utilizador" });
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

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Senha inválida" });
        }

        const token = generateToken(user._id);
        res.status(200).json({ message: "Login bem-sucedido", token });
    } catch (err) {
        res.status(500).json({ error: "Erro no servidor" });
    }
}

module.exports = { register, login };
