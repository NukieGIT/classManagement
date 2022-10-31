<template>

    <div class="wrapper custom-scroll theme-transition">
        <router-link v-for="room in rooms" :to="`rooms/${room.room_num}`" tag="div" class="room hover theme-transition">s{{ room.room_num }}<br />Ilość PC: {{ room.pc_count }}</router-link>
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

    .room {
        background-color: var(--bg-secondary);
        color: var(--text);
        flex: 0 0 85px;
        transition: filter 0.3s, box-shadow 0.3s;
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
