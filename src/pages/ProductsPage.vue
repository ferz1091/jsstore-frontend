<script>
import ProductCard from '@/components/ProductCard.vue';
import FilterModal from '@/components/FilterModal.vue';
export default {
    data() {
        return {
            page: Number(this.$route.params.page),
            select: 'rating',
            sortSelectVariants: ['rating', 'cheap', 'expensive'],
            filterPanelIsVisible: true,
            brands: [],
            types: []
        }
    },
    components: {
        ProductCard,
        FilterModal
    },
    methods: {
        handleScroll() {
            if (window.pageYOffset + window.innerHeight >= this.$el.clientHeight && window.pageYOffset) {
                this.filterPanelIsVisible = false;
            } else {
                this.filterPanelIsVisible = true;
            }
        },
        changePage(modelValue) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            const {gender, category} = this.$route.params;
            setTimeout(() => {
                this.$router.push(`/shop/${gender}/${category}/${modelValue}`);
            }, 400)
        },
        toggleFilterModal() {
            this.$store.commit('toggleFilterModal', !this.filterModalActive);
        },
        closeFilterModal() {
            this.$store.commit('toggleFilterModal', false);
        },
        filtersChanged(brands, types) {
            window.scrollTo({
                top: 0,
                behavior: "auto"
            });
            this.brands = brands;
            this.types = types;
            this.$store.commit('saveFilters');
            this.$store.commit('deleteProducts');
            const pathWithoutPage = this.$route.path.slice(0, this.$route.path.lastIndexOf('/'));
            if (this.$route.params.page === '1') {
                this.pageParamHandler()
            } else {
                this.$router.push(`${pathWithoutPage}/1`);
            }
        },
        pageParamHandler() {
            this.page = Number(this.$route.params.page);
            if (!this.$store.state.products.products.some(prods => prods.page === this.page) && this.$route.params.page) {
                this.$store.dispatch('getProducts', {
                    gender: this.genderParam,
                    category: this.categoryParam,
                    page: this.page,
                    fetchFilters: this.$store.state.products.filters.valueRange.min ? false : true,
                    sort: this.select,
                    brands: this.brands.length ? this.brands.join('!') : null,
                    types: this.types.length ? this.types.join('!') : null
                });
            }
        }
    },
    mounted() {
        this.page = Number(this.$route.params.page);
    },
    unmounted() {
        this.$store.commit('deleteProducts');
    },
    watch: {
        '$route.params.page': {
            handler() {
                this.pageParamHandler()
            },
            immediate: true
        },
        select() {
            const pathWithoutPage = this.$route.path.slice(0, this.$route.path.lastIndexOf('/'));
            this.$store.commit('deleteProducts');
            if (this.page === 1) {
                this.pageParamHandler()
            } else {
                this.$router.push(`${pathWithoutPage}/1`);
            }
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
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
            return this.$store.state.products.products.find(prod => prod.page === Number(this.$route.params.page))
        },
        thisPageProducts() {
            return this.$store.state.products.products.find(prod => prod.page === Number(this.$route.params.page)).data.sort((a, b) => {
                if (a.amount.every(item => item.amount === 0)) {
                    return 1;
                } else if (b.amount.every(item => item.amount === 0)) {
                    return -1;
                }
            })
        },
        totalPages() {
            return this.$store.state.products.totalPages;
        },
        showProducts() {
            return this.products && this.$route.params.page === this.page + '';
        },
        filterModalActive() {
            return this.$store.state.filterModalActive;
        },
        filterBtnColor() {
            return this.filterModalActive ? 'surface' : 'background';
        }
    }
}
</script>

