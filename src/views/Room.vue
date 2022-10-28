<template>

    <div class="container">
        <PCSelector />
    </div>

</template>

<script setup>
    import PCSelector from '@/components/PCSelector.vue';




</script>

<style scoped>

    .container {
        display: grid;
        place-items: center;
        padding-top: 20px;
        width: 100%;
        height: calc(100vh - var(--header-height));
    }

</style>