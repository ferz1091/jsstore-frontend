<script>
import ProductProp from '@/components/ProductItemPageComponents/ProductProp.vue';
export default {
    components: {
        ProductProp
    },
    data() {
        return {
            isVisible: {
                img: true,
                desc: false
            }
        }
    },
    props: {
        product: {type: Object, required: true},
        displayWidth: {type: Number, default: null}
    },
    methods: {
        toggleDescIsVisible(name, flag) {
            this.isVisible[name] = flag;
        },
        toProductPage() {
            window.open(`${window.location.origin}/product/${this.product.article.slice(3, 4) === '1' ? 'men' : 'women'}/${this.product._id}`);
        },
        addToBasket() {
            if (this.productInBasket) {
                this.$store.commit('removeFromBasket', this.product._id);
            } else {
                this.$store.commit('addToBasket', { product: this.product });
            }
        },
        removeFromFavorites(){
            this.$store.dispatch('removeFromFavorites', {id: this.$store.state.user.id, gender: this.genderPath, productId: this.product._id});
        },
        infoBtnHandler() {
            if (this.isVisible.img) {
                this.toggleDescIsVisible('img', false);
            } else {
                this.toggleDescIsVisible('desc', false);
            }
        }
    },
    computed: {
        productTitle() {
            if (this.displayWidth < 725 && this.product.name.length > 28) {
                return this.product.name.slice(0, 25) + '...';
            }
            if (this.product.name.length > 35) {
                return this.product.name.slice(0, 32) + '...';
            }
            return this.product.name;
        },
        productInBasket() {
            return this.$store.state.basket.products.some(product => product.item._id === this.product._id);
        },
        genderPath() {
            return this.product.article.slice(3, 4) === '1' ? 'men' : 'women';
        },
        imgPath() {
            return `https://jsstore-backend.vercel.app/${this.product.images.find(img => img.title).path}`;
        },
        productColors() {
            const colorNames = this.product.color.value.split(',');
            let colorArray = [];
            for (let i = 0; i < colorNames.length; i++) {
                colorArray.push({ name: colorNames[i].trim(), rgb: this.product.color.rgb[i] })
            }
            return colorArray;
        },
    }
}
</script>
<template>
    <v-sheet 
        class="my-favorites-item pa-3 mb-3 rounded-lg" 
        color="background" 
        elevation="14" 
    >
        <p class="my-favorites-item-title px-2 text-body-2 rounded-lg text-center font-weight-bold">
            {{ productTitle }}
        </p>
        <Transition name="my-favorites-item-img" @after-leave="() => toggleDescIsVisible('desc', true)">
            <v-sheet 
                v-if="isVisible.img"
                class="my-favorites-item-img-wrapper" 
                color="background" 
            >
                <v-img class="my-favorites-item-img mb-2" :src="imgPath" />
                <div class="my-favorites-item-rating">
                    <v-rating 
                        v-model="product.rating"
                        readonly
                        density="compact"
                        color="rating"
                        size="small"
                        half-increments
                    ></v-rating>
                    <span class="text-caption">
                        ({{ product.rateAmount }})
                    </span>
                </div>
                <div v-if="product.markers" class="my-favorites-item-markers">
                    <v-chip 
                        v-if="product.isSale.flag" 
                        class="my-1" 
                        color="error" 
                        variant="elevated"
                        density="compact"
                    >
                        Sale
                    </v-chip>
                    <v-chip 
                        class="my-1" 
                        v-for="marker in product.markers.slice(0, 5)" 
                        color="error" 
                        variant="elevated"
                        density="compact"
                    >
                        {{ marker }}
                    </v-chip>
                    <v-chip 
                        v-if="product.amount.every(prod => prod.amount === 0)" 
                        color="gray" 
                        variant="elevated"
                        density="compact"
                    >
                        Out
                    </v-chip>
                </div>
            </v-sheet>
        </Transition>
        <Transition 
            name="my-favorites-item-desc" 
            @after-leave="() => toggleDescIsVisible('img', true)"
        >
            <v-sheet 
                v-if="isVisible.desc" 
                class="my-favorites-item-desc mb-2" 
                color="background"
            >
                <product-prop class="my-favorites-item-desc-prop" name="Price">
                    <span class="my-favorites-item-desc-prop-price text-body-1 font-weight-bold pl-2">
                        {{product.value + '$' }}
                    </span>
                </product-prop>
                <product-prop class="my-favorites-item-desc-prop" name="Art.">
                    <span class="text-body-2 pl-2">
                        {{ product.article }}
                    </span>
                </product-prop>
                <product-prop class="my-favorites-item-desc-prop" name="Brand">
                    <span class="text-body-2 pl-2">
                        {{ product.brand }}
                    </span>
                </product-prop>
                <product-prop class="my-favorites-item-desc-prop" name="Type">
                    <span class="text-body-2 pl-2">
                        {{ product.type }}
                    </span>
                </product-prop>
                <product-prop class="my-favorites-item-desc-prop" name="Cat.">
                    <span class="text-body-2 pl-2">
                        {{ product.category }}
                    </span>
                </product-prop>
                <product-prop class="my-favorites-item-desc-prop" name="Color">
                    <span class="pl-2" v-for="color in productColors">
                        <span 
                            class="product-color-circle rounded-xl elevation-3"
                            v-bind:style="{ background: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})` }"
                        ></span>
                    </span>
                </product-prop>
            </v-sheet>
        </Transition>
        <v-sheet class="my-favorites-item-panel mx-2 py-1 rounded-lg" color="background">
            <button-ui 
                class="my-favorites-item-panel-btn-open rounded-0 px-2"
                :set="[0, 'b', '1', 'mdi-eye', 's']"
                @click="toProductPage"
            />
            <button-ui 
                class="my-favorites-item-panel-btn-info rounded-0 px-2"
                :set="[0, isVisible.desc ? 'info' : 'background', '1', 'mdi-information', 's']"
                @click="infoBtnHandler"
            />
            <button-ui 
                class="my-favorites-item-panel-btn-cart rounded-0 px-2"
                :set="[0, productInBasket ? 'success' : 'background', '1', productInBasket ? 'mdi-cart-off' : 'mdi-cart', 's']"
                :disabled="product.amount.every(prod => prod.amount === 0)"
                @click="addToBasket"
            />
            <button-ui 
                class="my-favorites-item-panel-btn-remove rounded-0 px-2"
                :set="[0, 'b', '1', 'mdi-heart-off', 's']"
                @click="removeFromFavorites"
            />
        </v-sheet>
    </v-sheet>
