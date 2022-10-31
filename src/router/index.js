import { createRouter, createWebHistory, RouterView } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";

import auth from "../middleware/auth";
import { useLoginState } from "../stores/loginState";
import { h } from "vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Dashboard",
            component: Dashboard,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/login",
            name: "Login",
            component: () => import("@/views/Login.vue")
        },
        {
            path: "/rooms",
            alias: ["/classrooms"],
            component: { render: () => h(RouterView) },
            children: [
                {
                    path: "",
                    name: "Rooms",
                    component: () => import("@/views/Rooms.vue"),
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: ":room",
                    name: "Room",
                    component: () => import("@/views/Room.vue"),
                    meta: {
                        requiresAuth: true
                    }
                }
            ],
            meta: {
                requiresAuth: true
            }
        },
        // {
        //     path: "/rooms/:room",
        //     name: "Room",
        //     component: () => import("@/views/Room.vue"),
        //     meta: {
        //         requiresAuth: true
        //     }
        // },
        {
            path: "/users",
            name: "Users",
            component: () => import("@/views/Users.vue"),
            meta: {
                requiresAuth: true
            }
        }
    ],
});

router.beforeResolve(async (to, from) => {
    const token = localStorage.getItem("token")
    if (token === null && to.meta.requiresAuth) {
        return "/login"
    } else if (!to.meta.requiresAuth) {
        return true
    } else if (token && to.meta.requiresAuth) {
        if (await auth()) {
            useLoginState().$state.isAuth = true
            return true
        } else {
            useLoginState().$state.isAuth = false
            return "/login"
        }
    }
})

export default router;
