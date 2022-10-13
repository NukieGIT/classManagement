<template>

    <form action="" method="get">
        <input type="checkbox" name="check" id="check">
        <input type="range" name="range" id="range" ref="val">
        <input type="button" value="Wyślij" @click="WyswietlDane">
    </form>

</template>

<script setup>
import { ref } from 'vue';


    const val = ref();

    function WyswietlDane() {
        console.log(val.value.value);
    }

</script>

<style scoped>

button{
    color: var(--text);
    background-color: var(--bg-secondary);
}

</style>