<script>
import ProductCard from '@/components/ProductCard.vue';
import FilterModal from '@/components/FilterModal.vue';
import pageListMixin from '@/mixins/pageListMixin';
export default {
    name: 'products-list',
    mixins: [pageListMixin],
    props: {
        genderSwitchVisible: {
            type: Boolean
        }
    },
    data() {
        return {
            page: this.$route.params.page,
            select: 'rating',
            sortSelectVariants: ['rating', 'cheap', 'expensive'],
            filterPanelIsVisible: false,
            brands: [],
            types: [],
            categories: [],
            valueRange: []
        }
    },
    components: {
        ProductCard,
        FilterModal
    },
    mounted() {
        this.page = Number(this.$route.params.page);
    },
    beforeUnmount() {
        this.$store.commit('deleteProducts');
        this.$store.commit('clearFilters');
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
            setTimeout(() => {
                const pathWithoutPage = this.$route.path.slice(0, this.$route.path.lastIndexOf('/'));
                this.$router.push(`${pathWithoutPage}/${modelValue}`)
            }, 400)
        },
        filtersChanged(brands, types, categories, valueRange) {
            window.scrollTo({
                top: 0,
                behavior: "auto"
            });
            this.brands = brands;
            this.types = types;
            this.categories = categories;
            this.valueRange = valueRange;
            this.$store.commit('saveFilters');
            this.$store.commit('deleteProducts');
            const pathWithoutPage = this.$route.path.slice(0, this.$route.path.lastIndexOf('/'));
            if (this.$route.params.page === '1') {
                this.pageParamHandler()
            } else {
                this.page = 1;
                this.$router.push(`${pathWithoutPage}/1`);
            }
        },
        pageParamHandler() {
            const action = this.genderSwitchVisible ? 'getSale' : 'getProducts';
            const payload = {
                gender: this.genderSwitchVisible ? this.gender : this.genderParam,
                category: this.genderSwitchVisible ? null : this.categoryParam,
                page: this.page,
                fetchFilters: this.$store.state.products.filters.valueRange.min ? false : true,
                sort: this.select,
                brands: this.brands.length ? this.brands.join('!') : null,
                types: this.types.length ? this.types.join('!') : null,
                categoryFilters: this.categories.length ? this.categories.join('!') : null,
                valueRange: this.valueRange[0] ? this.valueRange.join('!') : null
            }
            this.page = Number(this.$route.params.page);
            if (!this.$store.state.products.products.some(prods => prods.page === this.page) && this.$route.params.page) {
                this.$store.dispatch(action, payload);
            }
        },
        openFilterModal() {
            this.$store.commit('toggleFilterModal', true);
        },
        closeFilterModal() {
            this.$store.commit('toggleFilterModal', false);
        },
        afterEnterPage() {
            setTimeout(() => {
                this.filterPanelIsVisible = true;
            }, 1000);
        },
        beforeLeavePage() {
            this.filterPanelIsVisible = false;
        }
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
        products() {
            return this.$store.state.products.products.find(prod => prod.page === Number(this.$route.params.page));
        },
        showProducts() {
            return this.products && this.$route.params.page === this.page + '';
        },
        totalPages() {
            return this.$store.state.products.totalPages;
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
        filterModalActive() {
            return this.$store.state.filterModalActive;
        },
        filterBtnColor() {
            return this.filterModalActive ? 'surface' : 'background';
        },
        panelTransform() {
            return this.$store.state.filterModalActive || this.$store.state.authModalActive || this.$store.state.basketModalActive;
        },
        userDeviceIsMobile() {
            return this.$store.state.userDeviceIsMobile;
        }
    }
}
</script>

<template>
    <main :class="(genderSwitchVisible ? 'Sale' : 'Products') + ' page'" v-scroll="handleScroll">
        <Transition name="pagination-top">
            <pagination 
                v-if="totalPages > 1"
                :length="totalPages"
                @update:modelValue="changePage"
                v-model="page"
            />
        </Transition>
        <Transition name="products-container" @after-enter="afterEnterPage" @before-leave="beforeLeavePage">
        <v-container class="products-container" v-if="showProducts">
            <product-card
                v-for="product in thisPageProducts" 
                :product="product"
            />
            <Transition name="filter-panel" appear>
                <v-sheet 
                    v-if="filterPanelIsVisible" 
                    class="filter-panel rounded-lg" 
                    color="background"
                    :style="panelTransform && !userDeviceIsMobile ? 'transform: translateX(calc(-50% - 5px));' : 'transform: translateX(-50%);'"
                >
                    <v-sheet v-if="genderSwitchVisible" class="gender-switch mr-5 h-24" color="transparent">
                        <v-switch
                            v-model="gender"
                            true-value="women"
                            false-value="men"
                            inset 
                            density="compact" 
                            color="white"
                            hide-details
                        ></v-switch>
                        <label class="switch-value">
                            {{ gender }}
                        </label>
                    </v-sheet>
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
                            @click="openFilterModal"
                        ></v-btn>
                    </v-sheet>
                </Transition>
        </v-container>
        </Transition>
        <Transition name="pagination-bottom">
            <pagination 
                v-if="totalPages > 1 && showProducts" 
                :length="totalPages"
                @update:modelValue="changePage"
                v-model="page"
            />
        </Transition>
        <filter-modal 
            :isActive="filterModalActive"
            :gender="gender"
            :categoryIsVisible="genderSwitchVisible"
            @closeModal="closeFilterModal"
            @filtersChanged="filtersChanged"
        />
    </main>
</template>

<style>
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
    .gender-switch {
        position: relative;
        max-height: 42px;
    }
    .switch-value {
        position: absolute;
        top: 27px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 11px;
    }
    .gender-switch .v-switch__thumb {
        color: white;
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
    .filter-panel-enter-active,
    .filter-panel-leave-active {
        transition: all 0.5s ease;
    }

    .filter-panel-enter-from {
        opacity: 0;
        top: 100vh;
    }
    .filter-panel-leave-to {
        opacity: 0;
        top: 100vh;
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
