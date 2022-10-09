<template>
    <header class="theme-transition">
        <p>navBarElem1</p>
        <p>navBarElem2</p>
        <p>navBarElem3</p>
        <slot></slot>
    </header>
</template>

<style scoped>

    header {
        background-color: var(--bg-nav);
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
        color: var(--text);
        height: 5rem;
    }

</style>