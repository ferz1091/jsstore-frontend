<script>
import AccountMenu from './AccountMenu.vue';
    export default {
        data() {
            return {
                buttons: [{title:'Men\'s', link: '/shop/entry/men', icon: 'mdi-face-man'}, {title:'Women\'s', link: '/shop/entry/women', icon: 'mdi-face-woman'}, {title:'Sale', link: '/shop/sale/1', icon: 'mdi-sale'}],
                accountMenuIsVisible: false,
                burgerMenuIsVisible: false,
                displayWidth: null,
                headerButtonIsDisabled: false
            }
        },
        mounted() {
            this.displayWidth = window.innerWidth;
            window.addEventListener('resize', this.setDisplayWidth);
        },
        beforeUnmount() {
            window.removeEventListener('resize', this.setDisplayWidth);
        },
        methods: {
            loginIconClick() {
                if (!this.isAuth) {
                    this.$store.commit('toggleAuthModal', true);
                } else {
                    this.accountMenuIsVisible = true;
                }
            },
            basketIconClick() {
                if (this.$route.path !== '/order') {
                    this.$store.commit('toggleBasketModal', true);
                }
            },
            closeMenu() {
                this.accountMenuIsVisible = false;
            },
            menuIconClick() {
                this.burgerMenuIsVisible = true;
            },
            setDisplayWidth() {
                this.displayWidth = window.innerWidth;
            },
            toggleHeaderBtns(link) {
                if (this.$route.fullPath !== link) {
                    this.headerButtonIsDisabled = true;
                    setTimeout(() => {
                        this.headerButtonIsDisabled = false;
                    }, 1500);
                }
            }
        },
        components: {
            AccountMenu
        },
        computed: {
            isAuth() {
                return this.$store.getters.isAuth;
            },
            login_caption() {
                if (this.isAuth) {
                    const email = this.$store.state.user.email;
                    return email.slice(0, email.indexOf('@')).slice(0, 10);
                } else {
                    return 'Login'
                }
            },
            basketBadgeIsVisible() {
                return this.$store.getters.basketSize;
            },
            userDeviceIsMobile() {
                return this.$store.state.userDeviceIsMobile;
            },
            panelTransform() {
                return this.$store.state.authModalActive || this.$store.state.filterModalActive || this.$store.state.basketModalActive;
            },
            rightPanelLeft() {
                if (this.displayWidth <= 630) {
                    if (!this.userDeviceIsMobile) {
                        if (this.panelTransform) {
                            return 'calc(50% - 5px)';
                        } else {
                            return '50%';
                        }
                    } else {
                        return '50%';
                    }
                } else {
                    return 'calc(100vw - 178px)';
                }
            },
            userRoles() {
                return this.$store.getters.userRoles;
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
            <v-sheet class="header-btns-wrapper">
                <router-link 
                    v-for="button in buttons" 
                    :to="button.link" 
                    v-bind:style="{textDecoration: 'none', pointerEvents: headerButtonIsDisabled ? 'none' : 'auto'}"
                    @click="toggleHeaderBtns(button.link)"
                >
                    <header-button>
                        {{ button.title }}
                    </header-button>
                </router-link>
            </v-sheet>
            <div 
                class="right-panel"
                v-bind:style="{left: rightPanelLeft}"
                >
                <button-ui 
                  class="menuIcon py-6"
                  :set="['t', 'b', 0, 'mdi-menu', 0]"
                  @click="menuIconClick"
                  ref="menuIcon"  
                />
                <v-btn
                    class="userIcon py-6"
                    variant="text"
                    color="background"
                    @click="loginIconClick"
                    ref="userIcon"
                >
                    <v-icon icon="mdi-account-circle" size="large"/>
                    <p class="login-caption text-caption">
                        {{ login_caption }}
                    </p>
                </v-btn>
                <v-btn
                    class="basketIcon py-6"
                    variant="text"
                    color="background"
                    @click="basketIconClick"
                >
                    <v-badge 
                        v-if="basketBadgeIsVisible" 
                        location="bottom end" 
                        :content="basketBadgeIsVisible" 
                        color="error" 
                        title="Basket"
                    >
                        <v-icon icon="mdi-shopping" size="large" />
                    </v-badge>
                    <v-icon v-else icon="mdi-shopping" size="large" />
                </v-btn>
            </div>
            <v-menu 
                v-model="burgerMenuIsVisible" 
                :attach="this.$refs.menuIcon && this.$refs.menuIcon.$el"
            >
                <v-list 
                    class="burger-menu" 
                    bg-color="surface" 
                    min-width="120px"
                >
                    <v-list-item 
                        v-for="button in buttons" 
                        class="burger-menu-item text-button" 
                        @click="$event => this.$router.push(button.link)"
                    >
                        <v-icon class="mr-1" :icon="button.icon"/>
                        {{ button.title }}
                    </v-list-item>
                </v-list>
            </v-menu>
            <AccountMenu
                @closeMenu="closeMenu"
                :isActive="accountMenuIsVisible" 
                :attach="this.$refs.userIcon && this.$refs.userIcon.$el"
            />
        </v-app-bar>
    </v-layout>
</template>

<style>
    .header {
        display: flex;
        justify-content: center !important;
        height: calc(64px + 30 * (100vw / 1400)) !important;
        width: 100% !important;
        max-width: 100vw !important;
    }
    header.v-toolbar {
        overflow: visible !important;
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
        transform: translateY(-50%);
        display: flex;
    }
    .userIcon, .basketIcon, .menuIcon {
        position: relative !important;
        z-index: 10 !important;
        display: flex !important;
    }
    .basketIcon {
        bottom: 1px;
    }
    .basketIcon:active, .userIcon:active {
        transform: translateY(5%);
    }
    .menuIcon {
        display: none !important;
    }
    .login-caption {
        position: absolute !important;
        bottom: -5px;
    }
    .header-btns-wrapper {
        display: flex !important;
    }
    .user-menu, .burger-menu {
        position: relative !important;
        top: calc(((64px + 30 * (100vw / 1400)) / 2) + 26px);
        right: 25%;
    }
    .user-menu {
        overflow: visible !important;
    }
    .user-menu-item, .burger-menu-item {
        display: flex !important;
        cursor: pointer;
    }
    .burger-menu-item .v-list-item__content {
        font-size: 11px !important;
    }
    @media (max-width: 630px) {
        .header-btns-wrapper {
            display: none !important;
        }
        .menuIcon {
            display: flex !important;
        }
        .right-panel {
            transform: translate(-50%, -50%);
        }
        .logo {
            display: none !important;
        }
        .userIcon, .basketIcon, .menuIcon {
            margin: 0px 15px !important;
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
