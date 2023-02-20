<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiShopping } from '@mdi/js';
    export default {
        data() {
            return {
                buttons: ['Men\'s', 'Women\'s', 'Sale'],
                icons: {
                    basket: mdiShopping
                }
            }
        },
        components: {
            SvgIcon
        }
    }
</script>

<template>
    <v-layout>
        <v-app-bar 
            class="header" 
            color="background" 
            elevation="16"
        >
            <v-img 
                class="logo" 
                :src="'http://localhost:5000/assets/8403518d375d97abbe6abc8227c6907b'"
            ></v-img>
            <header-button v-for="button in buttons">
                {{ button }}
            </header-button>
            <v-btn
                class="basket ma-2"
                variant="text"
                color="surface"
                icon="mdi-cloud-upload"
              >
              <v-badge :content="1" color="error">
                <svg-icon 
                    style="color: white" 
                    type="mdi" 
                    :path="icons.basket"
                ></svg-icon>
                </v-badge>
            </v-btn>
        </v-app-bar>
    </v-layout>
</template>

<style>
    @keyframes logoIn {
        0% {
            transform: translateX(-100px);
        }
        100% {
            transform: translateX(0px);
        }
    }
    .header {
        display: flex;
        justify-content: center !important;
        height: calc(64px + 30 * (100vw / 1400)) !important;
    }
    .logo {
        cursor: pointer;
        max-width: calc(50px + 50 * (100vw / 1400)) !important;
        min-width: 50px;
        margin: 0 25px 0 50px;
        animation: logoIn 1s ease 1s;
    }
    .basket {
        position: absolute !important;
        top: 50%;
        right: 25px;
        transform: translateY(-65%);
    }
    .basket:active {
        scale: 0.98;
    }
    @media (max-width: 550px) {
        .basket {
            display: none !important;
        }
    }
    @media (max-width: 470px) {
        .logo {
            margin: 0 10px 0 15px;
        }
    }
    @media (max-width: 350px) {
        .logo {
            margin: 0;
            margin-left: 5px;
        }
    }
</style>
