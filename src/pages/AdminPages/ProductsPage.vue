<script>
export default {
    data() {
        return {
            gender: 'men'
        }
    }
}
</script>
<template>
    <main class="panelProducts page">
        <v-sheet color="background">
            <v-checkbox v-model="gender" label="men" value="men" hide-details />
            <v-checkbox v-model="gender" label="women" value="women" hide-details />
        </v-sheet>
        Products
    </main>
</template>
<style>
</style>
