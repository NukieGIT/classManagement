<template>

    <header class="theme-transition" :class="{ shadow: shadowActive }">
        <div class="split split1">
            <p class="theme-transition">
                {{ $route.name }}
                <span v-if="$route.name == 'Room'">{{ useCurrentRoomPath().$state.currentRoom }}</span>
                <span v-if="$route.name == 'PC'">{{ useCurrentRoomPath().$state.currentPC }}</span>
            </p>
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
    import { useCurrentRoomPath } from '@/stores/CurrentRoomPath';
    import { useLoginState } from '@/stores/loginState';
    import { onBeforeUnmount, onMounted, ref } from 'vue';
    import HeaderOptions from './HeaderOptions.vue';
    import ThemeSwitch from './ThemeSwitch.vue';

    const shadowActive = ref(false)

    function addHeaderShadow() {
        if(window.scrollY > 0) {
            shadowActive.value = true
        } else {
            shadowActive.value = false
        }
    }

    onMounted(() => {
        window.addEventListener("scroll", addHeaderShadow)
    })

    onBeforeUnmount(() => {
        window.removeEventListener("scroll", addHeaderShadow)
    })

</script>

<style scoped>

    header {
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--header-height);
        background-color: var(--bg-nav);
        width: 100%;
        position: sticky;
        top: 0;
        transition: box-shadow 300ms ease-out, background-color 500ms ease-in-out, color 1000ms ease-in-out, border 500ms ease-in-out;
    }
    
    header.shadow {
        -webkit-box-shadow: 0px 8px 20px -16px black;
        -moz-box-shadow: 0px 8px 20px -16px black;
        box-shadow: 0px 8px 20px -16px black;
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