<template>
    <main 
        class="Products page" 
        v-scroll="handleScroll"
    >
        <Transition name="pagination-top">
            <v-pagination 
                    v-if="totalPages > 1" 
                    :length="totalPages"
                    :total-visible="5"
                    density="comfortable"
                    prev-icon="mdi-menu-left"
                    next-icon="mdi-menu-right"
                    active-color="black"
                    variant="flat"
                    @update:modelValue="changePage"
                    v-model="page"
                    color="background"
                ></v-pagination>
        </Transition>
        <Transition name="products-container">
            <v-container 
                v-if="showProducts" 
                class="products-container"
                fluid
            >
                <ProductCard 
                    v-for="product in thisPageProducts" 
                    :product="product"
                />
                <Transition name="filter-panel">
                    <v-sheet 
                        v-if="filterPanelIsVisible" 
                        class="filter-panel rounded-lg" 
                        color="background"
                    >
                        <v-select
                            v-model="select"
                            class="sort-select" 
                            variant="solo"
                            bg-color="background" 
                            label="Sort by:"
                            density="compact"
                            :items="sortSelectVariants"
                            hide-details
                        ></v-select>
                        <v-btn 
                            class="filter-btn" 
                            :color="filterBtnColor" 
                            icon="mdi-filter" 
                            size="small" 
                            @click="toggleFilterModal"
                        ></v-btn>
                    </v-sheet>
                </Transition>
            </v-container>
        </Transition>
        <Transition name="pagination-bottom">
            <v-pagination 
                v-if="totalPages > 1 && showProducts" 
                :length="totalPages"
                :total-visible="5"
                density="comfortable"
                :disabled="!products"
                prev-icon="mdi-menu-left"
                next-icon="mdi-menu-right"
                active-color="black"
                variant="flat"
                @update:modelValue="changePage"
                v-model="page"
                color="background"
            ></v-pagination>
        </Transition>
        <filter-modal 
            :isActive="filterModalActive" 
            @closeModal="closeFilterModal"
            @filtersChanged="filtersChanged"
        />
    </main>
</template>

<style>
    .Products {
        display: flex;
        flex-direction: column;
    }
    .products-container {
        display: grid;
        width: 100%;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: calc(0px + 16 * (100vw / 1400));
        min-height: calc(100vh - calc(64px + 30 * (100vw / 1400)) - 45.6px);
        background: white;
    }
    .filter-panel {
        display: flex !important;
        align-items: center;
        position: fixed;
        z-index: 1;
        top: calc(100vh - 60px);
        left: 50%;
        transform: translateX(-50%);
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
        transform: translate(-50%, 100%);
    }
    .filter-panel-leave-to {
        transform: translate(-50%, 100%);
    }
    .products-container-enter-active,
    .products-container-leave-active {
        transition: all 0.8s ease;
    }

    .products-container-enter-from {
        opacity: 0;
        transform: translateY(100%);
    }
    .products-container-leave-to {
        opacity: 0;
        transform: translateY(100%);
    }
    .pagination-top-enter-active,
    .pagination-top-leave-active {
        transition: all 0.8s ease;
    }

    .pagination-top-enter-from {
        opacity: 0;
        transform: translateY(-100%);
    }
    .pagination-top-leave-to {
        opacity: 0;
        transform: translateY(-100%);
    }
    .pagination-bottom-enter-active,
    .pagination-bottom-leave-active {
        transition: all 0.8s ease;
    }

    .pagination-bottom-enter-from {
        opacity: 0;
        transform: translateY(100%);
    }
    .pagination-bottom-leave-to {
        opacity: 0;
        transform: translateY(100%);
    }
    @media (max-width: 3840px) {
        .products-container {
            width: 60%;
        }
    }
    @media (max-width: 2048px) {
        .products-container {
            width: 80%;
        }
    }
    @media (max-width: 1400px) {
        .products-container {
            width: 95%;
            grid-gap: 16px;
        }
    }
    @media (max-width: 950px) {
        .products-container {
            width: 95%;
            grid-template-columns: repeat(3, 1fr);
        }
    }
    @media (max-width: 725px) {
        .products-container {
            width: 90%;
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (max-width: 480px) {
        .products-container {
            width: 90%;
            grid-template-columns: repeat(1, 1fr);
        }
    }
</style>
