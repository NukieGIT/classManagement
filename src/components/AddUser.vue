<template>

    <form class="loginContainer" @submit.prevent="validateServerSide">
        <Input v-model="loginDetails.login" label-value="Login" input-type="text" />
        <Input v-model="loginDetails.password" label-value="Hasło" input-type="password" />
        <Input v-model="loginDetails.fname" label-value="Imie" input-type="text" />
        <Input v-model="loginDetails.lname" label-value="Nazwisko" input-type="text" />
        <button type="submit">Dodaj</button>
        <p v-if="error">{{ errorValue }}</p>
        {{ loginDetails }}
    </form>

</template>

<script setup>
import { ref } from 'vue';
import Input from '../components/Input.vue';
import axios from "axios";

const loginDetails = ref({login: "", password: "", fname: "", lname: ""});

const error = ref(false)
const errorValue = ref(null)

function validateServerSide() {
    axios.post("http://localhost:5823/signup", loginDetails.value)
    .then(res => {
        if (res.data.errors.error) {
            error.value = true
            errorValue.value = res.data.errors.errorMsg
        } else {
            console.log(res.data.data)
        }

        loginDetails.value.login = loginDetails.value.password = loginDetails.value.fname = loginDetails.value.lname = ""
    })
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