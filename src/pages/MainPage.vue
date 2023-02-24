<script>
import api from '../init/http/api';
export default {
    data() {
        return {
            api
        }
    },
    methods: {
        login() {
            this.$store.dispatch('loginUser', {email: 'ferz1091@gmail.com', password: 'qwerty123'})
        },
        logout() {
            this.$store.dispatch('logoutUser');
        },
        registration() {
            this.$store.dispatch('registration', {email: 'ferz1091@gmail.com', password: 'qwerty123', phone: null});
        },
        activate() {
            this.$store.dispatch('activateAlert', {message: 'BAD REQUEST 400. User is not authorized', status: 'success'});
        },
        fetch() {
            this.$store.commit('toggleIsFetching', true);
        }
    }
}
</script>

<template>
    <main class="Main page">
        <button @click="login">Login</button>
        <button @click="logout">Logout</button>
        <button @click="registration">Reg</button>
        <button @click="activate">Activate</button>
        <button @click="fetch">Fetch</button>
    </main>
</template>

<style>

</style>
