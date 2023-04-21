<script>
import FavoritesItem from '@/components/AccountFavoritesPageComponents/FavoritesItem.vue';
export default {
    components: {
        FavoritesItem
    },
    data() {
        return {
            mode: 'all',
            modeVariants: {
                all: {
                    flag: true,
                    value: 'all'
                },
                men: {
                    flag: false,
                    value: 'men'
                },
                women: {
                    flag: false,
                    value: 'women'
                }
            },
            displayWidth: null,
            isFetched: false,
            filterPanelIsVisible: true
        }
    },
    mounted() {
        if (!this.isAuth) {
            this.$router.push('/shop/entry/men');
        }
        if (this.$store.state.user.id) {
            this.$store.dispatch('getUserFavorites', {id: this.$store.state.user.id});
        }
        this.handleResize()
        window.addEventListener('resize', this.handleResize);
        this.isFetched = true;
    },
    unmounted() {
        this.$store.commit('clearFavorites');
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        handleCheckboxPanel(value, flag) {
            if (!flag) {
                this.modeVariants.all.flag = true;
                this.mode = this.modeVariants.all.value;
            } else {
                const keys = Object.keys(this.modeVariants);
                for (let i = 0; i < keys.length; i++) {
                    if (this.modeVariants[keys[i]].value !== value) {
                        this.modeVariants[keys[i]].flag = false;
                    } else {
                        this.mode = this.modeVariants[keys[i]].value;
                    }
                }
            }
        },
        handleResize() {
            this.displayWidth = window.innerWidth;
        },
        handleScroll() {
            if (window.pageYOffset + window.innerHeight >= this.$refs.favoritesContainer.clientHeight && window.pageYOffset) {
                this.filterPanelIsVisible = false;
            } else {
                this.filterPanelIsVisible = true;
            }
        },
    },
    watch: {
        isAuth() {
            if (!this.isAuth) {
                this.$router.push('/');
            }
        }
    },
    computed: {
        isAuth() {
            return this.$store.state.isAuth;
        },
        isFetching() {
            return this.$store.state.isFetching;
        },
        products() {
            const products = this.$store.state.userFavorites;
            if (this.mode === 'all') {
                return this.mergedProducts;
            } else {
                return products[this.mode];
            }
        },
        mergedProducts() {
            const products = this.$store.state.userFavorites;
            if (products) {
                let result = [];
                for (let i = 0; i < products.men.length + products.women.length; i++) {
                    if (products.men[i] !== undefined) {
                        result.push(products.men[i]);
                    }
                    if (products.women[i] !== undefined) {
                        result.push(products.women[i]);
                    }
                }
                return result;
            }
            return [];
        },
        panelIsVisible() {
            const favorites = this.$store.state.userFavorites;
            if (favorites) {
                if (favorites.men.length && favorites.women.length) {
                    return true;
                }
            }
            return false;
        }
    }
}
</script>
<template>
    <main class="my-favorites page">
        <Transition name="my-favorites-container" ref="favoritesContainer">
            <v-container 
                class="my-favorites-container" 
                v-if="products.length" 
                v-scroll="handleScroll"
            >
                <FavoritesItem 
                    v-for="product in products" 
                    :product="product" 
                    :displayWidth="displayWidth" 
                    :key="product._id"
                />
            </v-container>
        </Transition>
        <Transition name="my-favorites-panel">
            <v-sheet 
                v-if="isAuth && panelIsVisible && filterPanelIsVisible"
                class="my-favorites-panel rounded-xl py-1" 
                elevation="14" 
            >
                <v-checkbox 
                    class="my-favorites-panel-checkbox" 
                    hide-details 
                    density="compact" 
                    color="background"
                    v-model="modeVariants.all.flag"
                    @change="handleCheckboxPanel(modeVariants.all.value, modeVariants.all.flag)"
                >
                    <label class="my-favorites-panel-checkbox-label text-caption">
                        all
                    </label>
                </v-checkbox>
                <v-checkbox 
                    class="my-favorites-panel-checkbox" 
                    hide-details 
                    density="compact" 
                    v-model="modeVariants.men.flag"
                    @change="handleCheckboxPanel(modeVariants.men.value, modeVariants.men.flag)"
                >
                    <label class="my-favorites-panel-checkbox-label text-caption">
                        men
                    </label>
                </v-checkbox>
                <v-checkbox 
                    class="my-favorites-panel-checkbox" 
                    hide-details 
                    density="compact" 
                    color="background" 
                    v-model="modeVariants.women.flag"
                    @change="handleCheckboxPanel(modeVariants.women.value, modeVariants.women.flag)"
                >
                    <label class="my-favorites-panel-checkbox-label text-caption">
                        women
                    </label>
                </v-checkbox>
            </v-sheet>
        </Transition>
        <Transition name="my-favorites-empty">
            <v-sheet 
                v-if="isAuth && !products.length && !isFetching && isFetched" 
                class="my-favorites-empty" 
                color="background"
            >
                <p class="text-body-1">
                    You don't have favorites
                </p>
                <v-btn 
                    class="mt-2" 
                    variant="elevated" 
                    color="surface" 
                    density="comfortable" 
                    @click="() => $router.back()"
                >
                    back
                </v-btn>
            </v-sheet>
        </Transition>
    </main>
</template>
<style>
.my-favorites-container {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(5, 1fr);
    overflow: hidden;
}
.my-favorites-panel {
    position: fixed;
    left: 50%;
    bottom: 5px;
    transform: translateX(-50%);
    width: 250px;
    display: flex;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.8);
}
.my-favorites-panel-checkbox {
    position: relative;
    bottom: 5px;
}
.my-favorites-panel-checkbox i {
    color: white;
    opacity: 0.8 !important;
}
.my-favorites-panel-checkbox .v-input__control {
    display: flex;
    justify-content: center;
}
.my-favorites-panel-checkbox-label {
    position: absolute;
    top: 80%;
    left: 50%;
    transform: translate(-50%);
    color: white;
}
.my-favorites-empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.v-input--checkbox .v-input--selection-controls__input {
  border-color: blue;
}
.my-favorites-container-enter-active,
.my-favorites-empty-enter-active {
    transition: all 0.75s ease;
}
.my-favorites-container-enter-from,
.my-favorites-empty-enter-from {
    opacity: 0;
    transform: translateY(100%);
}
.my-favorites-panel-enter-active,
.my-favorites-panel-leave-active {
    transition: all 1.5s ease;
}

.my-favorites-panel-enter-from {
    opacity: 0;
    bottom: -100%;
}

.my-favorites-panel-leave-to {
    opacity: 0;
    bottom: -100%;
}
@media (max-width: 950px) {
    .my-favorites-container {
        grid-template-columns: repeat(4, 1fr);
    }
}
@media (max-width: 750px) {
    .my-favorites-container {
        grid-template-columns: repeat(3, 1fr);
    }
}
@media (max-width: 550px) {
    .my-favorites-container {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (max-width: 375px) {
    .my-favorites-container {
        grid-template-columns: repeat(1, 1fr);
    }
}
</style>
