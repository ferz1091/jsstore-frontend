<script>
import ProductProp from './ProductProp.vue';
export default {
    components: {
        ProductProp
    },
    data() {
        return {
            size: this.sizeSelect
        }
    },
    props: {
        sizeSelect: {type: String, default: null},
        amountSelect: {type: Number, required: true}
    },
    methods: {
        updateSizeSelect(newValue) {
            this.$emit('updateSizeSelect', newValue);
        },
        decreaseAmount() {
            this.$emit('changeAmount', 0);
        },
        increaseAmount() {
            this.$emit('changeAmount', 1);
        },
        addToCart() {
            if (this.productInBasket) {
                this.$emit('removeFromBasket');
            } else {
                this.$emit('addToCart');
            }
        },
        addToFavorites() {
            if (!this.isProductInFavorites) {
                this.$store.dispatch('addToFavorites', { id: this.userId, gender: this.genderPath, productId: this.currentProduct._id });
            } else {
                this.$store.dispatch('removeFromFavorites', { id: this.userId, gender: this.genderPath, productId: this.currentProduct._id });
            }
        }
    },
    computed: {
        currentProduct() {
            return this.$store.state.currentProduct;
        },
        sizeSelectItems() {
            return this.currentProduct.amount.map(size => {
                return size.amount ? size.size : null;
            }).filter(item => item);
        },
        sizePanelIsVisible() {
            return this.sizeSelectItems.length && !this.productInBasket;
        },
        productColors() {
            const colorNames = this.currentProduct.color.value.split(',');
            let colorArray = [];
            for (let i = 0; i < colorNames.length; i++) {
                colorArray.push({ name: colorNames[i].trim(), rgb: this.currentProduct.color.rgb[i] })
            }
            return colorArray;
        },
        productInBasket() {
            return this.$store.getters.basket.some(product => product.item._id === this.currentProduct._id);
        },
        isAuth() {
            return this.$store.getters.isAuth;
        },
        genderPath() {
            return this.$route.params.gender;
        },
        isProductInFavorites() {
            return this.$store.state.user.favorites[this.genderPath].some(product => product === this.currentProduct._id);
        },
        userId() {
            return this.$store.getters.userId;
        }
    }
}
</script>
<template>
    <v-sheet class="product-info py-6" color="background">
        <v-sheet color="background">
            <v-sheet 
                class="product-images rounded-lg mr-4" 
                color="background" 
                elevation="3"
            >
                <v-carousel 
                    show-arrows="hover" 
                    hide-delimiter-background 
                    delimiter-icon="mdi-square"
                >
                    <v-carousel-item 
                        v-for="image in currentProduct.images"
                        :src="`https://jsstore-backend.vercel.app/${image.path}`"
                    />
                </v-carousel>
            </v-sheet>
            <div class="product-button-panel">
                <div>
                    <button-ui
                        class="product-button mt-2 mr-4 elevation-9"
                        :set="[0, productInBasket ? 'sc' : 'b', 0, 0, 0, productInBasket ? 'Added' : 'Add to cart']"
                        :append-icon="productInBasket ? 'mdi-check' : 'mdi-basket-plus'"
                        :disabled="currentProduct.amount.every(size => !size.amount)"
                        @click="addToCart" 
                    />
                </div>
                <div>
                    <button-ui 
                        v-if="isAuth"
                        class="product-button mt-2 mr-4 elevation-9"
                        :set="[0, isProductInFavorites ? 's' : 'b', 0, 0, 0, isProductInFavorites ? 'In favorites' : 'Add to favorites']"
                        :append-icon="isProductInFavorites ? 'mdi-heart' : 'mdi-heart-outline'"
                        style="z-index: 2;" 
                        @click="addToFavorites"
                    />
                </div>
                <Transition name="product-selectors">
                    <v-sheet v-if="sizePanelIsVisible" class="product-selectors mr-4" color="background">
                        <div class="size-selector-wrapper">
                            <v-label class="text-caption" for="size-selector">Select size</v-label>
                            <custom-select 
                                v-model="size" 
                                @update:modelValue="updateSizeSelect" 
                                id="size-selector" 
                                class="size-selector rounded elevation-9" 
                                :items="sizeSelectItems" 
                                ref="sizeSelector"
                            />
                            <v-icon 
                                class="size-selector-down-icon" 
                                icon="mdi-chevron-down" 
                                variant="text"
                                density="compact" 
                                size="small"
                                color="background"
                            />
                        </div>
                        <Transition name="amount-selector">
                            <v-sheet 
                                v-if="sizeSelect"
                                class="amount-selector rounded mt-2" 
                                color="surface" 
                            >
                                <button-ui 
                                    :set="['t', 'b', 0, 'mdi-minus-box', 's']"
                                    @click="decreaseAmount"
                                />
                                <span class="amount text-h6">
                                    {{ amountSelect }}
                                </span>
                                <button-ui 
                                    :set="['t', 'b', 0, 'mdi-plus-box', 's']"
                                    @click="increaseAmount"
                                />
                            </v-sheet>
                        </Transition>
                    </v-sheet>
                </Transition>
            </div>
        </v-sheet>
        <v-sheet class="product-description" color="background">
            <p class="product-name text-button font-weight-bold">
                {{ currentProduct.name }}
            </p>
            <div class="product-rating">
                <v-rating 
                    v-model="currentProduct.rating" 
                    readonly 
                    density="compact" 
                    color="rating" 
                    size="small"
                    half-increments
                />
                <span class="text-caption ml-2">
                    {{ currentProduct.rateAmount }} ratings
                </span>
                &nbsp;|&nbsp;
                <span class="text-caption" v-if="currentProduct.comments">
                    {{ currentProduct.comments.totalCount }} comments
                </span>
            </div>
            <v-divider class="my-3 border-opacity-25" color="surface" />
            <product-prop name="Price">
                <span class="product-price text-h5 font-weight-bold pl-2">
                    {{ currentProduct.value }}$
                </span>
                <span class="product-oldprice text-body-1 pl-2" v-if="currentProduct.isSale.flag">
                    <s>
                        {{ currentProduct.isSale.oldValue }}$
                    </s>
                </span>
            </product-prop>
            <product-prop name="Brand">
                <span class="product-brand text-body-2  pl-2">
                    {{ currentProduct.brand }}
                </span>
            </product-prop>
            <product-prop name="Category">
                <span class="pl-2 text-caption">
                    {{ currentProduct.category.charAt(0).toUpperCase() + currentProduct.category.slice(1) }}
                </span>
            </product-prop>
            <product-prop name="Type">
                <span class="pl-2 text-caption">
                    {{ currentProduct.type }}
                </span>
            </product-prop>
            <product-prop name="Color">
                <span class="pl-2" v-for="color in productColors">
                    <span class="text-caption pr-1">
                        {{ color.name }}
                    </span>
                    <span 
                        class="product-color-circle rounded-xl elevation-3"
                        v-bind:style="{ background: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})` }"
                    ></span>
                </span>
            </product-prop>
            <product-prop name="Material">
                <v-chip 
                    v-for="material in currentProduct.materials" 
                    class="ml-2" 
                    density="compact"
                    variant="elevated" 
                    color="gray" 
                    draggable
                >
                    {{ material }}
                </v-chip>
            </product-prop>
            <product-prop name="Available sizes">
                <span 
                    v-if="!currentProduct.amount.every(size => !size.amount)"
                    v-for="size in currentProduct.amount"
                    class="product-size pl-2" 
                >
                    <v-chip 
                        v-if="size.amount" 
                        color="surface" 
                        variant="elevated" 
                        density="compact" 
                        draggable
                    >
                        {{ size.size }}
                    </v-chip>
                </span>
                <span class="product-size pl-2" v-else>
                    <v-chip color="surface" density="comfortable">
                        Out of stock
                    </v-chip>
                </span>
            </product-prop>
            <v-divider class="my-3 border-opacity-25" color="surface" v-if="currentProduct.description" />
            <product-prop v-if="currentProduct.description" name="Description">
                <span class="pl-2 text-caption">
                    {{ currentProduct.description }}
                </span>
            </product-prop>
            <v-divider class="my-3 border-opacity-25" color="surface" />
            <product-prop name="Properties" />
                <v-list bg-color="background">
                    <v-list-item 
                        v-for="prop in currentProduct.properties"
                        :key="prop"
                        class="text-body-2 pl-0" 
                        color="background"
                    >
                        <v-icon type="mdi" icon="mdi-circle-medium" />
                        {{ prop }}
                    </v-list-item>
                </v-list>
        </v-sheet>
    </v-sheet>
