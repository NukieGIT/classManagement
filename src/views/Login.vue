<template>

    <div>

        <div class="container theme-transition">
            <LoginSmall />
        </div>

    </div>


</template>

<script setup>
import LoginSmall from '../components/LoginSmall.vue';

</script>

<style scoped>

    div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: calc(100vh - var(--header-height));
    }

    .container {
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40%;
        height: 20%;
        background-color: var(--bg-secondary);
    }

</style>
