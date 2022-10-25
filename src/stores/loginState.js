import { defineStore } from "pinia";

export const useLoginState = defineStore({
    id: 'loginState',
    state: () => ({
        jwtExpired: false,
        jwtExpiredMsg: "Sesja wygasła, prosimy zalogować się ponownie",
        isAuth: false
    }),
    actions: {
        isJWTExpired(val) {
            this.jwtExpired = val
        }
    }
})