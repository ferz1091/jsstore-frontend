<script>
import OrderProductItem from './OrderProductItem.vue';
import ProductProp from '@/components/ProductItemPageComponents/ProductProp.vue';
export default {
    components: {
        OrderProductItem,
        ProductProp
    },
    props: {
        order: {type: Object, required: true}
    },
    data() {
        return {
            isOpen: false
        }
    },
    methods: {
        async toggleIsOpen() {
            if (this.order.products.some(product => !product.item.name)) {
                const res = await this.$store.dispatch('getOrderProducts', {orderId: this.order._id});
                if (res) {
                    this.isOpen = !this.isOpen;
                }
            } else {
                this.isOpen = !this.isOpen;
            }
        },
        cancelOrder() {
            this.$store.dispatch('cancelOrder', {id: this.order._id});
        }
    },
    computed: {
        orderStatus() {
            if (this.order.canceled) return 'Canceled';
            if (this.order.done) return 'Completed';
            if (this.order.sent) return 'Sent';
            return 'Processed';
        },
        orderStatusColor() {
            if (this.order.canceled) return '#B00020';
            if (this.order.done) return '#4CAF50';
            if (this.order.sent) return '#2196F3';
            return 'black';
        },
        orderIcon() {
            if (this.order.canceled) return 'mdi-archive-cancel-outline';
            if (this.order.done) return 'mdi-archive-check-outline';
            if (this.order.sent) return 'mdi-archive-clock-outline';
            return 'mdi-archive-sync-outline';
        },
        orderChevronIcon() {
            return this.isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down';
        }
    }
}
</script>
<template>
    <v-sheet class="my-orders-item rounded-lg elevation-2 pa-2 my-4" color="background">
        <v-sheet 
            class="order-title pr-5" 
            color="background" 
            @click.stop="toggleIsOpen"
        >
            <v-chip 
                class="order-date" 
                density="comfortable" 
                color="surface" 
                variant="elevated" 
                draggable
            >
                {{ new Date(order.order_date).toLocaleDateString() }}
            </v-chip>
            <span class="order-status text-caption mx-2" v-bind:style="{color: orderStatusColor}">
                {{ orderStatus }}
                <v-icon 
                    class="status-icon" 
                    :icon="orderIcon" 
                    size="large"
                />
            </span>
            <span class="order-value font-weight-bold mx-2">
                {{ order.value + '$' }}
            </span>
            <button-ui class="order-chevron" :set="['t', 's', '2', orderChevronIcon, 0, 0]" />
        </v-sheet>
        <v-expand-transition>
            <v-sheet 
                v-if="isOpen" 
                class="order-desc mt-2" 
                color="background"
            >
                <v-chip 
                    class="order-number mb-2" 
                    variant="outlined" 
                    color="surface" 
                    density="comfortable"
                >
                    {{ '№' + order._id }}
                </v-chip>
                <OrderProductItem v-for="product in order.products" :product="product" />
                <v-sheet class="px-2" color="background">
                    <product-prop name="Paid">
                        <v-icon
                            class="paid-icon ml-2"
                            :icon="order.paid ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'" 
                            :color="order.paid ? 'success' : 'error'"
                        />
                    </product-prop>
                    <product-prop name="Payment method">
                        <span class="text-body-2 ml-2">
                            {{ order.paymentMethod === 'receipt' ? ' upon receipt.' : ' card.' }}
                        </span>
                    </product-prop>
                    <product-prop name="Order time">
                        <v-chip 
                            class="text-body-2 ml-2" 
                            variant="elevated" 
                            color="surface" 
                            density="comfortable"
                        >
                            {{ new Date(order.order_date).toLocaleTimeString().slice(0, -3) }}
                        </v-chip>
                    </product-prop>
                    <product-prop v-if="order.sent_date" name="Shipping date">
                        <v-chip 
                            class="text-body-2 ml-2" 
                            variant="elevated" 
                            color="info" 
                            density="comfortable"
                        >
                            {{ new Date(order.sent_date).toLocaleDateString() + ', ' + new Date(order.sent_date).toLocaleTimeString() }}
                        </v-chip>
                    </product-prop>
                    <product-prop v-if="order.status_date" name="Latest update">
                        <v-chip 
                            class="text-body-2 ml-2" 
                            variant="elevated" 
                            :color="order.done ? 'success' : 'surface'" 
                            density="comfortable"
                        >
                            {{ new Date(order.status_date).toLocaleDateString() + ', ' + new Date(order.status_date).toLocaleTimeString() }}
                        </v-chip>
                    </product-prop>
                    <product-prop name="Delivery method">
                        <span class="text-body-2 ml-2">
                            {{ order.deliveryMethod === 'post' ? 'post office.' : order.deliveryMethod === 'courier' ? 'courier.' : 'from store.' }}
                        </span>
                    </product-prop>
                </v-sheet>
                <v-sheet 
                    v-if="order.deliveryMethod !== 'store'" 
                    class="px-4 mb-2 elevation-4 rounded-lg" 
                    color="background"
                >
                    <p class="text-button text-center">
                        Delivery details
                    </p>
                    <product-prop name="City">
                        <span class="text-body-2 ml-2">
                            {{ order.deliveryDetails.city }}
                        </span>
                    </product-prop>
                    <product-prop v-if="order.deliveryDetails.postOffice" name="Post office">
                        <span class="text-body-2 ml-2">
                            {{ order.deliveryDetails.postOffice }}
                        </span>
                    </product-prop>
                    <product-prop v-if="order.deliveryDetails.street" name="Street">
                        <span class="text-body-2 ml-2">
                            {{ order.deliveryDetails.street }}
                        </span>
                    </product-prop>
                    <product-prop v-if="order.deliveryDetails.building" name="Building">
                        <span class="text-body-2 ml-2">
                            {{ order.deliveryDetails.building }}
                        </span>
                    </product-prop>
                    <product-prop v-if="order.deliveryDetails.apartment" name="Apartment">
                        <span class="text-body-2 ml-2">
                            {{ order.deliveryDetails.apartment }}
                        </span>
                    </product-prop>
                </v-sheet>
                <v-sheet class="px-4 elevation-4 rounded-lg" color="background">
                    <p class="text-button text-center">
                        Contact details
                    </p>
                    <product-prop name="Name" class="text-truncate">
                        <span class="text-body-2 ml-2">
                            {{ order.contactDetails.name }}
                        </span>
                    </product-prop>
                    <product-prop name="Surname" class="text-truncate">
                        <span class="text-body-2 ml-2">
                            {{ order.contactDetails.surname }}
                        </span>
                    </product-prop>
                    <product-prop name="Phone" class="text-truncate">
                        <span class="text-body-2 ml-2">
                            {{ order.contactDetails.phone }}
                        </span>
                    </product-prop>
                    <product-prop name="Email" class="text-truncate">
                        <span class="text-body-2 ml-2">
                            {{ order.contactDetails.email }}
                        </span>
                    </product-prop>
                </v-sheet>
                <v-sheet class="order-panel" color="background">
                    <p class="text-button text-center font-weight-bold mt-4">
                        Total price: 
                        <span class="order-value">
                            {{ order.value + '$' }}
                        </span>
                    </p>
                    <v-scale-transition>
                        <button-ui
                            v-if="!order.canceled && !order.done"
                            class="order-cancel-btn mt-1" 
                            :set="[0, 'e', '1', 0, 0, 'Cancel the order']"
                            append-icon="mdi-cancel"
                            @click="cancelOrder"
                        />
                    </v-scale-transition>
                </v-sheet>
            </v-sheet>
        </v-expand-transition>
    </v-sheet>
</template>
<style>
.my-orders-item {
    display: flex;
    flex-direction: column;
}
.my-orders-status {
    font-size: 18px !important;
}
.order-value {
    color: #B00020;
    width: 45px;
}
.order-title {
    cursor: pointer;
    position: relative;
    display: flex;
    justify-content: space-between;
}
.order-chevron {
    position: absolute;
    top: 50%;
    right: 0px;
    transform: translateY(-50%);
}
.order-cancel-btn {
    width: 100%;
}
.paid-icon {
    position: relative;
    bottom: 1px;
}
@media (max-width: 350px) {
    .order-title {
        flex-direction: column;
        padding-right: 0px !important;
        text-align: center;
    }
    .order-date {
        display: flex;
        justify-content: center;
    }
    .order-status {
        margin-top: 4px;
    }
    .order-value {
        width: 100%;
        margin: 4px 0 0 0 !important;
    }
    .order-chevron {
        top: 85%;
        transform: translateY(-50%);
    }
    .price-panel {
        flex-direction: column;
    }
    .order-number {
        display: flex;
        justify-content: center;
    }
}
</style>
