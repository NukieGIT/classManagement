<template>
    <div class="info">
        <slot name="info"></slot>
    </div>
    <div class="history ">
        <p class="theme-transition">Ostatnie zdarzenia: </p>
        <slot name="history">
            <span class="theme-transition">Brak zdarzeń</span>
        </slot>
    </div>
</template>

<script setup>

    

</script>

<style scoped>

    .info {
        width: 100%;
        height: 20%;
    }

    .history {
        /* font-size: 0.8em; */
        height: 80%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .history p,
    .history span {
        color: var(--text);
    }

</style>