<script>
export default {
    props: {
        isActive: {type: Boolean, required: true}
    },
    methods: {
        logoutUser() {
            this.$store.dispatch('logoutUser');
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
            >
                <v-icon class="mr-1" icon="mdi-home-account" color="background" />
                Account details
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
            >
                <v-icon class="mr-1" icon="mdi-heart" color="background" />
                My favorites
            </v-list-item>
            <v-list-item 
                class="user-menu-item text-caption px-3" 
                variant="elevated"
                    color="surface"
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
