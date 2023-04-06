<script>
export default {
    props: {
        product: { type: Object, required: true }
    },
    data() {
        return {
            size: this.product.size,
            amount: this.product.amount
        }
    },
    methods: {
        setProductSize() {
            this.$store.commit('setProductSize', { id: this.product.item._id, size: this.size });
        },
        itemDelete() {
            this.$store.commit('removeFromBasket', this.product.item._id);
        },
        increaseAmount() {
            if (this.product.item.amount.find(size => size.size === this.size).amount > this.amount) {
                this.amount += 1;
                this.cachedAmount = this.amount;
            }
        },
        decreaseAmount() {
            if (this.amount > 0) {
                this.amount -= 1;
                this.cachedAmount = this.amount;
            }
        },
        changeSize(value) {
            this.size = value;
        }
    },
    watch: {
        size() {
            this.$store.commit('setProductSize', { id: this.product.item._id, size: this.size });
            this.amount = 0;
        },
        amount(newValue) {
            this.$store.commit('setProductAmount', { id: this.product.item._id, amount: newValue });
        }
    },
    computed: {
        sizeSelectItems() {
            return this.product.item.amount.map(size => {
                return size.amount ? size.size : null;
            }).filter(item => item)
        }
    }
}
</script>
<template>
    <v-item>
        <v-sheet class="basket-item px-2 py-4" color="background">
            <p class="basket-item-title text-button mr-4 pb-4">
                {{ product.item.name }}
            </p>
            <v-sheet class="basket-item-body mr-4" color="background">
                <v-img class="basket-product-img"
                    :src="`http://localhost:5000/${product.item.images.find(image => image.title).path}`" />
                <div class="basket-item-info ml-1">
                    <div class="basket-item-props">
                        <v-chip 
                            class="basket-item-size-chip px-2" 
                            density="comfortable" 
                            variant="elevated" 
                            color="surface"
                        >
                            <span class="mr-5">
                                Size:
                            </span>
                            <custom-select 
                                class="sizeSelect" 
                                :items="sizeSelectItems" 
                                @sizeChanged="changeSize" 
                                :currentSize="product.size" 
                            />
                            <v-icon 
                                class="basket-item-select-down-icon" 
                                icon="mdi-chevron-down" 
                                variant="text"
                                density="comfortable" 
                                size="small" 
                            />
                        </v-chip>
                        <Transition name="amount-chip">
                            <v-chip 
                                class="basket-item-amount-chip my-1 px-2" 
                                v-if="product.size" 
                                density="comfortable"
                                variant="elevated" 
                                color="surface"
                            >
                                Amount:
                                <v-btn 
                                    icon="mdi-minus" 
                                    density="comfortable" 
                                    size="small" 
                                    variant="text"
                                    @click="decreaseAmount" 
                                    :disabled="!(this.amount > 0)" 
                                />
                                <span class="size-amount px-2">
                                    {{ this.amount }}
                                </span>
                                <v-btn 
                                    icon="mdi-plus" 
                                    density="comfortable" 
                                    size="small" 
                                    variant="text" 
                                    @click="increaseAmount"
                                    :disabled="!(this.product.item.amount.find(size => size.size === this.size).amount > this.amount)" 
                                />
                            </v-chip>
                        </Transition>
                    </div>
                    <div class="basket-item-price-panel">
                        <span class="basket-item-price-average text-h6 font-weight-bold">
                            {{ product.item.value * this.amount }}$
                        </span>
                        <span class="basket-item-petItem-price text-caption">
                            per item:
                            <span class="font-weight-bold text-decoration-underline">
                                {{ product.item.value }}$
                            </span>
                        </span>
                    </div>
                </div>
                <v-btn 
                    @click="itemDelete" 
                    class="basket-item-delete-btn" 
                    icon="mdi-close" 
                    variant="text" 
                    size="small"
                    density="comfortable" 
                />
            </v-sheet>
        </v-sheet>
        <v-divider />
    </v-item>
</template>
<style>
@keyframes itemLeave {
    0% {
        transform: translateX(0px);
    }

    100% {
        transform: translateX(100%);
    }
}

.basket-item-info {
    position: relative;
    max-width: 70%;
}

.basket-item-delete-btn {
    position: absolute !important;
    top: 4px;
    right: 0px;
}

.basket-item {
    position: relative;
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    min-height: 168px !important;
}

.basket-item-body {
    display: flex !important;
    justify-content: center;
}

.basket-item-title {
    line-height: 20px !important;
    text-align: center;
}

.basket-product-img {
    max-width: 30% !important;
    height: 100px !important;
}

.size-amount {
    text-align: center;
    font-size: 16px;
    min-width: 36px;
}

.basket-item-size-chip {
    position: relative;
}

.basket-item-select-down-icon {
    position: absolute !important;
    z-index: 2;
    top: 50%;
    right: 7px;
    transform: translateY(-50%);
}

.basket-item-price-panel {
    position: absolute !important;
    bottom: 0;
    left: 0;
}

.basket-item-props {
    width: 150px !important;
}

.basket-item-price-average {
    color: #C41E3A;
}
.sizeSelect {
    cursor: pointer;
    position: relative;
    z-index: 3;
    width: 40px;
}
.sizeSelect:focus {
    outline: none;
}
.amount-chip-enter-active,
.amount-chip-leave-active {
    transition: all 0.5s ease;
}

.amount-chip-enter-from,
.amount-chip-leave-to {
    transform: translateX(200%);
}
</style>
