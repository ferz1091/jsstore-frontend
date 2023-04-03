<script>
    export default {
        name: 'header-button'
    }
</script>

<template>
    <v-btn class="header-btn py-6 h-100" variant="text" color="background" >
        <slot></slot>
    </v-btn>
</template>

<style>
    .header-btn {
        display: flex;
        margin: 0 10px;
    }
    .header-btn:active {
        transform: translateY(5%);
    }
    @media (min-width: 2560px) {
        .header-btn {
           font-size: 18px !important;
        }
    }
</style>