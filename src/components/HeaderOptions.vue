<template>

    <div class="theme-transition">
        <RouterLink class="headerRoute theme-transition" to="/rooms">Klasy</RouterLink>
        <RouterLink class="headerRoute theme-transition" to="/users">Użytkownicy</RouterLink>
    </div>

</template>

<script setup>



</script>

<style scoped>

.router-link-active {
    background-color: var(--bg);
}

div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    gap: 40px;
    width: 100%;
}

.headerRoute {
    border-radius: 10px;
    padding: 2%;
    position: relative;
    text-decoration: none;
    color: var(--text-accent);
    z-index: 1;
}

.headerRoute::before {
    content: "";
    pointer-events: none;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 2px solid var(--accent-v2-color);
    background-color: initial;
    border-radius: 5px;
    opacity: 0;
    transition: opacity 0.5s, background-color 0.7s, border-radius 0.1s;
}

.headerRoute:hover::before {
    background-color: var(--bg);
    opacity: 1;
}

.headerRoute:active::before {
    border-radius: 10px;
}

</style>

