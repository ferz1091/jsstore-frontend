<script>
export default {
    data() {
        return {
            formIsValid: false,
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            currentPasswordType: 'password',
            newPasswordType: 'password',
            confirmNewPasswordType: 'password',
            dirtyInputs: {
                currentPassword: false,
                newPassword: false,
                confirmNewPassword: false
            },
            rules: {
                currentPassword: [
                    value => {
                        if (value) return true;
                        return 'You must enter your current password.'
                    },
                    value => {
                        if (value.length > 6) return true;
                        if (this.dirtyInputs.currentPassword) return 'Password must be longer than 6.';
                        return true;
                    },
                    value => {
                        if (value.length < 20) return true;
                        return 'Password must be less than 20.';
                    }
                ],
                newPasswordRules: [
                    value => {
                        if (value) return true;
                        return 'You must enter your current password.'
                    },
                    value => {
                        if (value.length > 6) return true;
                        if (this.dirtyInputs.newPassword) return 'Password must be longer than 6.';
                        return true;
                    },
                    value => {
                        if (value.length < 20) return true;
                        return 'Password must be less than 20.';
                    },
                    value => {
                        if (value === this.currentPassword) return 'Passwords match the old ones.';
                        return true;
                    }
                ],
                confirmNewPasswordRules: [
                    value => {
                        if (value) return true;
                        return 'You must confirm a password.'
                    },
                    value => {
                        if (this.comparePassword) return true;
                        if (this.dirtyInputs.confirmNewPassword) return 'Password mismatch.';
                        return true;
                    }
                ]
            }
        }
    },
    mounted() {
        this.$store.dispatch('getUserSessions', {id: this.userId});
    },
    unmounted() {
        this.$store.commit('clearSessions');
    },
    methods: {
        async submitForm() {
            await this.validateForm();
            if (this.formIsValid) {
                const dispatchResult = await this.$store.dispatch('changePassword', { id: this.userId, password: this.currentPassword, newPassword: this.newPassword });
                if (dispatchResult) {
                    this.$router.push('/shop/entry/men');
                }
            }
        },
        async validateForm() {
            const { valid } = await this.$refs.changePasswordForm.validate();
            this.formIsValid = valid;
        },
        showCurrentPassword() {
            this.currentPasswordType = this.currentPasswordType === 'password' ? 'text' : 'password';
        },
        toggleCurrentPassword() {
            this.dirtyInputs.currentPassword = true;
        },
        showNewPassword() {
            this.newPasswordType = this.newPasswordType === 'password' ? 'text' : 'password';
        },
        toggleNewPassword() {
            this.dirtyInputs.newPassword = true;
        },
        showConfirmNewPassword() {
            this.confirmNewPasswordType = this.confirmNewPasswordType === 'password' ? 'text' : 'password';
        },
        toggleConfirmNewPassword() {
            this.dirtyInputs.confirmNewPassword = true;
        }
    },
    computed: {
        userId() {
            return this.$store.state.user.id;
        },
        formIsDisabled() {
            return !this.$store.state.user.isActivated;
        },
        currentPasswordIsVisible() {
            return this.currentPasswordType === 'password' ? false : true;
        },
        newPasswordIsVisible() {
            return this.newPasswordType === 'password' ? false : true;
        },
        confirmNewPasswordIsVisible() {
            return this.confirmNewPasswordType === 'password' ? false : true;
        },
        comparePassword() {
            return this.newPassword === this.confirmNewPassword;
        }
    }
}
</script>
<template>
    <Transition name="my-security-password">
        <v-sheet 
            class="my-security-password px-6 pt-10 pb-14 mt-4 elevation-4 rounded-lg" 
            color="background"
        >
            <p class="my-security-password-title text-button text-center mb-4">
                Change my password
            </p>
            <v-form 
                class="my-security-form" 
                @submit.prevent="submitForm" 
                ref="changePasswordForm"
            >
                <v-text-field autocomplete="username" style="display: none;"></v-text-field>
                    <v-text-field 
                        class="my-security-input"
                        variant="solo"
                        bg-color="background"
                        density="comfortable"
                        label="Current password"
                        autocomplete="current-password"
                        :type="currentPasswordType"
                        :rules="rules.currentPassword"
                        @blur="toggleCurrentPassword"
                        v-model="currentPassword"
                    >
                        <password-icon 
                            :isVisible="!!currentPassword.length" 
                            :isPasswordVisible="currentPasswordIsVisible"
                            @click="showCurrentPassword"
                        />
                    </v-text-field>
                    <v-text-field 
                        class="my-security-input"
                        variant="solo"
                        bg-color="background"
                        density="comfortable"
                        label="New password"
                        autocomplete="new-password"
                        :type="newPasswordType"
                        :rules="rules.newPasswordRules"
                        @blur="toggleNewPassword"
                        v-model="newPassword"
                    >
                        <password-icon 
                            :isVisible="!!newPassword.length" 
                            :isPasswordVisible="newPasswordIsVisible"
                            @click="showNewPassword"
                        />
                    </v-text-field>
                    <v-text-field 
                        class="my-security-input"
                        variant="solo"
                        bg-color="background"
                        density="comfortable"
                        label="Confirm new password"
                        autocomplete="new-password"
                        :type="confirmNewPasswordType"
                        :rules="rules.confirmNewPasswordRules"
                        @blur="toggleConfirmNewPassword"
                        v-model="confirmNewPassword"
                    >
                        <password-icon 
                            :isVisible="!!confirmNewPassword.length" 
                            :isPasswordVisible="confirmNewPasswordIsVisible"
                            @click="showConfirmNewPassword"
                        />
                    </v-text-field>
                    <button-ui 
                        class="my-security-password-submit-btn mb-5"
                        :set="[0, 's', 0, 0, 0, 'change']"
                        type="submit"
                        :disabled="formIsDisabled"
                    />
            </v-form>
        </v-sheet>
    </Transition>
</template>
<style>
.my-security-password {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.my-security-form {
    display: flex;
    align-items: center;
}
.my-security-password-title {
    font-size: 16px !important;
    letter-spacing: 4px !important;
    max-width: 300px;
}
.my-security-input, .my-security-password-submit-btn {
    width: 300px;
}
.my-security-input .v-field {
    height: 48px !important;
}
.my-security-input .v-input__details {
    position: relative !important;
    bottom: 10px;
}
.my-security-password-enter-active,
.my-security-password-leave-active {
    transition: all 0.8s ease;
}

.my-security-password-enter-from {
    opacity: 0;
    transform: translateX(-100%);
}

.my-security-password-leave-to {
    opacity: 0;
    transform: translateX(-100%);
}
@media (max-width: 350px) {
    .my-security-input, .my-security-password-submit-btn {
        width: 250px;
    }
    .my-security-password-title {
        font-size: 14px !important;
    }
}
</style>
