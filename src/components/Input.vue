<template>

    <div class="inputWrapper">
        <label class="theme-transition" for="input">{{ labelValue }}</label>
        <input name="input" :id="id" :min="inputType == 'number' ? min : null" :max="inputType == 'number' ? max : null" :type="inputType" :value="modelValue" @input="emitAll">
    </div>

</template>

<script setup>

    const props = defineProps({
        labelValue: String,
        inputType: String,
        modelValue: String,
        id: String,
        min: String,
        max: String
    })

    const emits = defineEmits([
        "update:modelValue",
        "fired"
    ])

    function emitAll(e) {
        emits("update:modelValue", e.target.value)
        emits("fired")
    }

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