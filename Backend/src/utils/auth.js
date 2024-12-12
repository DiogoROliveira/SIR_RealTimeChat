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
async function login(username, password) {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return { status: 404, error: "User not found" };
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return { status: 401, error: "Invalid password" };
        }

        const token = generateToken(user._id);
        return { status: 200, message: "Login successful", token };
    } catch (err) {
        return { status: 500, message: "Internal server error", error: err };
    }
}

module.exports = { register, login };
