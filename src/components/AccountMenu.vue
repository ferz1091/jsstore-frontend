<script>
export default {
    props: {
        isActive: {type: Boolean, required: true}
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
    }
}
</script>
<template>
    <v-menu v-model="menuIsActive">
        <v-list class="user-menu" bg-color="surface" min-width="150px">
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
                class="user-menu-item text-caption px-3" 
                variant="elevated"
                    color="surface"
            >
                <v-icon class="mr-1" icon="mdi-basket" color="background" />
                My orders
            </v-list-item>
            <v-list-item 
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
</style>