</template>
<style>
.my-favorites-item {
    position: relative;
    display: flex;
    flex-direction: column;
}
.my-favorites-item-title {
    overflow: hidden;
    height: 64px;
    max-height: 64px;
    word-break: break-all;
    margin-bottom: -10px;
}
.my-favorites-item-img-wrapper {
    position: relative;
}
.my-favorites-item-rating {
    position: absolute;
    bottom: 5px;
    left: 0;
    width: 100%;
    background: white;
    display: flex;
    justify-content: center;
}
.my-favorites-item-img {
    height: 200px;
}
.my-favorites-item-desc {
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.my-favorites-item-panel {
    display: flex;
    justify-content: center;
}
.product-color-circle {
    position: relative;
    top: 3px;
    display: inline-block;
    width: 16px;
    height: 16px;
}
.my-favorites-item-markers {
    position: absolute;
    top: 0;
    left: 0;
}
.my-favorites-item-markers {
    display: flex;
    flex-direction: column;
}
.my-favorites-item-panel > button {
    width: calc(100% / 4) !important;
    height: 100% !important;
    transition: all 0.3s ease;
    padding: 5px;
}
.my-favorites-item-panel-btn-remove {
    border-radius: 0 40% 40% 0 !important;
}
.my-favorites-item-panel-btn-remove:hover {
    background: #B00020 !important;
    color: white !important;
}
.my-favorites-item-panel-btn-open {
    border-radius: 40% 0 0 40% !important;
}
.my-favorites-item-panel-btn-info:hover {
    background: #2196F3 !important;
    color: white !important;
}
.my-favorites-item-panel-btn-open:hover {
    background: #03DAC6 !important;
    color: white !important;
}
.my-favorites-item-panel-btn-cart:hover {
    background: black !important;
    color: white !important;
}
.my-favorites-item-desc-prop {
    padding: 0px !important;
}
.my-favorites-item-desc-prop-price {
    color: #C41E3A;
}
.my-favorites-item-img-enter-active,
.my-favorites-item-img-leave-active {
    transition: all 0.5s ease;
}

.my-favorites-item-img-enter-from {
    transform: rotateY(-90deg);
}

.my-favorites-item-img-leave-to {
    transform: rotateY(90deg);
}
.my-favorites-item-desc-enter-active,
.my-favorites-item-desc-leave-active {
    transition: all 0.4s ease;
}

.my-favorites-item-desc-enter-from {
    transform: rotateY(-90deg);
}

.my-favorites-item-desc-leave-to {
    transform: rotateY(90deg);
}
</style>
