<script>
export default {
    async mounted() {
        if (this.isAuth) {
            this.$router.push('/');
        }
            this.$store.commit('setCode', this.$route.query.code);
            this.$router.push('/authback');
            const result = await this.$store.dispatch('googleAuth', {code: this.$store.state.authBack.code});
            if (!result) {
                this.$router.push('/shop/entry/men');
            }
    },
    watch: {
        isAuth() {
            if (this.isAuth) {
                this.$router.push('/shop/entry/men');
            }
        }
    },
    computed: {
        isAuth() {
            return this.$store.state.isAuth;
        }
    }
}
</script>
<template>
    <main class="authback page">
        <v-container class="authback-wrapper h-100">
            <v-progress-circular
                class="filterProgress"
                color="surface"
                indeterminate
                :size="40"
                :width="3"
            />
                <p class="mt-2">
                    Redirecting...
                </p>
        </v-container>
    </main>
</template>
<style>
.authback-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
