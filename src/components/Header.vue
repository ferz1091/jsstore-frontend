<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiShopping } from '@mdi/js';
import { mdiAccountCircle } from '@mdi/js';
import { mdiLogout } from '@mdi/js';
    export default {
        data() {
            return {
                buttons: [{title:'Men\'s', link: '/shop/entry/men'}, {title:'Women\'s', link: '/shop/entry/women'}, {title:'Sale', link: '/shop/sale/1'}]
            }
        },
        methods: {
            loginIconClick() {
                this.$store.commit('toggleLoginModal', true);
            }
        },
        components: {
            SvgIcon
        },
        computed: {
            authenticated() {
                return this.$store.state.isAuth;
            },
            icons() {
                return {
                    basket: mdiShopping,
                    userIcon: this.authenticated ? mdiLogout : mdiAccountCircle
                };
            },
            login_caption() {
                if (this.authenticated) {
                    const email = this.$store.state.user.email;
                    return email.slice(0, email.indexOf('@')).slice(0, 10);
                } else {
                    return 'Login'
                }
            }
        }
    }
</script>

<template>
    <v-layout>
        <v-app-bar
            class="header" 
            color="surface" 
            elevation="16"
        >
            <v-img 
                class="logo" 
                :src="'http://localhost:5000/assets/8403518d375d97abbe6abc8227c6907b'"
            ></v-img>
            <header-button v-for="button in buttons" @click="$event => this.$router.push(button.link)">
                {{ button.title }}
            </header-button>
            <div class="right-panel">
                <v-btn
                    class="user py-6"
                    variant="text"
                    color="background"
                    title="Login"
                    @click="loginIconClick"
                >
                    <svg-icon 
                        type="mdi" 
                        :path="icons.userIcon"
                    ></svg-icon>
                    <p class="login-caption text-caption">{{ login_caption }}</p>
                </v-btn>
                <v-btn
                    class="basket py-6"
                    variant="text"
                    color="background"
                >
                  <v-badge location="bottom end" :content="1" color="error" title="Basket">
                    <svg-icon 
                        type="mdi" 
                        :path="icons.basket"
                        title="Basket"
                    ></svg-icon>
                    </v-badge>
                </v-btn>
            </div>
        </v-app-bar>
    </v-layout>
</template>

<style>
    .header {
        display: flex;
        justify-content: center !important;
        height: calc(64px + 30 * (100vw / 1400)) !important;
        overflow-y: hidden;
    }
    .logo {
        cursor: pointer;
        max-width: calc(50px + 50 * (100vw / 1400)) !important;
        min-width: 50px;
        margin: 0 25px 0 50px;
    }
    .right-panel {
        position: absolute !important;
        top: 50%;
        left: calc(100vw - 178px);
        transform: translateY(-50%);
        display: flex;
    }
    .user, .basket {
        display: flex !important;
    }
    .basket {
        position: relative !important;
        bottom: 1px;
    }
    .basket:active, .user:active {
        transform: translateY(5%);
    }
    .login-caption {
        position: absolute !important;
        bottom: -5px;
    }
    @media (max-width: 630px) {
        .right-panel {
            display: none;
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
