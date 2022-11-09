<template>
    <transition name="fade" :appear="appear">
        <slot></slot>
    </transition>
</template>

<script setup>

    const props = defineProps({
        appear: Boolean
    })

</script>

<style>

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 300ms ease-out;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

</style>