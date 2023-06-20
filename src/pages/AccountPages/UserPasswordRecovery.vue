<script>
export default {
    data() {
        return {
            email: '',
            code: '',
            confirmationCodeSent: false,
            codeIsConfirmed: false,
            recoveryFormIsUnmounted: false,
            password: '',
            confirmPassword: '',
            formIsValid: false,
            passwordType: 'password',
            confirmPasswordType: 'password',
            rules: {
                password: [
                    value => {
                        if (value) return true;
                        return 'You must enter a password.'
                    },
                    value => {
                        if (!value.includes(' ')) return true;
                        return 'Password must not contain spaces.'
                    },
                    value => {
                        if (value.length > 6) return true;
                        return 'Password must be longer than 6.'
                    },
                    value => {
                        if (value.length < 20) return true;
                        return 'Password must be less than 20.'
                    }
                ],
                confirmPassword: [
                     value => {
                        if (value) return true;
                        return 'You must confirm a password.'
                    },
                    value => {
                        if (this.comparePassword) return true;
                        return 'Password mismatch.';
                    }
                ]
            }
        }
    },
    mounted() {
        if (this.isAuth) {
            this.$router.push('/shop/entry/men');
        }
    },
    methods: {
        async sendCodeToEmail() {
            const result = await this.$store.dispatch('getRecoveryCode', this.email);
            if (result) {
                this.confirmationCodeSent = true;
            }
        },
        async submitCode() {
            const result = await this.$store.dispatch('validateRecoveryCode', {email: this.email, code: this.code});
            if (result) {
                this.codeIsConfirmed = true;
            }
        },
        recoveryFormUnmount() {
            this.recoveryFormIsUnmounted = true;
        },
        async validateForm() {
                const { valid } = await this.$refs.formRecoveryChange.validate();
                this.formIsValid = valid;
        },
        async submitForm() {
            await this.validateForm();
            if (this.formIsValid) {
                const result = await this.$store.dispatch('changePasswordByCode', { email: this.email, code: this.code, password: this.password });
                if (result) {
                    this.$router.push('/shop/entry/men');
                    this.$store.commit('toggleAuthModal', true);
                }
            }
        },
        showPassword() {
            this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
        },
        showConfirmPassword() {
            this.confirmPasswordType = this.confirmPasswordType === 'text' ? 'password' : 'text';
        }
    },
    watch: {
        isAuth() {
            if (this.isAuth) {
                this.$router.push('/');
            }
        }
    },
    computed: {
        isAuth() {
            return this.$store.state.isAuth;
        },
        emailIsValidate() {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(this.email);
        },
        comparePassword() {
            return this.password === this.confirmPassword;
        },
        passwordIsVisible() {
            if (this.passwordType === 'text') {
                return false;
            } else {
                return true;
            }
        },
        confirmPasswordIsVisible() {
             if (this.confirmPasswordType === 'text') {
                return false;
            } else {
                return true;
            }
        }
    }
}
</script>
<template>
    <main class="password-recovery page">
        <Transition name="password-recovery-wrapper" appear>
            <v-container class="password-recovery-wrapper h-100" v-if="!isAuth">
                <Transition name="recovery-form" @after-leave="recoveryFormUnmount">
                    <v-sheet
                        v-if="!codeIsConfirmed"
                        class="recovery-form pa-4 elevation-2 rounded-lg" 
                        color="background"
                        v-bind:style="{minHeight: confirmationCodeSent ? '248px' : '124px'}"
                    >
                        <v-sheet class="recovery-form-email" color="background">
                            <v-text-field
                                v-model="email"
                                class="mb-2"
                                variant="solo" 
                                label="Enter your email" 
                                density="comfortable"
                                bg-color="background"
                                :disabled="confirmationCodeSent"
                                hide-details
                            />
                            <button-ui 
                                :set="[0, 0, 0, 0, 0, 'Send confirmation code']" 
                                :disabled="!emailIsValidate || confirmationCodeSent"
                                @click="sendCodeToEmail"
                            />
                        </v-sheet>
                        <Transition name="recovery-form-code">
                            <v-sheet v-if="confirmationCodeSent" class="recovery-form-code" color=background>
                                <v-text-field
                                    v-model="code"
                                    class="mb-2"
                                    variant="solo" 
                                    label="Enter your code" 
                                    density="comfortable"
                                    bg-color="background"
                                    type="number"
                                    hide-details
                                />
                                <button-ui 
                                    class="w-100"
                                    :set="[0, 0, 0, 0, 0, 'Submit code']"
                                    :disabled="!code"
                                    @click="submitCode"
                                />
                            </v-sheet>
                        </Transition>
                    </v-sheet>
                </Transition>
                <Transition name="recovery-changePassword">
                    <v-sheet 
                        v-if="codeIsConfirmed && recoveryFormIsUnmounted" 
                        class="recovery-changePassword pa-4 elevation-2 rounded-lg" 
                        color=background
                    >
                        <v-form @submit.prevent="submitForm" ref="formRecoveryChange">
                            <v-text-field autocomplete="username" style="display: none" />
                            <v-text-field
                                v-model="password"
                                variant="solo"
                                label="New password"
                                bg-color="background"
                                density="comfortable"
                                :type="passwordType"
                                :rules="rules.password"
                                autocomplete="new-password"
                            >
                                <password-icon 
                                    :isVisible="!!password.length" 
                                    :isPasswordVisible="passwordIsVisible"
                                    @click="showPassword"
                                />
                            </v-text-field>
                            <v-text-field
                                v-model="confirmPassword"
                                variant="solo"
                                label="Confirm new password"
                                bg-color="background"
                                density="comfortable"
                                :type="confirmPasswordType"
                                :rules="rules.confirmPassword"
                                autocomplete="new-password"
                            >
                                <password-icon 
                                    :isVisible="!!confirmPassword.length" 
                                    :isPasswordVisible="confirmPasswordIsVisible"
                                    @click="showConfirmPassword"
                                />
                            </v-text-field>
                            <button-ui 
                                :set="[0, 0, 0, 0, 0, 'Create new password']"
                                type="submit"
                            />
                        </v-form>
                    </v-sheet>
                </Transition>
            </v-container>
        </Transition>
    </main>
</template>
<style>
.password-recovery-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}
.recovery-form {
    position: relative;
    transition: all 1s ease;
}
.recovery-form-email {
    position: relative;
    transition: all 1s ease;
}
.recovery-form-code {
    width: calc(100% - 32px);
    position: absolute !important;
    top: 128px;
    left: 16px;
}
.recovery-form-enter-active,
.recovery-form-leave-active {
    transition: all 1s ease;
}
.recovery-form-enter-from,
.recovery-form-leave-to {
    opacity: 0;
    transform: translateY(500px);
}
.recovery-changePassword-enter-active,
.recovery-changePassword-leave-active {
    transition: all 1s ease;
}
.recovery-changePassword-enter-from,
.recovery-changePassword-leave-to {
    opacity: 0;
    transform: translateY(500px);
}
.recovery-form-code-enter-active,
.recovery-form-code-leave-active {
    transition: all 0.5s ease;
    transition-delay: 0.5s;
}
.recovery-form-code-enter-from {
    scale: 0;
}
.password-recovery-wrapper-enter-active {
    transition: all 0.75s ease;
}
.password-recovery-wrapper-enter-from {
    opacity: 0;
    transform: translateY(100%);
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
@media (max-width: 300px) {
    .recovery-form {
        width: 270px !important;
    }
}
</style>
