<script>
export default {
    props: {
        isActive: {type: Boolean, required: true}
    },
    data() {
        return {
            panelMenuIsActive: false
        }
    },
    methods: {
        logoutUser() {
            this.$store.dispatch('logoutUser');
        },
        toProfile() {
            this.$router.push('/account/profile');
        },
        toFavorites() {
            this.$router.push('/account/favorites');
        },
        toSecurity() {
            this.$router.push('/account/security');
        },
        toOrders() {
            this.$router.push('/account/orders');
        },
        togglePanelMenuIsActive(value) {
            this.panelMenuIsActive = value;
        },
        toAddProduct() {
            this.$router.push('/panel/add');
        }
    },
    computed: {
        menuIsActive: {
            get() {
                return this.isActive;
            },
            set() {
                this.$emit('closeMenu');
            },
        },
        panelAccess() {
            return this.$store.state.user.roles.some(role => role === 'ADMIN');
        }
    }
}
</script>
<template>
    <v-menu v-model="menuIsActive">
        <v-list class="user-menu" bg-color="surface" min-width="150px">
            <v-list-item
                v-if="panelAccess"
                class="user-menu-item text-caption px-3" 
                variant="elevated"
                color="surface"
                ref="adminIcon"
                @mouseenter="togglePanelMenuIsActive(true)"
                @mouseleave="togglePanelMenuIsActive(false)"
            >
                <v-icon class="mr-1" icon="mdi-crown" color="background" />
                Admin panel
                <v-menu 
                    v-model="panelMenuIsActive" 
                    :attach="this.$refs.adminIcon && this.$refs.adminIcon.$el"
                    offset-x="true"
                >
                    <v-list class="panel-menu">
                        <v-list-item class="user-menu-item text-caption px-3" @click="toAddProduct">
                            <v-icon class="" icon="mdi-plus-box" color="background" />
                            Product
                        </v-list-item>
                        <v-list-item class="user-menu-item text-caption px-3">
                            <v-icon icon="mdi-database-edit" color="background" />
                            Products
                        </v-list-item>
                        <v-list-item class="user-menu-item text-caption px-3">
                            <v-icon icon="mdi-format-list-bulleted" color="background" />
                            Orders
                        </v-list-item>
                        <v-list-item class="user-menu-item text-caption px-3">
                            <v-icon icon="mdi-account" color="background" />
                            Users
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-list-item>
            <v-list-item 
                class="user-menu-item text-caption px-3" 
                variant="elevated"
                color="surface"
                @click="toProfile"
            >
                <v-icon class="mr-1" icon="mdi-home-account" color="background" />
                My profile
            </v-list-item>
            <v-list-item 
                v-if="!panelAccess"
                class="user-menu-item text-caption px-3" 
                variant="elevated"
                color="surface"
                @click="toOrders"
            >
                <v-icon class="mr-1" icon="mdi-basket" color="background" />
                My orders
            </v-list-item>
            <v-list-item
                v-if="!panelAccess"
                class="user-menu-item text-caption px-3" 
                variant="elevated"
                color="surface"
                @click="toFavorites"
            >
                <v-icon class="mr-1" icon="mdi-heart" color="background" />
                My favorites
            </v-list-item>
            <v-list-item 
                class="user-menu-item text-caption px-3" 
                variant="elevated"
                color="surface"
                @click="toSecurity"
            >
                <v-icon class="mr-1" icon="mdi-shield" color="background" />
                Security
            </v-list-item>
            <v-list-item 
                class="user-menu-item text-caption px-3" 
                @click="logoutUser"
                variant="elevated"
                    color="surface"
            >
                <v-icon class="mr-1" icon="mdi-logout" color="background" />
                Log out
            </v-list-item>
        </v-list>
    </v-menu>
</template>
<style>
.user-menu .v-overlay__content {
    left: -131px;
    top: -8px;
}
.panel-menu {
    width: 130px;
}
@media (max-width: 400px) {
    .user-menu .v-overlay__content {
        left: -111px;
    }
    .panel-menu {
        width: 110px;
    }
}
@media (max-width: 300px) {
    .user-menu .v-overlay__content {
        left: 0;
        top: 201px;
    }
    .panel-menu {
        width: 150px;
    }
}
</style>
