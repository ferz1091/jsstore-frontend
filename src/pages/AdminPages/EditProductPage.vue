<script>
import ProductForm from '@/components/AdminPagesComponents/ProductForm.vue';
export default {
    components: {
        ProductForm
    },
    mounted() {
        if (!this.userIsAdmin || !this.editModeProduct) {
            this.$router.push('/shop/entry/men');
        }
    },
    unmounted() {
        this.$store.commit('clearCurrentProduct');
    },
    methods: {
        async editProduct(payload) {
            const result = await this.$store.dispatch('editProduct', payload);
            if (result) {
                this.$router.push('/panel/products');
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
        },
        editModeProduct() {
            return this.$store.state.currentProduct;
        }
    }
}
</script>
<template>
    <main class="editProduct page">
        <ProductForm 
            @editProduct="editProduct"
            :editMode="true" 
            :editModeProduct="editModeProduct" 
        />
    </main>
</template>
<style>

</style>
