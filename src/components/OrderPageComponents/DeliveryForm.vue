<script>
import FieldIcon from '@/components/OrderPageComponents/FieldIcon.vue';
export default {
    components: {
        FieldIcon
    },
    data() {
        return {
            city: '',
            cityRef: null,
            settleRef: null,
            citySelected: false,
            delivery: null,
            postOffice: '',
            postOfficeRef: null,
            postOfficeSelected: false,
            street: '',
            streetSelected: false,
            building: '',
            apartment: '',
            isVisible: {
                post: false,
                courier: false
            },
            checkboxesDisabled: false
        }
    },
    methods: {
        setCity(city) {
            this.citySelected = true;
            this.city = city.name;
            this.cityRef = city.ref;
            this.settleRef = city.settleRef;
            this.$store.commit('clearCities');
        },
        setPostOffice(post) {
            this.postOfficeSelected = true;
            this.postOffice = post.office;
            this.postOfficeRef = post.ref;
            this.$store.commit('clearOffices');
        },
        setStreet(street) {
            this.streetSelected = true;
            this.street = street;
            this.$store.commit('clearStreets');
        },
        onAfterLeave(delivery) {
            if (this.delivery !== 'store') {
                if (delivery === 'post') {
                    this.isVisible.post = false;
                    this.isVisible.courier = true;
                    this.checkboxesDisabled = false;
                } else if (delivery === 'courier') {
                    this.isVisible.courier = false;
                    this.isVisible.post = true;
                    this.checkboxesDisabled = false;
                }
            } else {
                this.checkboxesDisabled = false;
            }
        },
        getPostOffices() {
            if (!this.postOffice) {
                this.$store.dispatch('getPostOffices', {value: this.postOffice, ref: this.cityRef});
            }
        }
    },
    watch: {
        city(value) {
            if (value && value.length > 2 && !this.citySelected) {
                this.$store.dispatch('getCities', {value});
            } else {
                if (!value) {
                    this.citySelected = false;
                }
                this.$store.commit('clearCities');
                this.$store.commit('clearOffices');
                this.$store.commit('clearStreets');
                this.postOffice = '';
                this.postOfficeRef = null;
                this.street = '';
                this.building = '';
                this.apartment = '';
                this.streetSelected = false;
                this.postOfficeSelected= false;
                this.delivery = null;
                this.isVisible.courier = false;
                this.isVisible.post = false;
            }
        },
        delivery(value, prevValue) {
            if (prevValue && prevValue !== 'store') {
                this.checkboxesDisabled = true;
            }
            if (value && value !== 'store' && !this.isVisible.post && !this.isVisible.courier) {
                this.isVisible[value] = true;
            }
            if (value === 'store') {
                this.isVisible.courier = false;
                this.isVisible.post = false;
            }
            if (!value) {
                this.delivery = null;
                this.isVisible.courier = false;
                this.isVisible.post = false;
                if (prevValue !== 'store') {
                    this.checkboxesDisabled = true;
                }
            }
            this.$emit('deliveryMethodChange', this.delivery);
        },
        postOffice(value) {
            if (value && value.length > 1 && !this.postOfficeSelected) {
                this.$store.dispatch('getPostOffices', {value: this.postOffice, ref: this.cityRef});
            }
            if (!value) {
                this.postOfficeSelected = false;
                this.$store.commit('clearOffices');
                this.$store.dispatch('getPostOffices', {value: this.postOffice, ref: this.cityRef});
            }
        },
        street(value) {
            if (value && value.length > 1 && !this.streetSelected) {
                this.$store.dispatch('getStreet', {value: this.street, ref: this.settleRef});
            } else {
                if (!value) {
                    this.streetSelected = false;
                }
                this.$store.commit('clearStreets');
            }
        },
        building(value) {
            this.$emit('buildingChanged', this.building);
        },
        apartment(value) {
            this.$emit('apartmentChanged', this.apartment);
        },
        citySelected() {
            this.$emit('cityChanged', this.city);
        },
        postOfficeSelected() {
            this.$emit('postOfficeChanged', this.postOffice);
        },
        streetSelected() {
            this.$emit('streetChanged', this.street);
        }
    },
    computed: {
        cities() {
            return this.$store.state.order.cities;
        },
        offices() {
            return this.$store.state.order.offices;
        },
        streets() {
            return this.$store.state.order.streets;
        },
        postValidation() {
            return this.delivery === 'post' ? !this.postOffice || !this.postOfficeSelected ? true : false : false;
        },
        streetValidation() {
            return this.streetSelected ? false : true;
        },
        buildingValidation() {
            return this.building ? false : true;
        }
    }
}
</script>
<template>
    <v-sheet class="order-page-delivery" color="background">
        <v-text-field
            :class="citySelected ? 'order-page-field-valid' : 'order-page-field'"
            v-model="city"
            variant="solo" 
            label="Delivery city" 
            bg-color="background" 
            density="compact"
            clearable
            :error="!citySelected && delivery !== 'store'"
        >
            <FieldIcon :isVisible="citySelected" />
        </v-text-field>
        <v-sheet class="order-page-delivery-variants elevation-4" color="background">
            <p 
                v-for="city in cities"
                class="order-page-delivery-variant text-caption text-no-wrap text-truncate text-left py-2"
                :key="city.Present"
                @click="setCity({name:city.Present, ref: city.DeliveryCity, settleRef: city.Ref})"
            >
                <span class="ml-4">
                    {{ city.Present }}
                </span>
            </p>
        </v-sheet>
        <v-checkbox 
            :disabled="checkboxesDisabled || !city || delivery === 'post'" 
            v-model="delivery" 
            value="post" 
            label="Pickup from Nova Poshta" 
            density="comfortable" 
            hide-details 
        />
        <v-checkbox 
            :disabled="checkboxesDisabled || !city || delivery === 'courier'" 
            v-model="delivery" 
            value="courier" 
            label="Courier delivery" 
            density="comfortable" 
            hide-details 
        />
        <v-checkbox 
            :disabled="checkboxesDisabled || delivery === 'store'" 
            v-model="delivery" 
            value="store" 
            label="Pickup from store" 
            density="comfortable" 
            hide-details 
        />
        <Transition name="order-page-delivery-form" @after-leave="() => onAfterLeave('post')">
            <v-sheet 
                v-if="delivery === 'post' && isVisible.post" 
                class="order-page-delivery-post elevation-4 pa-3 rounded-lg" 
                color="background" 
                key="post"
                v-bind:style="{maxHeight: postOfficeSelected ? '244px' : '432px'}"
            >
                <v-img class="post-logo" :src="`http://localhost:5000/assets/280373e7b35b36c247831c2f4b051cd7`" />
                <p class="text-button text-center text-no-wrap text-truncate">
                    Enter post office number or address
                </p>
                <v-text-field
                    v-model="postOffice"
                    :class="postOfficeSelected ? 'order-page-post-field-valid' : 'order-page-post-field'"
                    label="Post office number or address" 
                    variant="solo" 
                    density="compact" 
                    bg-color="background"
                    clearable
                    @focus="getPostOffices"
                    :error="postValidation"
                >
                    <FieldIcon :isVisible="postOfficeSelected" :name="'order-page-post-field-icon'" />
                </v-text-field>
                <Transition name="order-page-delivery-post-wrapper">
                    <v-sheet v-if="!postOfficeSelected" color="background">
                        <p class="text-button text-center mb-2">
                            Post offices
                        </p>
                        <v-sheet
                            class="order-page-delivery-post-wrapper elevation-4 rounded-lg" 
                            color="background"
                        >
                            <p 
                                v-for="office in offices" 
                                class="order-page-delivery-post-office text-caption text-no-wrap text-truncate text-left py-2"
                                :key="office.Description"
                                @click="setPostOffice({office: office.Description, ref: office.Ref})"
                            >
                                <span class="ml-4">
                                    {{ office.Description }}
                                </span>
                            </p>
                            <p class="post-wrapper-warning text-caption" v-if="!offices.length">
                                Available post offices not found
                            </p>
                        </v-sheet>
                    </v-sheet>
                </Transition>
            </v-sheet>
        </Transition>
        <Transition name="order-page-delivery-form" @after-leave="() => onAfterLeave('courier')">
            <v-sheet 
                v-if="delivery === 'courier' && isVisible.courier" 
                class="order-page-delivery-courier elevation-4 pa-3 rounded-lg" 
                color="background" 
                key="courier"
            >
                <p class="order-page-delivery-courier-title mb-2 text-button text-center">
                    Courier delivery
                </p>
                <v-text-field
                    :class="streetValidation ? 'order-page-field' : 'order-page-field-valid'"
                    v-model="street"
                    label="Street"
                    variant="solo" 
                    density="compact"
                    bg-color="background" 
                    clearable
                    :error="streetValidation"
                >
                    <FieldIcon :isVisible="!streetValidation" />
                </v-text-field>
                <v-sheet class="order-page-delivery-courier-variants elevation-4 mx-3" color="background">
                    <p 
                        v-for="street in streets" 
                        class="order-page-delivery-courier-variant text-caption text-no-wrap text-truncate text-left py-2"
                        @click="setStreet(street.Present)"
                    >
                        <span class="ml-4">
                            {{ street.Present }}
                        </span>
                    </p>
                </v-sheet>
                <div class="building-params">
                    <v-text-field 
                        v-model="building"
                        :class="buildingValidation ? 'order-page-building-field' : 'order-page-building-field-valid'"
                        label="Building"
                        variant="solo" 
                        density="compact"
                        bg-color="background" 
                        clearable
                        :error="buildingValidation"
                    >
                        <FieldIcon :isVisible="!buildingValidation" />
                    </v-text-field>
                    <v-text-field
                        v-model="apartment"
                        :class="apartment ? 'order-page-apartment-field-valid' : 'order-page-apartment-field'"
                        label="Apartment/Office"
                        variant="solo" 
                        density="compact"
                        bg-color="background" 
                        clearable 
                    >
                        <FieldIcon :isVisible="!!apartment" />
                    </v-text-field>
                </div>
            </v-sheet>
        </Transition>
    </v-sheet>
