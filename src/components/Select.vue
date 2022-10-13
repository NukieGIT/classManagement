<template>

    <div>
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
        modelValue: String
    })

</script>

<style scoped>

    div {
        display: flex;
        flex-direction: column;
    }

    select {
        width: 10em;
    }

</style>
