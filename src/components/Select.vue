<template>

    <div class="inputWrapper">
        <label class="theme-transition" for="input">{{ labelValue }}</label>
        <select :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
            <slot>
                <option selected disabled value="none">none</option>
            </slot>
        </select>
    </div>

</template>

<script>
    export default {
        inheritAttrs: false
    }
</script>

<script setup>

    const props = defineProps({
        labelValue: String,
        modelValue: String
    })

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

    select {
        width: 10em;
    }

</style>
