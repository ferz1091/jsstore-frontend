<script>
import OrderItem from '@/components/AccountOrdersPageComponents/OrderItem.vue';
export default {
    components: {
        OrderItem
    },
    data() {
        return {
            ordersFetched: false
        }
    },
    mounted() {
        if (!this.isAuth) {
            this.$router.push('/shop/entry/men');
        }
        if (this.$store.state.user.id) {
            this.getUserOrders();
        }
    },
    unmounted() {
        this.$store.commit('clearOrders');
    },
    methods: {
        async getUserOrders() {
            const fetched = await this.$store.dispatch('getUserOrders', { userId: this.$store.state.user.id });
            if (fetched) {
                this.ordersFetched = true;
            }
        },
        toShopping() {
            this.$router.push('/shop/entry/men');
        }
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
        orders() {
            const orders = this.$store.state.userOrders;
            return orders && orders.length ? orders.sort((orderA, orderB) => {
                if (new Date(orderA.order_date) < new Date(orderB.order_date)) {
                    return 1;
                } else {
                    return -1;
                }
            }) : [];
        }
    }
}
</script>
<template>
    <main class="my-orders page">
        <Transition name="my-orders-wrapper">
            <v-container v-if="orders.length" class="my-orders-wrapper rounded-lg elevation-14" fluid>
                <p class="my-orders-title text-button text-center mb-4">
                    My orders
                </p>
                <v-sheet class="my-orders-items" color="background">
                    <OrderItem v-for="order in orders" :order="order" />
                </v-sheet>
            </v-container>
        </Transition>
        <Transition name="my-orders-warning">
            <p class="my-orders-empty-warning text-center text-button" v-if="!orders.length && ordersFetched">
                Your order history is empty
                <br/>
                <button-ui :set="[0, 0, '1', 0, 0, 'to shopping']" @click="toShopping"/>
            </p>
        </Transition>
    </main>
</template>
<style>
.my-orders {
    position: relative;
}
.my-orders-wrapper {
    max-width: 900px;
    min-height: calc(100% - 32px);
    margin: 16px auto;
}
.my-orders-title {
    font-size: 18px !important;
}
.my-orders-empty-warning {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
}
.my-orders-wrapper-enter-active,
.my-orders-warning-enter-active {
    transition: all 0.75s ease;
}
.my-orders-wrapper-enter-from,
.my-orders-warning-enter-from {
    opacity: 0;
    transform: translateY(100%);
}
@media (max-width: 900px) {
    .my-orders-wrapper {
        margin: 0 auto;
        min-height: 100%;
    }
}
</style>
