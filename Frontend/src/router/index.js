import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Home from "../components/Home.vue";
import Dashboard from "../components/Dashboard.vue";

const routes = [
    { path: "/", component: Home },
    {
        path: "/login",
        component: Login,
        beforeEnter: (to, from, next) => {
            const token = sessionStorage.getItem("token");
            if (token) {
                next("/dashboard");
            } else {
                next();
            }
        },
    },
    {
        path: "/register",
        component: Register,
        beforeEnter: (to, from, next) => {
            const token = sessionStorage.getItem("token");
            if (token) {
                next("/dashboard");
            } else {
                next();
            }
        },
    },
    {
        path: "/dashboard",
        component: Dashboard,
        beforeEnter: (to, from, next) => {
            const token = sessionStorage.getItem("token");
            if (token) {
                next();
            } else {
                next("/login");
            }
        },
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("../components/NotFound.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
