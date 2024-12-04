const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Gerar um token
function generateToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
}

// Verificar um token
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        throw new Error("Token inválido ou expirado");
    }
}

module.exports = { generateToken, verifyToken };