</template>
<style>
    .product-info {
        display: grid !important;
        grid-template-columns: 40% 60%;
        justify-content: center;
        padding-left: calc(0px + 60 * (100vw / 1400));
        padding-right: calc(0px + 60 * (100vw / 1400));
        max-width: 2000px;
        margin: 0 auto;
    }
    .product-button {
        width: calc(100% - 16px);
    }
    .product-name {
        font-size: 18px !important;
    }
    .product-rating {
        display: flex;
        align-items: center;
    }
    .product-price {
        color: #C41E3A;
    }
    .product-oldprice {
        color: gray;
    }
    .product-color-circle {
        position: relative;
        top: 3px;
        display: inline-block;
        width: 16px;
        height: 16px;
    }
    .amount-selector {
        height: 36px;
        display: flex !important;
        align-items: center;
        justify-content: space-between;
    }
    .size-selector-wrapper {
        position: relative;
        background: rgba(0, 0, 0, 0);
    }
    .size-selector {
        cursor: pointer;
        position: relative;
        background: black;
        z-index: 1;
        width: 100%;
        height: 36px;
        padding-left: 49%;
    }
    .size-selector:focus {
        outline: none;
    }
    .size-selector-down-icon {
        position: absolute !important;
        cursor: pointer;
        top: 70%;
        right: 5px;
        z-index: 2;
        transform: translateY(-50%);
    }
    .amount-selector-enter-active,
    .amount-selector-leave-active,
    .product-selectors-enter-active,
    .product-selectors-leave-active {
        transition: all 0.6s ease;
    }

    .amount-selector-enter-from,
    .amount-selector-leave-to,
    .product-selectors-enter-from,
    .product-selectors-leave-to {
        opacity: 0;
        transform: translateX(-200%);
    }
    @media (min-width: 1100px) {
        .product-info {
            grid-template-columns: 400px 1fr;
        }
    }

    @media (min-width: 1920px) {
        .product-info {
            grid-template-columns: 400px 1520px;
        }
    }

    @media (max-width: 750px) {
        .product-info {
            display: flex !important;
            flex-direction: column;
        }

        .product-description {
            padding-top: 15px;
        }
        .product-images,
        .product-button,
        .product-selectors {
            margin-right: 0px !important;
            width: 100%;
        }
    }
</style>
