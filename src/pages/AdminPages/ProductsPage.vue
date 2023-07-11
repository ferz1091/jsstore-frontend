<script>
import ProductCard from '@/components/ProductCard.vue';
export default {
    components: {
        ProductCard
    },
    data() {
        return {
            gender: 'men',
            searchString: '',
            page: 1
        }
    },
    mounted() {
        this.getProducts();
    },
    unmounted() {
        this.$store.commit('deleteProducts');
    },
    methods : {
        getProducts() {
            this.$store.dispatch('getProductsByString', { gender: this.gender, string: this.searchString, page: this.page });
        },
        deleteProducts() {
            this.$store.commit('deleteProducts');
        },
        clearField() {
            this.searchString = '';
        },
        changePage(modelValue) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            this.page = modelValue;
        },
        search() {
            this.deleteProducts();
            this.page = 1;
            this.getProducts();
        }
    },
    watch: {
        gender() {
            this.search();
        },
        searchString() {
            if(!this.searchString) {
                this.search();
            }
        },
        page() {
            if (!this.products) {
                this.getProducts();
            }
        }
    },
    computed: {
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
    <main class="panelProducts page">
        <v-container class="productsPanel-wrapper h-100">
            <v-sheet class="py-2 px-4 elevation-2 rounded-lg" color="background">
                <v-sheet class="searchString-wrapper mt-3" color="background">
                    <v-text-field
                        v-model="searchString"
                        variant="solo" 
                        class="mr-2"
                        bg-color="background" 
                        density="comfortable" 
                        label="Search"
                        clearable
                        hide-details
                        @click:clear="clearField"
                    />
                    <button-ui 
                        class="searchString-btn rounded-lg" 
                        @click="search"
                        :set="[0, 0, 0, 'mdi-magnify', 0, 0]"
                        :disabled="searchString.length < 3"
                    />
                </v-sheet>
                <v-sheet class="products-gender-boxes" color="background">
                    <v-checkbox 
                        v-model="gender" 
                        label="men" 
                        value="men" 
                        hide-details 
                        :disabled="gender === 'men'" 
                    />
                    <v-checkbox 
                        v-model="gender" 
                        label="women" 
                        value="women" 
                        hide-details 
                        :disabled="gender === 'women'" 
                    />
                </v-sheet>
            </v-sheet>
            <pagination
                v-if="totalPages > 1" 
                :length="totalPages" 
                class="pt-5"
                @update:modelValue="changePage" 
                v-model="page" 
            />
            <v-container class="products-container px-0 mt-4">
                <product-card 
                    v-if="products" 
                    v-for="product in products.data"
                    :product="product"
                    :gender="gender"
                    :editMode="true"
                />
            </v-container>
            <pagination
                v-if="totalPages > 1" 
                :length="totalPages" 
                class="pb-5"
                @update:modelValue="changePage" 
                v-model="page" 
            />
        </v-container>
    </main>
</template>
<style>
.products-container {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: calc(0px + 16 * (100vw / 1400));
    min-height: calc(100vh - calc(64px + 30 * (100vw / 1400)) - 45.6px);
}
.price-block {
    justify-content: center !important;
}
.products-gender-boxes, .products-gender-boxes .v-input {
    display: flex;
    justify-content: center;
}
.searchString-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
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
</style>