</template>
<style>
.order-page-delivery {
    position: relative;
}
.order-page-delivery-variants {
    position: absolute;
    top: 42px;
    left: 0;
    width: 100%;
    z-index: 2;
}
.post-logo {
    height: 120px;
}
.order-page-delivery-variant, 
.order-page-delivery-post-office,
.order-page-delivery-courier-variant {
    cursor: pointer;
    background: white;
}
.order-page-delivery-variant:hover, 
.order-page-delivery-post-office:hover,
.order-page-delivery-courier-variant:hover {
    background: rgba(200, 200, 200, 1);
}
.order-page-delivery-post {
    transition: max-height 0.5s linear;
}
.order-page-delivery-post-wrapper {
    position: relative;
    min-width: 100%;
    height: 144px;
    overflow: auto;
}
.post-wrapper-warning {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.order-page-delivery-courier {
    position: relative;
}
.order-page-delivery-courier-title {
    font-size: 16px !important;
}
.building-params {
    position: relative;
    display: flex;
    justify-content: space-between;
}
.order-page-delivery-courier-variants {
    position: absolute;
    top: 98px;
    left: 0;
    width: calc(100% - 24px);
    z-index: 2;
}
.order-page-field, 
.order-page-field-valid,
.order-page-building-field, 
.order-page-building-field-valid {
    position: relative;
    transition: max-width 0.2s linear;
}
.order-page-post-field-valid, .order-page-post-field {
    position: relative;
    transition: max-width 0.2s linear;
    transition-delay: 0.8s !important;
}
.order-page-post-field {
    max-width: 100%;;
}
.order-page-post-field-valid {
    max-width: calc(100% - 35px);
}
.order-page-building-field {
    max-width: 50%;
}
.order-page-building-field-valid {
    max-width: calc(50% - 35px);
}
.order-page-apartment-field, .order-page-apartment-field-valid {
    position: absolute;
    top: 0;
    left: calc(50% + 4px);
    transition: max-width 0.2s linear;
    width: 100%;
}
.order-page-apartment-field {
    max-width: calc(50% - 8px);
}
.order-page-apartment-field-valid {
    max-width: calc(50% - 35px);
}
.order-page-field {
    max-width: 100%;
}
.order-page-field-valid {
    max-width: calc(100% - 30px);
}
/* .field-icon {
    position: absolute;
    left: calc(100% + 50px);
    top: 50%;
    transform: translate(0, -50%);
}
.order-page-post-field-icon-enter-active {
    transition: all 0.5s ease;
    transition-delay: 1s !important;
}
.order-page-field-icon-enter-active {
    transition: all 0.5s ease;
    transition-delay: 0.2s !important;
}
.order-page-field-icon-leave-active,
.order-page-post-field-icon-leave-active {
    transition: all 0.1s ease;
}
.order-page-field-icon-enter-from,
.order-page-post-field-icon-enter-from {
    scale: 0;
}
.order-page-field-icon-leave-to,
.order-page-post-field-icon-leave-to {
    scale: 0;
    opacity: 0;
} */
.order-page-delivery-post-wrapper-enter-active {
    transition: all 0.6s linear;
}
.order-page-delivery-post-wrapper-leave-active {
    transition: all 0.3s linear;
}
.order-page-delivery-post-wrapper-enter-from,
.order-page-delivery-post-wrapper-leave-to {
    scale: 0;
    opacity: 0;
}
.order-page-delivery-form-enter-active,
.order-page-delivery-form-leave-active {
    transition: all 0.5s ease;
}

.order-page-delivery-form-enter-from {
    transform: translateX(-200%);
}
.order-page-delivery-form-leave-to {
    transform: translateX(200%);
}
</style>
