<template>
    <FadeTransition>
        <Modal @hideModal="showModal = false" v-if="showModal">
            <AddState :pc="currPC"></AddState>
        </Modal>
    </FadeTransition>

    <h1 v-if="!doExist">BRAK KOMPUTERÓW</h1>
    <div class="wrapper">
        <div v-for="pc in pcs" class="pc hover theme-transition">
            <PC :show-label="true" :show-info="true">
                <template #info>
                    <p class="info-p theme-transition">Numer Komputera: {{ pc.room_pos }}</p>
                    <button @click="modalShow(pc.uuid, pc.room_pos)" class="add-button theme-transition" to="">Dodaj stan</button>
                </template>
                <template #history v-if="pc.exists">
                    <table class="table theme-transition">
                        <tr>
                            <th>Opis</th>
                            <th>Godzina</th>
                            <th>Data</th>
                        </tr>
                        <tr v-for="(item, index) in Math.min(stateLimit[1], pc.state_count)" :class="`status-${JSON.parse(pc.condition)[index]}`">
                            <td>{{ JSON.parse(pc.desc)[index] }}</td>
                            <td>{{ TimeTable.formatTimeTable(TimeTableService.getClassID(JSON.parse(pc.hour)[index])) }}</td>
                            <td>{{ JSON.parse(pc.date)[index] }}</td>
                        </tr>
                    </table>
                    <RouterLink class="hist-btn theme-transition" :to="`${useCurrentRoomPath().$state.currentRoom}/${pc.uuid}`">Pokaż Więcej</RouterLink>
                </template>
            </PC>
        </div>
    </div>

</template>
<script>

    export default {
        inheritAttrs: false
    }

</script>
<script setup>
    import axios from 'axios';
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import authHeaderToken from '@/services/authHeaderToken';
    import { useCurrentRoomPath } from '@/stores/CurrentRoomPath';
    import PC from "@/components/PC.vue";
    import TimeTableService from '../services/TimeTableService';
    import Modal from "@/components/Modal.vue";
    import AddState from "@/components/AddState.vue";
    import TimeTable from '../services/TimeTableService';
    import FadeTransition from './transitions/FadeTransition.vue';

    const pcs = ref([])
    const doExist = ref(true)

    const showModal = ref(false)
    const currPC = ref()

    const stateLimit = [0, 3]

    function modalShow(pcUUID, pos) {
        currPC.value = { pcUUID, pos }
        showModal.value = true
    }
    
    onMounted(async () => {
        useCurrentRoomPath().$state.currentRoom = useRoute().params.room
        try {
            const res = await axios.get('http://localhost:5823/pcs', {
                params: {
                    room: useRoute().params.room,
                    fromto: stateLimit
                },
                ...authHeaderToken()
            })
            if (!(res.data && res.data.values.length > 0)) {
                doExist.value = false
            }
            pcs.value = JSON.parse(res.data.values)
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

    .table th:last-child,
    .table td:last-child {
        width: 10ch;
    }

    .table {
        table-layout: fixed;
        min-width: 400px;
        overflow-x: auto;
        text-align: center;
        color: var(--text);
        width: 100%;
        height: 100%;
        background-color: var(--bg-nav);
        border-collapse: collapse;
    }

    .add-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 50%;
        border: none;
        font-size: 1rem;
        text-decoration: none;
        color: var(--text);
        background-color: var(--bg-nav);
    }

    .add-button:hover {
        text-decoration: underline;
        cursor: pointer;
    }

    .hist-btn {
        height: 15%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: var(--text);
    }

    .hist-btn:hover {
        text-decoration: underline;
    }

    .info-p {
        color: var(--text);
    }


</style>