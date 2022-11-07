<template>

    <div class="wrapper3">
        <div class="container">
            <span @click="$emit('hideModal')">x</span>
            <slot></slot>
        </div>
    </div>

</template>

<script setup>



</script>

<style scoped>

    .wrapper3 {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        transition: 0.3s ease-in-out;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 30px;
        padding-top: 20px;
        border-radius: 10px;
        max-height: 90%;
        max-width: 90%;
        background-color: var(--bg-modal);
    }

    span {
        padding: 0;
        margin: 0;
        font-family: 'Courier New', Courier, monospace;
        align-self: flex-end;
        color: var(--text);
        font-size: 2rem;
        line-height: 2rem;
        border-radius: 30%;
        width: 2rem;
        text-align: center;
        outline: 2px solid transparent;
        transition: outline 500ms ease-out, color 300ms ease-in-out;
    }
    
    span:hover {
        color: red;
        cursor: pointer;
        outline: 2px solid var(--text);
    }

</style>
