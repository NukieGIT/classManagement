<template>
    <transition name="flowUp" :appear="appear">
        <slot></slot>
    </transition>
</template>

<script setup>

    const props = defineProps({
        appear: Boolean
    })

</script>

<style>

    .flowUp-enter-active,
    .flowUp-leave-active {
        transition: transform 300ms ease-in-out;
    }
    .flowUp-enter-from,
    .flowUp-leave-to {
        transform: translateY(25%);
    }

</style>