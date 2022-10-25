<template>

    <form class="loginContainer" @submit.prevent="validateServerSide">
        <!-- <h2>&lt;USER NAME></h2> -->
        <label class="theme-transition" for="login">Wybierz konto:</label>
        <Select v-model="loginDetails.login" name="login">
            <option value="" seleceted hidden disabled>Wybierz konto</option>
            <option v-for="user in users" :value="user.login">{{ user.login }}</option>
        </Select>
        <Input v-model="loginDetails.password" label-value="Hasło" input-type="password" />
        <button type="submit">Zaloguj</button>
        <p v-if="error">{{ errorValue }}</p>
        {{ loginDetails }}
    </form>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import Input from '../components/Input.vue';
import Select from './Select.vue';
import axios from "axios";
import router from '../router';
import { useLoginState } from '../stores/loginState';

const loginState = useLoginState()

const loginDetails = ref({ login: "", password: "" });

const error = ref(false)
const errorValue = ref(null)
const users = ref([])

if (loginState.$state.jwtExpired) {
    error.value = true
    errorValue.value = loginState.$state.jwtExpiredMsg
}

onMounted(() => {
    axios.get('http://localhost:5823/users')
        .then(res => {
            users.value = res.data.values
        })
})

async function validateServerSide() {
    try {
        const res = await axios.post('http://localhost:5823/signin', loginDetails.value)
        console.log(res);
        localStorage.setItem("token", res.data.values)
        router.push("/dashboard")
    } catch (err) {
        error.value = true
        errorValue.value = err.response.data.tooltip
        console.warn(err.message)
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