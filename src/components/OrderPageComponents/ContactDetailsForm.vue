<script>
import FieldIcon from '@/components/OrderPageComponents/FieldIcon.vue';
export default {
    components: {
        FieldIcon
    },
    data() {
        return {
            name: '',
            surname: '',
            phone: '',
            email: '',
        }
    },
    mounted() {
        if (this.user.name) {
            this.name = this.user.name;
        }
        if (this.user.surname) {
            this.surname = this.user.surname;
        }
        if (this.user.phone) {
            this.phone = this.user.phone;
        }
        if (this.user.email) {
            this.email = this.user.email;
        }
        this.contactDetailsChange();
    },
    methods: {
        contactDetailsChange() {
            this.$emit('contactDetailsChange', {name: this.name, surname: this.surname, phone: this.phone, email: this.email});
        }
    },
    watch: {
        name() {
            this.contactDetailsChange()
        },
        surname() {
            this.contactDetailsChange()
        },
        phone() {
            this.contactDetailsChange()
        },
        email() {
            this.contactDetailsChange()          
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        nameValidation() {
            const valid = !this.name ? true : this.name.length > 1 ? false : true;
            const message = !this.name ? 'Name is required' : this.name.length > 1 ? '' : 'Too short name.';
            return {valid, message};
        },
        surnameValidation() {
            const valid = !this.surname ? true : this.surname.length > 1 ? false : true;
            const message = !this.surname ? 'Surname is required' : this.surname.length > 1 ? '' : 'Too short name.';
            return {valid, message};
        },
        phoneValidation() {
            const phoneRegex = /^\+380(67|68|96|97|98|50|95|73|73|93)\d{7}$/;
            const phoneRegex2 = /^0(67|68|96|97|98|50|95|73|73|93)\d{7}$/;
            const valid = !phoneRegex.test(this.phone) && !phoneRegex2.test(this.phone);
            const message = valid ? 'Format: 0##-###-##-##' : '';
            return {valid, message};
        },
        emailValidation() {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const valid = !this.email ? true : !emailRegex.test(this.email);
            const message = !this.email ? 'Email is required' : !emailRegex.test(this.email) ? 'Invalid email' : '';
            return {valid, message};
        }
    }
}
</script>
<template>
    <v-sheet class="order-page-form" color="background">
        <v-sheet class="order-page-contact-details-wrapper" color="background">
            <v-text-field
                v-model="name"
                :class="nameValidation.valid ? 'order-page-field' : 'order-page-field-valid'"
                type="text"
                ref="nameInput"
                variant="solo"
                label="Name"
                density="compact"
                bg-color="transparent"
                clearable
                :error="nameValidation.valid"
                :error-messages="nameValidation.message"
            >
                <FieldIcon :isVisible="!nameValidation.valid" />
            </v-text-field>
            <v-text-field 
                v-model="surname"
                :class="surnameValidation.valid ? 'order-page-field' : 'order-page-field-valid'"
                type="text"
                ref="surnameInput"
                variant="solo"
                label="Surname"
                density="compact"
                bg-color="transparent"
                clearable
                :error="surnameValidation.valid"
                :error-messages="surnameValidation.message"
            >
                <FieldIcon :isVisible="!surnameValidation.valid" />
            </v-text-field>
            <v-text-field 
                v-model="phone"
                :class="phoneValidation.valid ? 'order-page-field' : 'order-page-field-valid'"
                type="number"
                ref="phoneInput"
                variant="solo"
                label="Phone"
                density="compact"
                bg-color="transparent"
                clearable
                :error="phoneValidation.valid"
                :error-messages="phoneValidation.message"
            >
                <FieldIcon :isVisible="!phoneValidation.valid" />
            </v-text-field>
            <v-text-field 
                v-model="email"
                :class="emailValidation.valid ? 'order-page-field' : 'order-page-field-valid'"
                type="email"
                ref="emailInput"
                variant="solo"
                label="Email"
                density="compact"
                bg-color="transparent"
                clearable
                :error="emailValidation.valid"
                :error-messages="emailValidation.message"
            >
                <FieldIcon :isVisible="!emailValidation.valid" />
            </v-text-field>
        </v-sheet>
        <p class="text-center text-decoration-underline text-body-2">
            Enter accurate contact details to place an order
        </p>
    </v-sheet>
</template>
<style>
.order-page-contact-details-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 5px;
    width: 100%;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
@media (max-width: 750px) {
    .order-page-contact-details-wrapper {
        grid-template-columns: 1fr;
    }
}
</style>
