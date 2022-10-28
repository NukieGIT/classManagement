<template>
    <div>
        <select v-model="theme" ref="select" class="theme-transition">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </div>
</template>

<script>

    export default {
        inheritAttrs: false
    }

</script>

<script setup>
    import { onMounted, ref, watch } from 'vue';

    const theme = ref()

    const select = ref()

    onMounted(() => {
        const value = localStorage.getItem("theme") === null ? "light" : localStorage.getItem("theme")
        select.value.value = value
        setTheme(value)
        setTimeout(() => {
            document.body.classList.remove("preload")
        }, 0)
    })
    
    function setTheme(theme) {
        document.body.classList.remove("light", "dark", "radzio")
        document.body.classList.add(theme)
        localStorage.setItem("theme", theme)
    }


    watch(theme, setTheme)

</script>

<style scoped>

    select {
        border-radius: 0.5rem;
        color: var(--text);
        width: 150px;
        padding: 5px 35px 5px 5px;
        font-size: 16px;
        border: none;
        height: 34px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background: url(../../public/favicon.ico) 96% / 15% no-repeat var(--bg);
    }

</style>