<script>
    export default {
        name: 'header-button'
    }
</script>

<template>
    <v-btn class="btn py-6 h-100" variant="text" color="surface" >
        <slot></slot>
    </v-btn>
</template>

<style>
    .btn {
        display: flex;
        margin: 0 10px;
    }
    .btn:active {
        transform: translateY(5%);
    }
    @media (min-width: 2560px) {
        .btn {
           font-size: 18px !important;
        }
    }
    @media (max-width: 470px) {
        .btn {
            font-size: 12px;
        }
    }
    @media (max-width: 350px) {
        .btn {
            font-size: 10px;
            margin: 0;
        }
}
</style>