<template>

    <header class="theme-transition">
        <ThemeSwitch />
    </header>

</template>

<script setup>
import ThemeSwitch from './ThemeSwitch.vue';



</script>

<style scoped>

    header {
        display: flex;
        align-items: center;
        justify-content: end;
        height: var(--header-height);
        background-color: var(--bg-nav);
        width: 100%;
    }

</style>

<script>
    export default {
        inheritAttrs: false
    }
</script>