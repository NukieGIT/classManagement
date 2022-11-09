<template>

    <form class="wrapper2" @submit.prevent="addState">
        <h2>Numer komputera: {{ pc.pos }}</h2>
        <label for="opis">Opis</label>
        <textarea v-model="description" @input="autoResizeTextArea" id="opis" placeholder="Opis"></textarea>
        <Select v-model="selectedState" label-value="Stan">
            <option value="" seleceted hidden disabled>Wybierz stan</option>
            <option v-for="state in states" :value="state">{{ stateToPolish(state) }}</option>
        </Select>
        <fieldset>
            <legend>Data i godzina lekcyja</legend>
            <Input id="dateInput" v-model="selectedDate" @fired="canChangeOther = true" input-type="datetime-local" />
            <hr>
            <Input v-model="selectedHour" @fired="canChangeOther = true" :min="'1'" :max="(TimeTable.getTimeTableLen()).toString()" input-type="number" />
            <span style="color: red" v-if="tbError">{{ tbError }}</span>
        </fieldset>
        <button type="submit">Dodaj</button>
    </form>

</template>

<script setup>
    import Input from "@/components/Input.vue";
    import Select from "@/components/Select.vue";
    import axios from "axios";
    import { onMounted, ref, watch } from "vue";
    import authHeaderToken from "../services/authHeaderToken";
    import TimeTable from "../services/TimeTableService";

    const props = defineProps({
        pc: Object
    })

    const states = ref([])

    const selectedDate = ref()
    const selectedHour = ref()
    const selectedState = ref()
    const description = ref()

    const canChangeOther = ref(true)

    const tbError = ref()

    watch(selectedDate, (newDate) => {
        const newDateObject = new Date(newDate)
        const hours = newDateObject.getHours()
        const minutes = newDateObject.getMinutes()
        
        const tbClass = TimeTable.getClassID(`${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}`)
        const { error } = tbClass
        
        tbError.value = error
        if (!canChangeOther.value) return
        if (tbClass.error) {
            selectedHour.value = undefined
            return
        }
        selectedHour.value = tbClass.class.toString()
        canChangeOther.value = false
    })

    watch(selectedHour, (newHour) => {
        if (!canChangeOther.value) return

        let time = TimeTable.getTime(newHour)
        if (time === null) return
        time = time.split(":")
        const date = new Date(selectedDate.value)
        
        date.setHours(parseInt(time[0]), parseInt(time[1]) - date.getTimezoneOffset())
        selectedDate.value = date.toISOString().slice(0, 16)
        canChangeOther.value = false
    })
    
    onMounted(async () => {
        let now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        selectedDate.value = now.toISOString().slice(0, 16)

        try {
            const res = await axios.get('http://localhost:5823/states')

            states.value = (res.data.values).filter(st => st != "fixed")
        } catch (err) {
            console.log(err);
        }
    })

    async function addState() {
        console.log(selectedDate.value, selectedState.value, description.value);
        const data = { desc: description.value, date: selectedDate.value, condition: selectedState.value, pcUUID: props.pc.pcUUID }
        try {
            const res = await axios.post('http://localhost:5823/addState', data, authHeaderToken())
            console.log(res);
        } catch (err) {
            console.warn(err);
        }
    }

    function stateToPolish(state) {
        switch (state) {
            case "damaged":
                return "uszkodzony"
        
            case "broken":
                return "zniszczony"
        
            default:
                return state
        }
    }

    function autoResizeTextArea(e) {
        e.target.style.height = ""
        e.target.style.height = `${e.target.scrollHeight}px`
    }

</script>

<style scoped>

    .wrapper2 {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: 40vw;
        max-height: 50vh;
        max-width: 600px;
    }

    h2 {
        color: var(--text);
        margin-top: 0;
    }

    button {
        height: 20%;
    }

    fieldset {
        margin: 5% 0;
        border-radius: 10px;
    }

    textarea {
        resize: none;
    }

    label,
    legend {
        color: var(--text);
        text-align: center;
    }

</style>


