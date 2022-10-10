<template>

        <form class="loginContainer" action="">
            <!-- <h2>&lt;USER NAME></h2> -->
            <label class="theme-transition" for="user">Wybierz konto:</label>
            <Select name="user">
                <option value="uuid1">konto1</option>
                <option value="uuid2">konto2</option>
                <option value="uuid3">konto3</option>
            </Select>
            <Input label-value="Hasło" input-type="password" />
            <button type="submit">Zaloguj</button>

        </form>

</template>

<script setup>
import Input from '../components/Input.vue';
import Select from './Select.vue';



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

</style>