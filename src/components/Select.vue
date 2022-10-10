<template>

    <div>
        <select>
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
