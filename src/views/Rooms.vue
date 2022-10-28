<template>

    <div class="room-container">
        <RoomSelector />
    </div>

</template>

<script setup>
    import RoomSelector from '@/components/RoomSelector.vue';


</script>

<style scoped>

    .room-container {
        padding-top: 20px;
        display: grid;
        width: 100%;
        height: calc(100vh - var(--header-height));
        place-items: center;
    }

</style>