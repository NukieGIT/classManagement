<template>

    <header class="theme-transition">
        <div class="split split1">
            <p class="theme-transition">{{ $route.name }}</p>
        </div>
        <div class="split split2">
            <HeaderOptions class="headerOptions" v-if="useLoginState().$state.isAuth" />
        </div>
        <div class="split split3">
            <ThemeSwitch class="themeSwitcher"></ThemeSwitch>
        </div>
    </header>

</template>

<script setup>
    import { useLoginState } from '../stores/loginState';
    import HeaderOptions from './HeaderOptions.vue';
    import ThemeSwitch from './ThemeSwitch.vue';


</script>

<style scoped>

    header {
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--header-height);
        background-color: var(--bg-nav);
        width: 100%;
    }

    .split {
        width: 33.333%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    .split1 {
        align-items: center;
        justify-content: start;
        margin-left: 40px;
    }

    .split1 > p {
        margin: 0;
        padding: 0;
        font-size: calc(var(--header-height) * 0.5);
        color: var(--text);
    }

    .split3 {
        margin-right: 40px;
        justify-content: end;
    }

</style>

<script>
    export default {
    inheritAttrs: false,
    components: { HeaderOptions }
}
</script>