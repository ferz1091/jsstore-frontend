<script>
import authModalMixin from '@/mixins/authModalMixin';
    export default {
        name: 'login-modal',
        mixins: [authModalMixin],
        data() {
            return {
                isRemember: false
            }
        },
        methods: {
            openRegModal() {
                this.closeModal();
                this.$store.commit('toggleRegModal', true);
            },
            async submitForm() {
                await this.validateForm();
                if (this.formIsValid) {
                    this.$store.dispatch('loginUser', {email: this.email, password: this.password, isRemember: this.isRemember})
                }
            }
        }
    }
</script>

<template>
    <v-dialog
            transition="dialog-bottom-transition"
            width="auto"
            absolute
            v-model="modalIsActive"
            @click:outside="closeModal"
    >
    <v-container class="loginModal rounded-lg elevation-16">
        <v-form @submit.prevent="submitForm" ref="formRef">
            <v-text-field 
                class="email field" 
                variant="solo"
                name="Email"
                label="Email"
                v-model="email"
                type="text"
                ref="emailInput"
                :rules="emailRules"
                @blur="toggleEmailInput"
            >
                <clearable-icon :isVisible="emailLength" @click.stop="clearEmailInput" />
            </v-text-field>   
            <v-text-field 
                class="password field" 
                variant="solo" 
                name="Password"
                label="Password"
                v-model="password"
                :type="passwordType"
                :rules="passwordRules"
                autocomplete="on"
                @blur="togglePasswordInput"
            >
                <password-icon :isVisible="passwordLength" :isPasswordVisible="passwordIsVisible" @click="showPassword" />
            </v-text-field>
            <v-switch
                class="switch pl-5"
                label="Remember me"
                color="success"
                v-model="isRemember"
                inset
            ></v-switch>
            <v-btn class="reg-btn rounded-0" @click="openRegModal">
                    Create account
            </v-btn>
            <v-btn 
                class="submit-btn rounded-0"
                variant="flat" 
                color="background"
                type="submit"
            >
                Login
            </v-btn>
        </v-form>
        </v-container>
    </v-dialog>
</template>

<style scoped>
    .loginModal {
        padding: 0 !important;
        background-color: rgb(220, 220, 220);
        overflow: hidden;
    }
    form {
        display: flex;
        flex-direction: column;
    }
    .field {
        padding: 0 20px;
        min-width: 300px;
    }
    .email {
        padding-top: 50px;
    }
    .submit-btn:active, .reg-btn:active {
        transform: translateY(5%);
    }
    .v-switch__track {
        max-height: 20px;
        max-width: 40px;
    }
    .v-switch__thumb {
        max-height: 14px;
        max-width: 14px;
    }
</style>
