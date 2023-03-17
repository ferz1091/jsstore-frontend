export default {
    data() {
        return {
            gender: 'men',
            categories: []
        }
    },
    watch: {
        gender() {
            window.scrollTo({
                top: 0,
                behavior: "auto"
            });
            this.brands = [];
            this.types = [];
            this.categories = [];
            this.$store.commit('deleteProducts');
            this.$store.commit('clearFilters');
            if (this.page === 1) {
                this.pageParamHandler();
            } else {
                this.$router.push('/shop/sale/1');
            }
        }
    },
    computed: {
        genderParam() {
            return this.$route.params.gender;
        },
        categoryParam() {
            return this.$route.params.category;
        }
    },
}
