<script>
export default {
    name: 'filter-modal',
    props: {
        isActive: {
            type: Boolean,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        categoryIsVisible: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            priceRange: [null, null],
            brands: [],
            types: [],
            categories: [],
            isSubmitted: false
        }
    },
    methods: {
        closeModal() {
            this.$emit('closeModal');
        },
        valueRangeSubmit() {
            this.$emit('filtersChanged', this.brands, this.types, this.categories, this.priceRange);
            this.isSubmitted = true;
        },
        resetValueRange() {
            const range = this.filters.valueRange;
            this.priceRange = [range.min, range.max];
            if (this.$store.state.products.initFilters) {
                this.valueRangeSubmit();
            }
            this.isSubmitted = false;
        },
        clearFilters() {
            this.brands = [];
            this.types = [];
            this.categories = [];
            this.priceRange = [this.filters.valueRange.min, this.filters.valueRange.max];
        }
    },
    watch: {
        isActive() {
            if (this.isActive && this.priceRange.every(price => !!price === false)) {
                this.priceRange = [this.filters.valueRange.min, this.filters.valueRange.max]
            }
        },
        gender() {
            this.brands = [];
            this.types = [];
            this.categories = [];
            this.priceRange = [null, null];
        },
        brands() {
            if (this.brands.length || this.types.length || this.categories.length || this.$store.state.products.initFilters) this.$emit('filtersChanged', this.brands, this.types, this.categories, this.priceRange);
        },
        types() {
            if (this.brands.length || this.types.length || this.categories.length || this.$store.state.products.initFilters) this.$emit('filtersChanged', this.brands, this.types, this.categories, this.priceRange);
        },
        categories() {
            if (this.brands.length || this.types.length || this.categories.length || this.$store.state.products.initFilters) this.$emit('filtersChanged', this.brands, this.types, this.categories, this.priceRange);
        }
    },
    computed: {
        modalIsActive: {
            get() {
                return this.isActive;
            },
            set() {
                this.$emit('closeModal');
            },
        },
        filters() {
            return this.$store.getters.filters;
        },
        filterSheetIsVisible() {
            return this.filters.brandStats && this.filters.typeStats;
        },
        clearValueRangeButtonDisabled() {
             return this.filters.valueRange.min === this.priceRange[0] && this.filters.valueRange.max === this.priceRange[1];
        },
        submitValueRangeButtonDisabled() {
            return this.filters.valueRange.min === this.priceRange[0] 
            && this.filters.valueRange.max === this.priceRange[1]
            || this.filters.valueRange.min === this.filters.valueRange.max;
        }
    }
}
</script>

