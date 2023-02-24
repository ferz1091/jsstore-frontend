<script>
    export default {
        name: 'alert-snackbar',
        props: {
            alertData: {
                type: Object,
                required: true,
                default: () => ({isVisible: false, message: '', status: ''})
            }
        },
        methods: {
            closeAlert() {
                this.$emit('closeAlert');
            }
        }
    }
</script>

<template>
    <v-snackbar
        class="alert-snackbar"
        variant="elevated"
        :color="alertData.status" 
        location="left bottom" 
        v-model="alertData.isVisible" 
        timeout="-1"
        elevation="24"
    >
        {{ alertData.message }}
        <v-btn 
            class="alert-close-btn ml-5" 
            icon="mdi-close" 
            size="x-small" 
            :color="alertData.status" 
            variant="flat"
            @click="closeAlert"
        ></v-btn>
    </v-snackbar>
</template>

<style>
    .v-snackbar__content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .alert-close-btn {
        position: relative !important;
        bottom: 1px;
        justify-self: flex-end;
    }
</style>
