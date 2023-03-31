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
        products() {
            return this.$store.state.basket.products;
        },
        orderPrice() {
            return this.products.map(product => {
                if (product.amount) {
                    return product.item.value * product.amount;
                } else {
                    return 0;
                }
            }).reduce((acc, item) => acc + item, 0);
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
        <p class="basket-empty-title text-button" v-if="!products.length">Cart is empty</p>
        <v-item-group v-else>
            <BasketItem v-for="product in products" :product="product" :key="product.item._id" />
        </v-item-group>
    </v-sheet>
    <v-sheet class="basket-control" color="background">
        <v-divider class="border-opacity-25" />
        <p class="basket-item-price px-2" @click="test">
            <v-icon class="mr-2" icon="mdi-tag-outline" size="small"/>
            <span class="text-h5">
                {{ orderPrice }}
                <span class="text-body-1">
                    $
                </span>
            </span>
        </p>
        <v-divider class="border-opacity-25" />
        <v-btn class="rounded-0 w-100" color="background" @click="clearBasket">clear basket</v-btn>
        <v-btn class="rounded-0 w-100" color="surface">create order</v-btn>
    </v-sheet>
    </v-navigation-drawer>
</template>
<style>
.basket-drawer {
    min-width: 280px !important;
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
