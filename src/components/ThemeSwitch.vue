<template>
    <select v-model="theme">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="radzio">Radzio</option>
    </select>
</template>

<script setup>
import { ref, watch } from 'vue';

    const theme = ref(document.body.className)

    watch(theme, (val, oldval) => {
        document.body.classList.replace(oldval, val)
    })

</script>

<style scoped>

    select {
        margin: 50px;
        width: 150px;
        padding: 5px 35px 5px 5px;
        font-size: 16px;
        border: 1px solid #CCC;
        height: 34px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background: url(favicon.ico) 96% / 15% no-repeat var(--bg-secondary);
    }

</style>