<script>
import ProductProp from '@/components/ProductItemPageComponents/ProductProp.vue';
export default {
    components: {
        ProductProp
    },
    data() {
        return {
            editSize: false,
            editAmount: false
        }
    },
    props: {
        product: {type: Object, required: true},
        deleteBtnIsVisible: {type: Boolean, required: true}
    },
    methods: {
        toggleEditSize() {
            if (this.editSize) {
                this.editSize = false;
            } else {
                this.editSize = true;
            }
        },
        toggleEditAmount() {
            if (this.editAmount) {
                this.editAmount = false;
            } else {
                this.editAmount = true;
            }
        },
        changeSize(size) {
            this.$store.commit('setProductSize', { id: this.product.item._id, size });
            this.$store.commit('setProductAmount', { id: this.product.item._id, amount: 1 });
            this.editSize = false;
        },
        decreaseAmount() {
            this.$store.commit('setProductAmount', { id: this.product.item._id, amount: this.product.amount - 1 });
        },
        increaseAmount() {
            this.$store.commit('setProductAmount', { id: this.product.item._id, amount: this.product.amount + 1 });
        },
        itemDelete() {
            this.$store.commit('removeFromBasket', this.product.item._id);
        }
    },
    computed: {
        sizeSelectItems() {
            return this.product.item.amount.map(size => {
                return size.amount ? size.size : null;
            }).filter(item => item)
        },
        userDeviceIsMobile() {
            return this.$store.state.userDeviceIsMobile;
        }
    }
}
</script>
<template>
    <v-sheet class="order-item px-4 pb-2 mb-2 rounded-lg elevation-4" color="background">
        <p class="text-button text-center text-truncate">
            {{ product.item.name }}
        </p>
        <v-sheet class="order-product-info" color="background">
            <v-img
                class="order-product-img" 
                :src="`https://jsstore-backend.vercel.app/${product.item.images.find(image => image.title).path}`" 
            />
            <div class="order-product-info-panel ml-3">
                <div class="info-panel-content">
                    <product-prop class="info-panel-content-prop text-body-2" name="Size">
                            <v-chip 
                                class="info-panel-content-chip ml-2" 
                                :density="userDeviceIsMobile ? 'comfortable' : 'compact'" 
                                variant="elevated" 
                                color="surface"
                            >
                                <custom-select
                                    class="sizeSelect" 
                                    :items="sizeSelectItems" 
                                    :currentSize="product.size"
                                    @sizeChanged="changeSize"
                                />
                                <v-icon 
                                    class="info-panel-btns-select-down-icon" 
                                    icon="mdi-chevron-down" 
                                    variant="text"
                                    density="comfortable" 
                                    size="small" 
                                />
                            </v-chip>
                    </product-prop>
                    <product-prop class="text-body-2" name="Amount">
                        <v-chip 
                            class="info-panel-content-chip ml-2" 
                            :density="userDeviceIsMobile ? 'comfortable' : 'compact'" 
                            variant="elevated" 
                            color="surface"
                        >
                            <button-ui 
                                :set="['t', 0, '1', 'mdi-minus', 's']"
                                :disabled="!(product.amount > 1)"
                                @click="decreaseAmount"
                            />
                            <span class="size-amount px-2">
                                {{ product.amount }}
                            </span>
                            <button-ui 
                                :set="['t', 0, '1', 'mdi-plus', 's']"
                                :disabled="!(product.item.amount.find(size => size.size === product.size).amount > product.amount)" 
                                @click="increaseAmount"
                            />
                        </v-chip>
                    </product-prop>
                    <div class="price-panel">
                        <product-prop class="mr-2" name="Price">
                            <span class="ml-1">
                                <span class="text-decoration-underline ml-1">
                                    {{ product.item.value + '$' }}
                                </span>
                            </span>
                        </product-prop>
                        <product-prop name="Total">
                            <span class="ml-1">
                                <span class="price-prop font-weight-bold ml-1">
                                    {{ product.item.value * product.amount + '$' }}
                                </span>
                            </span>
                        </product-prop>
                    </div>
                </div>
            </div>
        </v-sheet>
        <button-ui
            v-if="deleteBtnIsVisible"
            class="order-product-delete-btn" 
            :set="['t', 's', '2', 'mdi-close', 's']"
            @click="itemDelete"
        />
        <p class="product-error text-caption text-center" v-if="product.error">{{ product.error }}</p>
    </v-sheet>
</template>
<style>
.order-item {
    position: relative;
}
.order-product-info {
    display: flex;
}
.order-product-info-panel {
    width: calc(100% - 100px);
}
.order-product-img {
    height: 100px;
    max-width: 100px;
}
.info-panel-btns-select-down-icon {
    position: absolute !important;
    z-index: 2;
    top: 50%;
    right: 7px;
    transform: translateY(-50%);
}
.price-prop {
    color: #B00020;
}
.info-panel-content-chip {
    position: relative;
    bottom: 2px;
}
.order-product-delete-btn {
    position: absolute;
    top: 7px;
    right: 5px;
}
.price-panel {
    display: flex;
}
.product-error {
    color: #B00020;
}
@media (max-width: 330px) {
    .price-panel {
        flex-direction: column;
    }
}
</style>
