<template>

<!-- TODO CLICKABLE -->
    <div class="wrapper">
        <div v-for="pc in pcs" :data-pc="pc.uuid" class="pc theme-transition">{{ pc.room_pos }}</div>
    </div>

</template>

<script setup>
    import axios from 'axios';
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import authHeaderToken from '@/services/authHeaderToken';
    import { useCurrentRoomPath } from '@/stores/CurrentRoomPath';

    const pcs = ref([])
    
    onMounted(async () => {
        useCurrentRoomPath().$state.currentRoom = useRoute().params.room
        try {
            const res = await axios.get('http://localhost:5823/pcs', {
                params: {
                    room: useRoute().params.room
                },
                ...authHeaderToken()
            })
            pcs.value = res.data.values
        } catch (err) {
            console.log(err);
        }
    })

</script>

<style scoped>

    .wrapper {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
    }

    .pc {
        background-color: var(--bg-secondary);
        aspect-ratio: 1;
    }

</style>
<script>

    export default {
        inheritAttrs: false
    }

</script>