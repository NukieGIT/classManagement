<template>

    <form class="loginContainer" @submit.prevent="validateServerSide">
        <Input v-model="loginDetails.login" label-value="Login" input-type="text" />
        <Input v-model="loginDetails.password" label-value="Hasło" input-type="password" />
        <!-- <Input v-model="loginDetails.perms" label-value="Permisje" input-type="" /> -->
        <Select v-model="loginDetails.perms" label-value="Permisje">
            <option v-for="perm in perms" :value="perm">{{ perm }}</option>
        </Select>
        <Input v-model="loginDetails.fname" label-value="Imie" input-type="text" />
        <Input v-model="loginDetails.lname" label-value="Nazwisko" input-type="text" />
        <button type="submit">Dodaj</button>
        <p v-if="error">{{ errorValue }}</p>
        {{ loginDetails }}
    </form>

</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import Input from '../components/Input.vue';
    import axios from "axios";
    import Select from './Select.vue';
    import authHeaderToken from "../services/authHeaderToken.js";

    const loginDetails = ref({login: "", password: "", perms: "", fname: "", lname: ""});

    const error = ref(false)
    const errorValue = ref(null)
    const perms = ref([])

    onMounted(async () => {
        try {
            const res = await axios.get('http://localhost:5823/perms', authHeaderToken())
            perms.value = res.data.values

        } catch (err) {
            // error.value = true
            // errorValue.value = err.message
        }
    })

    async function validateServerSide() {
        // TODO user addition validation
        try {
            const res = await axios.post('http://localhost:5823/signup', loginDetails.value, authHeaderToken())
            console.log(res.data);
            
        } catch (err) {
            error.value = true
            errorValue.value = err.response.data.tooltip
        }
    }

</script>

<style scoped>

.loginContainer {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}

label {
    color: var(--text);
}

p {
    margin: 0;
    padding: 0;
    color: red;
}

</style>