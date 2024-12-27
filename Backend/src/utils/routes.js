const { register, login } = require("./auth");
const { Router } = require("express");
const router = new Router();

// Registro de utilizador
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await register(username, password);

        if (result.status !== 200) {
            return res.status(result.status).json({ error: result.error });
        }

        res.status(200).json({
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
router.post("/login", async (req, res) => {
    try {
        await login(req, res);
    } catch (err) {
        console.error("Erro inesperado no login:", err);
        res.status(500).json({ error: "Erro inesperado ocorreu" });
    }
});

// Teste de rota
router.get("/test", async (req, res) => {
    try {
        console.log("Rota de teste acessada");
        res.status(200).json({ message: "Rota de teste funcionando" });
    } catch (err) {
        console.error("Erro na rota de teste:", err);
        res.status(400).json({ error: "Erro na rota de teste" });
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
