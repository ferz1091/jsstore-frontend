<script>
import ProductForm from '@/components/AdminPagesComponents/ProductForm.vue';
export default {
    components: {
        ProductForm
    },
    mounted() {
        if (!this.userIsAdmin) {
            this.$router.push('/shop/entry/men');
        }
    },
    methods: {
        async addProduct(product) {
            const link = await this.$store.dispatch('addProduct', product);
            if (link) {
                this.$router.push(link);
            }
        }
    },
    watch: {
        userIsAdmin(value) {
            if (!value) {
                this.$router.push('/');
            }
        }
    },
    computed: {
        userIsAdmin() {
            return this.$store.state.user.roles.some(role => role === 'ADMIN');
        }
    }
}
</script>
<template>
    <main class="addProduct page" v-if="userIsAdmin">
        <ProductForm @addProduct="addProduct"/>
    </main>
</template>
<style>
</style>
