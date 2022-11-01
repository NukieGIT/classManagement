<template>
    <div class="wrapper">
        <PC :show-label="false" :show-info="false">
            <template #history>
                <div class="table-container">
                    <table class="table theme-transition">
                        <tr>
                            <th>Opis</th>
                            <th>Godzina</th>
                            <th>Data</th>
                        </tr>
                        <tr v-for="state in states" :class="`status-${state.condition}`">
                            <td>{{ state.description }}</td>
                            <td>{{ TimeTable.getClassID(state.hour) }}</td>
                            <td>{{ state.date }}</td>
                        </tr>
                    </table>
                </div>
            </template>
        </PC>
    </div>

</template>

<script setup>
    import PC from "@/components/PC.vue";
    import { onMounted, ref } from 'vue';
    import { useCurrentRoomPath } from '@/stores/CurrentRoomPath';
    import { useRoute } from 'vue-router';
    import axios from 'axios';
    import authHeaderToken from '../services/authHeaderToken';
    import TimeTable from "../services/TimeTable/TimeTableService";

    const states = ref()

    onMounted(async () => {
        try {
            const res = await axios.get(`http://localhost:5823/pcs/${useRoute().params.pc}`, {
                params: {
                    room: useRoute().params.room,
                },
                ...authHeaderToken()
            })
            states.value = res.data.values
        } catch (err) {
            console.log(err);
        }
    })


</script>

<style scoped>

    .wrapper {
        width: 100%;
        height: calc(100vh - 20px - var(--header-height));
        margin-top: 20px;
    }

    .info-p {
        color: var(--text);
    }

    .table th {
        border-bottom: 1px solid var(--bg-secondary);
        height: 15%;
    }

    .table tr > td:not(:last-child) {
        border-right: 1px solid var(--bg-secondary);
    }

    .table-container {
        overflow-x: auto;
        width: 100%;
        height: 100%;
    }

    .table {
        text-align: center;
        color: var(--text);
        width: 100%;
        min-height: 30%;
        background-color: var(--bg-nav);
        border-collapse: collapse;
    }

</style>