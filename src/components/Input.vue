<template>

    <div class="inputWrapper">
        <label class="theme-transition" for="input">{{ labelValue }}</label>
        <input name="input" :type="inputType">
    </div>

</template>

<script setup>

    const props = defineProps({
        labelValue: String,
        inputType: String
    })

</script>

<script>
    export default {
        inheritAttrs: false
    }
</script>

<style scoped>

    .inputWrapper {
        width: auto;
        height: auto;
        display: flex;
        flex-direction: column;
    }

    label {
        text-align: center;
        color: var(--text)
    }

</style>