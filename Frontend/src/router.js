import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";

const routes = [
    { path: "/", name: "Home", component: Home }, // Página inicial
    { path: "/login", name: "Login", component: Login }, // Página de login
    { path: "/register", name: "Register", component: Register }, // Página de registro
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
