<script>
export default {
    mounted() {
        this.$router.push({
            name: 'NotFound',
            params: { pathMatch: this.$route.path.substring(1).split('/') },
            query: this.$route.query,
            hash: this.$route.hash,
        })
    }
}
</script>
<template></template>
<style></style>
