import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";

import auth from "../middleware/auth";
import { useLoginState } from "../stores/loginState";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Login",
            component: Login
        },
        {
            path: "/dashboard",
            name: "Dashboard",
            component: () => import("../views/Dashboard.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/dashboard/rooms",
            name: "Rooms",
            component: () => import("../views/Rooms.vue"),
            meta: {
                requiresAuth: true
            }
        }
    ],
});

router.beforeResolve(async (to, from) => {
    const token = localStorage.getItem("token")
    if (token === null && to.meta.requiresAuth) {
        return "/"
    } else if (!to.meta.requiresAuth) {
        return true
    } else if (token && to.meta.requiresAuth) {
        if (await auth()) {
            useLoginState().$state.isAuth = true
            return true
        } else {
            useLoginState().$state.isAuth = false
            return "/"
        }
    }
})

export default router;
