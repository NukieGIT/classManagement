<template>

<!-- TODO CLICKABLE -->
    <div class="wrapper">
        <div v-for="pc in pcs" :data-pc="pc.uuid" class="pc hover theme-transition">
            <PC>
                <template #info>
                    <p class="info-p theme-transition">Numer Komputera: {{ pc.room_pos }}</p>
                    <button>Dodaj Stan</button>
                </template>
                <template #history v-if="pc.exists">
                    <table class="table theme-transition">
                        <tr>
                            <th>Opis</th>
                            <th>Data</th>
                            <th>Godzina</th>
                        </tr>
                        <tr v-for="(item, index) in JSON.parse(pc.condition)" :class="`status-${JSON.parse(pc.condition)[index]}`">
                            <td>{{ JSON.parse(pc.desc)[index] }}</td>
                            <td>{{ JSON.parse(pc.date)[index] }}</td>
                            <td>{{ TimeTable.getClassID(JSON.parse(pc.hour)[index]) }}</td>
                        </tr>
                    </table>
                    <button class="hist-btn">Pokaż Więcej</button>
                </template>
            </PC>
        </div>
    </div>

</template>

<script setup>
    import axios from 'axios';
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import authHeaderToken from '@/services/authHeaderToken';
    import { useCurrentRoomPath } from '@/stores/CurrentRoomPath';
    import PC from "@/components/PC.vue";
    import TimeTable from '../services/TimeTable/TimeTableService';

    const pcs = ref([])
    
    onMounted(async () => {
        useCurrentRoomPath().$state.currentRoom = useRoute().params.room
        try {
            const res = await axios.get('http://localhost:5823/pcs', {
                params: {
                    room: useRoute().params.room,
                    fromto: [0, 3]
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

    button {
        cursor: pointer;
    }

    .wrapper {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fit, 500px);
        justify-content: center;
        gap: 10px;
    }

    .pc.theme-transition {
        background-color: var(--bg-secondary);
        aspect-ratio: 1;
        transition: filter 0.3s, box-shadow 0.3s, background-color 0.5s ease-in-out, color 1s ease-in-out;
    }
    .table th {
        border-bottom: 1px solid var(--bg-secondary);
        height: 15%;
    }

    .table tr > td:not(:last-child) {
        border-right: 1px solid var(--bg-secondary);
    }

    .table {
        text-align: center;
        color: var(--text);
        width: 100%;
        height: 100%;
        background-color: var(--bg-nav);
        border-collapse: collapse;
    }

    .hist-btn {
        height: 15%;
        width: 100%;
    }

    .info-p {
        color: var(--text);
    }

    .status-fixed {
        color: var(--repaired-accent);
        /* box-shadow: inset 0 0 0 100vw var(--repaired-accent); */
    }

    .status-damaged {
        color: var(--slightly-damaged-accent);
        /* box-shadow: inset 0 0 0 100vw var(--slightly-damaged-accent); */
    }

    .status-broken {
        color: var(--severly-damaged-accent);
        /* box-shadow: inset 0 0 0 100vw var(--severly-damaged-accent); */
    }


</style>
<script>

    export default {
        inheritAttrs: false
    }

</script>