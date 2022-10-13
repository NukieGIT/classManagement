<template>

        <form class="loginContainer" @submit.prevent="validateServerSide">
            <!-- <h2>&lt;USER NAME></h2> -->
            <label class="theme-transition" for="user">Wybierz konto:</label>
            <Select v-model="loginDetails.user" name="user">
                <option value="" seleceted hidden disabled>Wybierz konto</option>
                <option value="uuid1">konto1</option>
                <option value="uuid2">konto2</option>
                <option value="uuid3">konto3</option>
            </Select>
            <Input v-model="loginDetails.password" label-value="Hasło" input-type="password" />
            <button type="submit">Zaloguj</button>
            <p v-if="error">{{ errorValue }}</p>
            {{ loginDetails }}
        </form>

</template>

<script setup>
    import { ref } from 'vue';
    import Input from '../components/Input.vue';
    import Select from './Select.vue';
    import axios from "axios";

    const loginDetails = ref({user: "", password: ""});

    const error = ref(false)
    const errorValue = ref(null)

    // function validate() {
    //     if ((loginDetails.value.user === "" || loginDetails.value.user === null || loginDetails.value.user === undefined)
    //     || (loginDetails.value.password === "" || loginDetails.value.password === null || loginDetails.value.password === undefined)) {
    //         error.value = true
    //         return;
    //     }

    //     validateServerSide()

    // }

    function validateServerSide() {
        const form = toFormData(loginDetails.value)

        axios.post("http://localhost/classManagementServices/login.php", form)
            .then(res => {
                if (res.data.error) {
                    error.value = true
                    errorValue.value = res.data.message
                } else {
                    console.log(res.data.message)
                    loginDetails.value.user = loginDetails.value.password = ""
                }
            })

    }

    function toFormData(data) {
        let formData = new FormData()
        for (const key in data) {
            formData.append(key, data[key])
        }
        return formData
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