<template>
    <v-navigation-drawer
        color="background"
        class="filterModal"
        v-model="modalIsActive" 
        elevation="24"
        temporary
    >
        <Transition name="filterModalContent" mode="out-in">
            <v-sheet 
                class="filterModalContent" 
                v-if="filterSheetIsVisible" 
                key="filters"
                color="background"
            >
                <button-ui 
                    class="closeModal-btn"
                    :set="['f', 'tr', 0, 'mdi-close', 's']"
                    @click="closeModal"
                />
                <v-sheet class="px-5 pt-2" color="background">
                    <p class="text-overline filter-caption pt-2">
                        Price
                    </p>
                    <v-range-slider
                        class="mt-10"
                        v-model="priceRange"
                        step="5"
                        :min="filters.valueRange.min"
                        :max="filters.valueRange.max"
                        thumb-label="always"
                        color="surface"
                        :disabled="filters.valueRange.min === filters.valueRange.max"
                        ref="priceSlider"
                        strict
                    />
                    <div class="slider-btns-wrapper">
                        <button-ui 
                            class="submitValue-btn"
                            :set="[0, 0, 0, 0, 0, 'Search']"
                            @click="valueRangeSubmit"
                            :disabled="submitValueRangeButtonDisabled"
                        />
                        <button-ui 
                            class="clearValue-btn ml-1 rounded"
                            :set="[0, 0, 0, 'mdi-filter-off', 's']"
                            @click="resetValueRange"
                            :disabled="clearValueRangeButtonDisabled || !isSubmitted"
                        />
                    </div>
                </v-sheet>
                <v-sheet class="px-5" color="background" v-if="categoryIsVisible">
                    <p class="text-overline brand-caption pt-2">
                        Category
                    </p>
                    <v-checkbox
                        class="filter-checkbox"
                        v-for="category in filters.categoryStats" 
                        :key="category._id.category" 
                        :value="category._id.category" 
                        :label="`(${category.count}) ${category._id.category}`" 
                        v-model="categories"
                        density="compact"
                        hide-details
                        :disabled="!category.count"
                    />
                </v-sheet>
                <v-sheet class="px-5" color="background">
                    <p class="text-overline brand-caption pt-2">
                        Brand
                    </p>
                    <v-checkbox
                        class="filter-checkbox"
                        v-for="brand in filters.brandStats" 
                        :key="brand._id.brand" 
                        :value="brand._id.brand" 
                        :label="`(${brand.count}) ${brand._id.brand}`" 
                        v-model="brands"
                        density="compact"
                        hide-details
                        :disabled="!brand.count"
                    />
                </v-sheet>
                <v-sheet class="px-5 pb-2" color="background">
                    <p class="text-overline type-caption pt-2">
                        Type
                    </p>
                    <v-checkbox
                        class="filter-checkbox"
                        v-for="itemType in filters.typeStats" 
                        :key="itemType._id.type" 
                        :value="itemType._id.type" 
                        :label="`(${itemType.count}) ${itemType._id.type}`" 
                        v-model="types"
                        density="compact"
                        hide-details
                        :disabled="!itemType.count"
                    />
                </v-sheet>
            </v-sheet>
            <v-sheet 
                class="h-100" 
                color="background" 
                key="progress"
                v-else 
            >
                <v-progress-circular
                    class="filterProgress"
                    color="surface"
                    indeterminate
                    :size="64"
                    :width="5"
                />
            </v-sheet>
        </Transition>
        <Transition name="filterModalClearBtn" mode="out-in">
            <button-ui 
                v-if="filterSheetIsVisible"
                class="clearFilters-btn rounded-0"
                :set="[0, 0, 0, 0, 0, 'Clear']"
                @click="clearFilters"
            />
        </Transition>
    </v-navigation-drawer>
</template>
<style>
    .filterModal {
        margin-top: calc(64px + 30 * (100vw / 1400));
        max-height: calc(100% - calc(64px + 30 * (100vw / 1400))) !important;
    }
    .filterModalContent {
        height: calc(100% - 36px);
        overflow: auto;
    }
    .closeModal-btn {
        position: absolute;
        z-index: 1;
        top: 0px;
        right: 8px;
    }
    .filter-caption, .brand-caption, .type-caption {
        text-align: center;
        font-size: 16px !important;
        font-weight: bold;
    }
    .filter-checkbox label {
        color: black;
        font-weight: bold;
        font-size: 12px !important;
    }
    .filterProgress {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .clearValue-btn {
        max-height: 36px;
    }
    .submitValue-btn {
        width: 80%;
    }
    .slider-btns-wrapper {
        display: flex;
        justify-content: space-between;
    }
    .clearFilters-btn {
        width: 100%;
    }
    .filterModalContent-enter-active,
    .filterModalContent-leave-active,
    .filterModalClearBtn-enter-active,
    .filterModalClearBtn-leave-active {
        transition: all 0.5s ease;
    }
    .filterModalContent-enter-from,
    .filterModalContent-leave-to,
    .filterModalClearBtn-enter-from,
    .filterModalClearBtn-leave-to {
        transform: translateX(-100%);
    }
</style>