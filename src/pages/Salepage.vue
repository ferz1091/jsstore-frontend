<script>
import ProductsList from '@/components/ProductsList.vue';
export default {
    components: {
        ProductsList
    }
}
</script>

<template>
    <products-list :genderSwitchVisible="true" />
</template>

<style>
    /* .products-container {
        display: grid;
        width: 100%;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: calc(0px + 16 * (100vw / 1400));
        min-height: calc(100vh - calc(64px + 30 * (100vw / 1400)) - 45.6px);
        background: white;
    }
    .filter-panel {
        display: flex !important;
        align-items: center;
        position: fixed;
        z-index: 1;
        top: calc(100vh - 60px);
        left: 50%;
        transform: translateX(-50%);
        padding: 5px;
        background: rgba(0, 0, 0, 0.8) !important;
    }
    .sort-select {
        width: 200px;
    }
    .filter-btn {
        margin-left: 20px;
    }
    .gender-switch {
        position: relative;
        max-height: 42px;
    }
    .switch-value {
        position: absolute;
        top: 27px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 11px;
    }
    .gender-switch .v-switch__thumb {
        color: white;
    }
    @media (max-width: 3840px) {
        .products-container {
            width: 60%;
        }
    }
    @media (max-width: 2048px) {
        .products-container {
            width: 80%;
        }
    }
    @media (max-width: 1400px) {
        .products-container {
            width: 95%;
            grid-gap: 16px;
        }
    }
    @media (max-width: 950px) {
        .products-container {
            width: 95%;
            grid-template-columns: repeat(3, 1fr);
        }
    }
    @media (max-width: 725px) {
        .products-container {
            width: 90%;
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (max-width: 480px) {
        .products-container {
            width: 90%;
            grid-template-columns: repeat(1, 1fr);
        }
    } */
</style>
