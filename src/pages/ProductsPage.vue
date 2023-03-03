<script>
import ProductCard from '@/components/ProductCard.vue';
export default {
    data() {
        return {
            page: 1,
            select: 'rating',
            sortSelectVariants: ['rating', 'cheap', 'expensive'],
            filterPanelIsVisible: true,
        }
    },
    components: {
        ProductCard
    },
    methods: {
        handleScroll() {
            if (window.pageYOffset + window.innerHeight >= this.$el.clientHeight) {
                this.filterPanelIsVisible = false;
            } else {
                this.filterPanelIsVisible = true;
            }
        }
    },
    mounted() {
        this.page = Number(this.$route.params.page);
        this.$store.dispatch('getProducts', {gender: this.genderParam, category: this.categoryParam, page: this.page, fetchFilters: true, sort: this.select});
    },
    unmounted() {
        this.$store.commit('deleteProducts');
    },
    watch: {
        page(newValue, oldValue) {
            if (!newValue) return false;
            if (newValue !== oldValue) {
                const pathWithoutPage = this.$route.path.slice(0, this.$route.path.lastIndexOf('/'));
                if (!this.$store.state.products.products.some(prods => prods.page === this.page)) {
                    this.$router.push(`${pathWithoutPage}/${this.page}`);
                    this.$store.dispatch('getProducts', { gender: this.genderParam, category: this.categoryParam, page: this.page, fetchFilters: false, sort: this.select });
                } else {
                    this.$router.push(`${pathWithoutPage}/${this.page}`);
                }
            }
        },
        select() {
            const pathWithoutPage = this.$route.path.slice(0, this.$route.path.lastIndexOf('/'));
            this.$store.commit('deleteProducts');
            if (this.page === 1) {
                this.$store.dispatch('getProducts', {gender: this.genderParam, category: this.categoryParam, page: this.page, fetchFilters: false, sort: this.select});
            } else {
                this.$router.push(`${pathWithoutPage}/1`);
            }
        }
    },
    computed: {
        genderParam() {
            return this.$route.params.gender;
        },
        categoryParam() {
            return this.$route.params.category;
        },
        products() {
            return this.$store.state.products.products.find(prod => prod.page === this.page);
        },
        totalPages() {
            return this.$store.state.products.totalPages;
        }
    }
}
</script>

<template>
    <main class="Products page" v-scroll="handleScroll">
        <v-container class="products-container">
            <ProductCard v-if="products" v-for="product in products.data" :product="product"/>
            <Transition name="filter-panel">
                <v-sheet v-if="filterPanelIsVisible" class="filter-panel rounded-lg" color="background">
                    <v-select
                        v-model="select"
                        class="sort-select" 
                        variant="solo" 
                        bg-color="surface" 
                        label="Sort by:"
                        density="compact"
                        :items="sortSelectVariants"
                        hide-details
                    ></v-select>
                    <v-btn class="filter-btn" color="surface" icon="mdi-filter" size="small">
                    </v-btn>
                </v-sheet>
            </Transition>
        </v-container>
        <v-pagination 
            v-if="totalPages > 1" 
            :length="totalPages"
            :total-visible="5"
            density="comfortable"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            active-color="black"
            variant="flat"
            v-model="page"
        ></v-pagination>
    </main>
</template>

<style>
    .Products {
        display: flex;
        flex-direction: column;
    }
    .products-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: calc(0px + 16 * (100vw / 1400));
        min-height: calc(100vh - calc(64px + 30 * (100vw / 1400)) - 45.6px);
    }
    .filter-panel {
        display: flex !important;
        align-items: center;
        position: fixed;
        bottom: 10px;
        left: 21px;
        padding: 5px;
        background: rgba(0, 0, 0, 0.8) !important;
    }
    .sort-select {
        width: 200px;
    }
    .filter-btn {
        margin-left: 20px;
    }
    .filter-panel-enter-active,
    .filter-panel-leave-active {
        transition: all 0.5s ease;
    }

    .filter-panel-enter-from {
        opacity: 0;
        transform: translateX(-100%);
    }
    .filter-panel-leave-to {
        opacity: 0;
        transform: translateX(-100%);
    }
    @media (max-width: 1400px) {
        .products-container {
            grid-gap: 16px;
        }
    }
    @media (max-width: 900px) {
        .products-container {
            grid-template-columns: repeat(3, 1fr);
        }
    }
    @media (max-width: 700px) {
        .products-container {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (max-width: 480px) {
        .products-container {
            grid-template-columns: repeat(1, 1fr);
        }
    }
</style>
