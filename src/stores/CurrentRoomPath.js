import { defineStore } from "pinia";

export const useCurrentRoomPath = defineStore({
    id: 'currentRoomPath',
    state: () => ({
        currentRoom: undefined,
        currentPC: undefined
    })
})