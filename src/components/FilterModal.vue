<script>
export default {
    name: 'filter-modal',
    props: {
        isActive: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            priceRange: [null, null],
            brands: [],
            types: []
        }
    },
    methods: {
        closeModal() {
            this.$emit('closeModal');
        }
    },
    watch: {
        isActive() {
            if (this.isActive && this.priceRange.every(price => !!price === false)) {
                this.priceRange = [this.filters.valueRange.min, this.filters.valueRange.max]
            }
        },
        brands() {
            this.$emit('filtersChanged', this.brands, this.types);
        },
        types() {
            this.$emit('filtersChanged', this.brands, this.types);
        }
    },
    computed: {
        modalIsActive() {
            return this.isActive;
        },
        filters() {
            return this.$store.state.products.filters;
        },
        filterSheetIsVisible() {
            return this.$store.state.products.filters.brandStats && this.$store.state.products.filters.typeStats;
        }
    }
}
</script>

<template>
    <v-navigation-drawer
        color="background"
        class="filterModal"
        v-model="modalIsActive" 
        @update:modelValue="closeModal"
        elevation="24"
        temporary
    >
        <Transition name="filterModalContent" mode="out-in">
            <v-sheet class="h-100" color="background" v-if="filterSheetIsVisible" key="filters">
                <v-btn 
                    class="closeModal-btn" 
                    icon="mdi-close" 
                    variant="flat" 
                    size="small"
                    color="background"
                    @click="closeModal"
                />
                <v-sheet class="px-5 pt-2" color="background">
                    <p class="text-overline filter-caption">Price</p>
                    <v-range-slider
                        class="mt-10"
                        v-model="priceRange"
                        step="5"
                        :min="filters.valueRange.min"
                        :max="filters.valueRange.max"
                        thumb-label="always"
                        color="surface"
                    ></v-range-slider>
                </v-sheet>
                <v-sheet class="px-5" color="background">
                    <p class="text-overline brand-caption">Brand</p>
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
                    ></v-checkbox>
                </v-sheet>
                <v-sheet class="px-5 pb-2" color="background">
                    <p class="text-overline type-caption">Type</p>
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
                    ></v-checkbox>
                </v-sheet>
            </v-sheet>
            <v-sheet class="h-100" color="background" v-else key="progress">
                <v-progress-circular
                    class="filterProgress"
                    color="surface"
                    indeterminate
                    :size="64"
                    :width="5"
                ></v-progress-circular>
            </v-sheet>
        </Transition>
    </v-navigation-drawer>
</template>

<style>
    .v-navigation-drawer__scrim {
        width: calc(100% + 10px) !important;
    }
    .filterModal {
        margin-top: calc(64px + 30 * (100vw / 1400));
        overflow-y: auto;
    }
    .closeModal-btn {
        position: absolute;
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
    .filterModalContent-enter-active,
    .filterModalContent-leave-active {
        transition: all 0.5s ease;
    }

    .filterModalContent-enter-from {
        transform: translateX(-100%);
    }
    .filterModalContent-leave-to {
        transform: translateX(-100%);
    }
</style>