<script>
import BasketItem from './BasketItem.vue';
export default {
    name: 'basket-modal',
    components: {
        BasketItem
    },
    props: {
        isActive: {type: Boolean, required: true}
    },
    methods: {
        clearBasket() {
            this.$store.commit('clearBasket');
        },
        toOrderPage() {
            if (this.isAuth) {
                this.$router.push('/order');
            } else {
                this.$store.commit('toggleBasketModal', false);
                this.$store.commit('toggleAuthModal', true);
            }
        }
    },
    computed: {
        isAuth() {
            return this.$store.getters.isAuth;
        },
        modalIsActive: {
            get() {
                return this.isActive;
            },
            set() {
                this.$emit('closeModal');
            },
        },
        products() {
            return this.$store.getters.basket;
        },
        orderPrice() {
            return this.$store.getters.basketPrice;
        },
        createOrderBtnDisabled() {
            if (this.products.length) {
                if (this.products.some(product => !product.size) || this.products.some(product => !product.amount)) {
                    return true;
                }
                return false;
            }
            return true;
        }
    }
}
</script>
<template>
    <v-navigation-drawer
        class="basket-drawer"
        v-model="modalIsActive"
        location="right"
        color="background"
        temporary
    >
        <v-sheet class="basket-body" color="background">
            <p class="basket-empty-title text-button" v-if="!products.length">
                Cart is empty
            </p>
            <v-item-group>
                <BasketItem 
                    v-for="product in products" 
                    :key="product.item._id" 
                    :product="product"
                />
            </v-item-group>
        </v-sheet>
        <v-sheet class="basket-control" color="background">
            <v-divider class="border-opacity-25" />
            <p class="basket-item-price px-2" @click="test">
                <v-icon 
                    class="mr-2" 
                    icon="mdi-tag-outline" 
                    size="small" 
                />
                <span class="text-h5">
                    {{ orderPrice }}
                    <span class="text-body-1">
                        $
                    </span>
                </span>
            </p>
            <v-divider class="border-opacity-25" />
            <button-ui 
                class="rounded-0 w-100"
                :set="[0, 'b', 0, 0, 0, 'clear basket']"
                @click="clearBasket"
            />
            <button-ui 
                class="rounded-0 w-100"
                :set="[0, 's', 0, 0, 0, 'create order']"
                :disabled="createOrderBtnDisabled"
                @click="toOrderPage"
            />
        </v-sheet>
    </v-navigation-drawer>
</template>
<style>
.basket-drawer {
    margin-top: calc(64px + 30 * (100vw / 1400));
    min-width: 280px !important;
    max-height: calc(100% - calc(64px + 30 * (100vw / 1400))) !important;
}
.basket-drawer .v-navigation-drawer__content {
    overflow: hidden;
}
.basket-body {
    height: calc(100% - 106px);
    overflow-y: auto;
    overflow-x: hidden;
}
.basket-control {
    height: 106px !important;
}
.basket-item-price {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}
.basket-item-price span {
    color: #C41E3A;
}
.basket-empty-title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
