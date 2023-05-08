<script>
import OrderItem from '@/components/OrderPageComponents/OrderItem.vue';
import ContactDetailsForm from '@/components/OrderPageComponents/ContactDetailsForm.vue';
import DeliveryForm from '@/components/OrderPageComponents/DeliveryForm.vue';
export default {
    components: {
        OrderItem,
        ContactDetailsForm,
        DeliveryForm
    },
    data() {
        return {
            contactDetails: {
                name: null,
                surname: null,
                phone: null,
                email: null
            },
            deliveryMethod: null,
            city: null,
            postOffice: null,
            street: null,
            building: null,
            apartment: null,
            paymentMethod: 'receipt',
            orderId: null
        }
    },
    mounted() {
        if (!this.products.length) {
            this.$router.push('/shop/entry/men');
        } else if (this.products.some(product => !product.size || !product.amount)) {
            this.$router.push('/shop/entry/men');
            this.$store.commit('toggleBasketModal', true);
        }
    },
    unmounted() {
        if (this.orderId) {
            this.$store.commit('clearBasket');
        } else {
            this.$store.commit('removeBasketErrors');
        }
    },
    methods: {
        sizeSelectItems(amount) {
            return amount.map(size => {
                return size.amount ? size.size : null;
            }).filter(item => item);
        },
        contactDetailsChange(details) {
            this.contactDetails = details;
        },
        deliveryMethodChange(method) {
            this.deliveryMethod = method;
        },
        cityChanged(city) {
            this.city = city;
        },
        postOfficeChanged(post) {
            this.postOffice = post;
        },
        streetChanged(street) {
            this.street = street;
        },
        buildingChanged(building) {
            this.building = building;
        },
        apartmentChanged(apartment) {
            this.apartment = apartment;
        },
        async createOrder() {   
            this.orderId = await this.$store.dispatch('createOrder', {
                products: this.products.map(product => {
                    return {
                        ...product,
                        item: {
                            _id: product.item._id,
                            gender: product.item.article.slice(3, 4) === '1' ? 'men' : 'women'
                        }
                    }
                }),
                contactDetails: this.contactDetails,
                deliveryMethod: this.deliveryMethod,
                deliveryDetails: this.deliveryMethod === 'store' ? null : {
                    city: this.deliveryMethod === 'store' ? null : this.city,
                    postOffice: this.deliveryMethod === 'post' ? this.postOffice : null,
                    street: this.deliveryMethod === 'courier' ? this.street : null,
                    building: this.deliveryMethod === 'courier' ? this.building : null,
                    apartment: this.deliveryMethod === 'courier' ? this.apartment : null
                },
                value: this.orderPrice,
                userId: this.userId
            });
        },
        continueShopping() {
            this.$router.push('/shop/entry/men');
        }
    },
    computed: {
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
        },
        createOrderBtnDisabled() {
            if (!this.contactDetails.name || !this.contactDetails.surname || !this.contactDetails.phone || !this.contactDetails.email || !this.deliveryMethod || this.orderPrice === 0) {
                return true;
            }
            if (this.deliveryMethod === 'store') {
                return false;
            } else if (this.deliveryMethod === 'post') {
                return !this.postOffice;
            } else if (this.deliveryMethod === 'courier') {
                return !(this.street && this.building);
            }
        },
        userId() {
            return this.$store.state.user.id;
        },
        orderItemDeleteBtnIsVisible() {
            return this.$store.state.basket.products.length > 1;
        }
    }
}
</script>
<template>
    <main class="Order page">
        <Transition name="order-page-container" appear>
            <v-container v-if="products.length && !orderId" class="order-wrapper elevation-10">
                <p class="order-page-title text-button pl-2 py-2">
                    <v-icon class="order-page-title-icon" icon="mdi-cart"/>
                    Order
                </p>
                <OrderItem v-for="product in products" :key="product.item._id" :product="product" :deleteBtnIsVisible="orderItemDeleteBtnIsVisible" />
                <v-divider class="border-opacity-50 mb-4 mt-8" />
                <p class="order-page-title text-button pl-2 py-2">
                    <v-icon class="order-page-title-icon" icon="mdi-account-box" />
                    Contact details
                </p>
                <ContactDetailsForm @contactDetailsChange="contactDetailsChange" />
                <v-divider class="border-opacity-50 my-4" />
                <p class="order-page-title text-button pl-2 py-2">
                    <v-icon class="order-page-title-icon" icon="mdi-truck-delivery" />
                    Delivery
                </p>
                <DeliveryForm 
                    @deliveryMethodChange="deliveryMethodChange" 
                    @cityChanged="cityChanged"
                    @postOfficeChanged="postOfficeChanged"
                    @streetChanged="streetChanged"
                    @buildingChanged="buildingChanged" 
                    @apartmentChanged="apartmentChanged"
                />
                <v-divider class="border-opacity-50 mb-4 mt-8" />
                <p class="order-page-title text-button pl-2 pb-2 pt-5">
                    <v-icon class="order-page-title-icon" icon="mdi-credit-card" />
                    Payment
                </p>
                <v-sheet color="background">
                    <v-checkbox 
                        v-model="paymentMethod" 
                        value="card" 
                        label="Card" 
                        hide-details 
                        disabled 
                    />
                    <v-checkbox 
                        v-model="paymentMethod" 
                        value="receipt" 
                        label="Payment upon receipt" 
                        hide-details 
                        disabled 
                    />
                </v-sheet>
                <v-divider class="border-opacity-50 my-4" />
                <p class="mt-4 text-button text-center font-weight-bold">
                    Total price: 
                    <span class="order-page-total-price">
                        {{ orderPrice + '$' }}
                    </span>
                </p>
                <button-ui 
                    class="mt-5 w-100" 
                    :set="[0, 's', 0, 0, 0, 'Confirm order']" 
                    @click="createOrder"
                    :disabled="createOrderBtnDisabled"
                />
            </v-container>
        </Transition>
        <v-container class="order-wrapper order-created" v-if="orderId">
            <v-sheet class="order-created-wrapper elevation-4 w-100 py-4 px-2 rounded-lg" color="background">
                <p class="order-created-title text-button text-center py-1">№{{ orderId }}</p>
                <p class="text-body-2 text-center py-1">Order has been successfully created <v-icon icon="mdi-check-circle-outline"/></p>
                <p class="text-body-2 text-center py-1">Order information has been sent to the specified email address</p>
                <button-ui 
                    class="order-created-btn mt-2" 
                    :set="['e', 0, 0, 0, 0, 'continue shopping']"
                    @click="continueShopping"
                />
            </v-sheet>
        </v-container>
    </main>
</template>
<style>
.order-wrapper {
    min-height: 100%;
    max-width: 900px;
}
.order-created {
    display: flex;
    justify-content: center;
    align-items: center;
}
.order-created-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.order-created-btn {
    width: 250px;
}
.order-created-title {
    font-size: 18px !important;
}
.order-page-title {
    font-size: 18px !important;
}
.order-page-title-icon {
    position: relative;
    bottom: 2px;
}
.order-page-total-price {
    color: #B00020;
    font-size: 18px;
}
.order-page-container-enter-active {
    transition: all 0.75s ease;
}
.order-page-container-enter-from {
    opacity: 0;
    transform: translateY(100%);
}
@media (max-width: 450px) {
    .order-created-btn {
        width: 100%;
    }
    .order-created-title {
        font-size: 14px !important;
    }
}
</style>
