<template>

    <div class="wrapper theme-transition">
        <router-link v-for="room in rooms" :to="`rooms/${room.room_num}`" tag="div" class="room theme-transition">s{{ room.room_num }}<br />Ilość PC: {{ room.pc_count }}</router-link>
    </div>

</template>

<style scoped>

    .wrapper {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }

    .wrapper::-webkit-scrollbar {
        width: 12px;
    }

    .wrapper::-webkit-scrollbar-track {
        background-color: var(--bg-nav);
    }

    .wrapper::-webkit-scrollbar-thumb {
        background-color: rgb(101, 90, 107);
        border-radius: 500px;
    }

    .room {
        background-color: var(--bg-secondary);
        color: var(--text);
        flex: 0 0 85px;
    }

    .room:hover {
        cursor: pointer;
        filter: brightness(1.1);
        -webkit-box-shadow: 0px 5px 8px -5px black;
        -moz-box-shadow: 0px 5px 8px -5px black;
        box-shadow: 0px 5px 8px -5px black;
    }

</style>

<script setup>
    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import authHeaderToken from '@/services/authHeaderToken';

    const rooms = ref([])

    onMounted(async () => {
        try {
            const res = await axios.get('http://localhost:5823/rooms', authHeaderToken())
            rooms.value = JSON.parse(res.data.values)
        } catch (err) {
            console.log(err)
        }
    })



</script>
