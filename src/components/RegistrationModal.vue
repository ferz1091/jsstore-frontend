<script>
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput';
import authModalMixin from '@/mixins/authModalMixin';
    export default {
        name: 'registration-modal',
        mixins: [authModalMixin],
        data() {
            return {
                confirmPassword: '',
                phoneNumber: '',
                confirmPasswordType: 'password',
                results: {},
                dirtyInputs: {
                    passwordConfirmInputIsDirty: false
                },
                confirmPasswordRules: [
                    value => {
                        if (value) return true;
                        return 'You must confirm a password.'
                    },
                    value => {
                        if (this.comparePassword) return true;
                        if (this.passwordConfirmInputIsDirty) return 'Password mismatch.';
                        return true;
                    }
                ]
            }
        },
        components: {
            MazPhoneNumberInput
        },
        methods: {
            showConfirmPassword() {
                this.confirmPasswordType = this.confirmPasswordType === 'text' ? 'password' : 'text';
            },
            toggleConfirmPasswordInput() {
                this.dirtyInputs.passwordConfirmInputIsDirty = true;
            },
            async submitForm() {
                await this.validateForm();
                if (this.formIsValid && this.numberIsValid) {
                    this.$store.dispatch('registration', {email: this.email, password: this.password, phone: this.phoneNumber})
                }
            }
        },
        computed: {
            confirmPasswordLength() {
                return !!this.confirmPassword.length;
            },
            confirmPasswordIsVisible() {
                if (this.confirmPasswordType === 'text') {
                    return false;
                } else {
                    return true;
                }
            },
            phoneNumberLength() {
                if (this.phoneNumber) return this.phoneNumber.length;
                return 0;
            },
            passwordConfirmInputIsDirty() {
                return this.dirtyInputs.passwordConfirmInputIsDirty
            },
            comparePassword() {
                return this.password === this.confirmPassword;
            },
            numberIsValid() {
                if (!this.phoneNumber) return true;
                if (this.phoneNumber && !this.results.isValid) return false;
                return true;
            }
        }
    }
</script>

<template>
    <v-dialog
        transition="dialog-top-transition"
        width="auto"
        v-model="modalIsActive"
        @click:outside="closeModal"
    >
        <v-container class="regModal rounded-lg elevation-16">
            <v-form @submit.prevent="submitForm" ref="formRef">
                <v-text-field
                    class="email field"
                    name="Email"
                    variant="solo" 
                    label="Email"
                    v-model="email"
                    type="text"
                    ref="emailInput"
                    :rules="emailRules"
                    @blur="toggleEmailInput"
                    bg-color="background"
                >
                    <clearable-icon :isVisible="emailLength" @click.stop="clearEmailInput" />
                </v-text-field>   
                <MazPhoneNumberInput
                    class="phoneInput"
                    v-model="phoneNumber"
                    show-code-on-list
                    no-country-selector
                    default-country-code="UA"
                    @update="results = $event"
                    :success="results?.isValid && phoneNumber.length === 13"
                    :error="phoneNumberLength > 13"
                    placeholder="Phone number (0**-***-****)"
                />
                <v-text-field 
                    class="password field"
                    name="Password"
                    variant="solo" 
                    label="Password"
                    v-model="password"
                    :type="passwordType"
                    autocomplete="on"
                    :rules="passwordRules"
                    @blur="togglePasswordInput"
                    bg-color="background"
                >
                    <password-icon :isVisible="passwordLength" :isPasswordVisible="passwordIsVisible" @click="showPassword" />
                </v-text-field>
                <v-text-field 
                    class="confirm-password field pb-4"
                    name="ConfirmPassword"
                    variant="solo" 
                    label="Confirm password"
                    v-model="confirmPassword"
                    :type="confirmPasswordType"
                    autocomplete="on"
                    :rules="confirmPasswordRules"
                    @blur="toggleConfirmPasswordInput"
                    bg-color="background"
                >
                    <password-icon :isVisible="confirmPasswordLength" :isPasswordVisible="confirmPasswordIsVisible" @click.stop="showConfirmPassword" />
                </v-text-field>
                <v-btn type="submit" class="submit-btn rounded-0" color="surface">
                        Create account
                </v-btn>
            </v-form>
        </v-container>
    </v-dialog>
</template>

<style>
    .regModal {
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
    .phoneInput {
        min-height: 56px !important;
        padding: 0 10px;
        margin-bottom: 12px;
    }
    .confirm-password {
        padding-bottom: 30px !important;
    }
    .phoneInput .m-input-wrapper {
        box-shadow: 0px 3px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 0px 2px 2px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 0px 1px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
        border: none !important;
        border-radius: 4px !important;
        outline: none !important;
    }
    .submit-btn:active {
        transform: translateY(5%);
    }
</style>
