const User = require("../models/User");
const { generateToken } = require("./jwt");

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
        return { status: 200, token };
    } catch (err) {
        console.error("Error during registration:", err);
        return { status: 500, error: "Internal server error" };
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
