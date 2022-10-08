<template>
    <select v-model="theme" ref="select">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="radzio">Radzio</option>
    </select>
</template>

<script setup>
    import { onMounted, ref, watch } from 'vue';

    const theme = ref()

    const select = ref()

    onMounted(() => {
        const value = localStorage.getItem("theme") === null ? theme.value : localStorage.getItem("theme")
        select.value.value = value
        setTheme(value)
        setTimeout(() => {
            document.body.classList.remove("preload")
        }, 0);
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
        margin: 50px;
        width: 150px;
        padding: 5px 35px 5px 5px;
        font-size: 16px;
        border: none;
        height: 34px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background: url(favicon.ico) 96% / 15% no-repeat var(--bg-secondary);
    }

</style>