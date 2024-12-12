const dotenv = require("dotenv");
const { register, login } = require("./auth");
dotenv.config();

// express router middleware
const { Router } = require("express");
const router = new Router();

router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await register(username, password);

        if (result.status !== 200) {
            return res.status(result.status).json({ message: result.error });
        }

        res.status(200).json({ message: "User registered successfully", token: result.token });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ message: "Unexpected error occurred" });
    }
});

router.get("/test", async (req, res) => {
    try {
        console.log("test route");
        res.status(200).json({ message: "Test route" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Error on test route" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await login(username, password);

        if (result.status !== 200) {
            console.error(result.error);
            return res.status(result.status).json({ message: result.error });
        }

        res.status(200).json({ message: "Login successful", token: result.token });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ message: "Unexpected error occurred" });
    }
});

module.exports = router;
