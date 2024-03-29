<script>
export default {
    name: 'auth-modal',
    props: {
        isActive: {type: Boolean, required: true}
    },
    data() {
        return {
            loginMode: true,
            isTitleBtnDisabled: true,
            loginEmail: '',
            loginPassword: '',
            isRemember: false,
            regEmail: '',
            regPassword: '',
            confirmPassword: '',
            displayWidth: null,
            displayHeight: null,
            passwordLoginType: 'password',
            passwordRegType: 'password',
            passwordConfirmType: 'password',
            loginFormIsValid: false,
            regFormIsValid: false,
            dirtyInputs: {
                emailLoginInputIsDirty: false,
                passwordLoginInputIsDirty: false,
                emailRegInputIsDirty: false,
                passwordRegInputIsDirty: false,
                passwordConfirmInputIsDirty: false
            },
            emailRules: [
                value => {
                    if (value) return true;
                    return 'You must enter an email.';
                },
                value => {
                    if (this.validateEmail(value)) return true;
                    if (this.loginMode ? this.dirtyInputs.emailLoginInputIsDirty : this.dirtyInputs.emailRegInputIsDirty) return 'Invalid email.';
                    return true;
                }
            ],
            passwordRules: [
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
                    if (this.loginMode ? this.dirtyInputs.passwordLoginInputIsDirty : this.dirtyInputs.passwordRegInputIsDirty) return 'Password must be longer than 6.';
                    return true;
                },
                value => {
                    if (value.length < 20) return true;
                    return 'Password must be less than 20.';
                }
            ],
            confirmPasswordRules: [
                value => {
                    if (value) return true;
                    return 'You must confirm a password.'
                },
                value => {
                    if (this.comparePassword) return true;
                    if (this.dirtyInputs.passwordConfirmInputIsDirty) return 'Password mismatch.';
                    return true;
                }
            ]
        }
    },
    mounted() {
        this.displayWidth = window.innerWidth;
        this.displayHeight = window.innerHeight;
    },
    watch: {
        isActive(newValue) {
            newValue ? window.addEventListener('resize', this.setDisplayResolution) : window.removeEventListener('resize', this.setDisplayWidth);
        }
    },
    methods: {
        toggleMode() {
            this.loginMode = !this.loginMode;
            setTimeout(() => {
                this.isTitleBtnDisabled = !this.isTitleBtnDisabled;
            }, 250)
        },
        setDisplayResolution() {
            this.displayWidth = window.innerWidth;
            this.displayHeight = window.innerHeight;
        },
        toggleEmailInput() {
            if (this.loginMode) {
                this.dirtyInputs.emailLoginInputIsDirty = true;
            } else {
                this.dirtyInputs.emailRegInputIsDirty = true;
            }
        },
        togglePasswordInput() {
            if (this.loginMode) {
                this.dirtyInputs.passwordLoginInputIsDirty = true;
            } else {
                this.dirtyInputs.passwordRegInputIsDirty = true;
            } 
        },
        toggleConfirmPasswordInput() {
            this.dirtyInputs.passwordConfirmInputIsDirty = true;
        },
        validateEmail(email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(email);
        },
        async validateForm() {
            if (this.loginMode) {
                const { valid } = await this.$refs.formRefLogin.validate();
                this.loginFormIsValid = valid;
            } else {
                const { valid } = await this.$refs.formRefReg.validate();
                this.regFormIsValid = valid;
            }
        },
        async submitForm() {
            await this.validateForm();
            if (this.loginMode) {
                if (this.loginFormIsValid) {
                    this.$store.dispatch('loginUser', { email: this.loginEmail, password: this.loginPassword, isRemember: this.isRemember });
                }
            } else {
                if (this.regFormIsValid) {
                    this.$store.dispatch('registration', { email: this.regEmail, password: this.regPassword});
                }
            }
        },
        closeModal() {
            this.$emit('closeModal');
        },
        showLoginPassword() {
            this.passwordLoginType = this.passwordLoginType === 'text' ? 'password' : 'text';
        },
        showRegPassword() {
            this.passwordRegType = this.passwordRegType === 'text' ? 'password' : 'text';
        },
        showConfirmPassword() {
            this.passwordConfirmType = this.passwordConfirmType === 'text' ? 'password' : 'text';
        },
        toPasswordRecovery() {
            this.$store.commit('toggleAuthModal', false);
            this.$router.push('/account/recovery');
        },
        googleAuth() {
                const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
                const options = {
                    redirect_uri: 'http://localhost:5173/authback',
                    client_id: '874600186480-fi546clggocci41u6tth5eirirg50gpc.apps.googleusercontent.com',
                    access_type: 'offline',
                    response_type: 'code',
                    prompt: 'consent',
                    scope: [
                        'https://www.googleapis.com/auth/userinfo.profile',
                        'https://www.googleapis.com/auth/userinfo.email',
                    ].join(' ')
                };

                const qs = new URLSearchParams(options);
                window.location.assign(`${rootUrl}?${qs.toString()}`);
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
        comparePassword() {
            return this.regPassword === this.confirmPassword;
        },
        isFetching() {
            return this.$store.getters.isFetching;
        },
        loginPasswordIsVisible() {
            if (this.passwordLoginType === 'text') {
                return false;
            } else {
                return true;
            }
        },
        regPasswordIsVisible() {
            if (this.passwordRegType === 'text') {
                return false;
            } else {
                return true;
            }
        },
        confirmPasswordIsVisible() {
            if (this.passwordConfirmType === 'text') {
                return false;
            } else {
                return true;
            }
        }
    }
}
</script>
<template>
    <v-dialog
        transition="dialog-bottom-transition"
        width="auto"
        v-model="modalIsActive"
        scroll-strategy="none"
        elevation="24"
        class="auth_overlay"
    >
    <v-container class="authModal pa-0 elevation-16">
        <v-sheet 
            class="modal-slider" 
            color="surface" 
            v-bind:style="{left: displayWidth > 600 ? loginMode ? '50%' : '0%' : '0%', top: displayWidth > 600 ? '0%' : loginMode ? '50%' : '0%'}" 
            elevation="16"
        ></v-sheet>
        <v-sheet class="login-title px-5 py-2" color="transparent">
            <p class="text-button py-2 font-weight-black" style="font-size: 28px !important">
                Welcome back!
            </p>
            <p class="text-caption py-2 mt-4" style="font-size: 14px !important">
                To continue shopping, please login with your personal information.
            </p>
            <button-ui 
                class="submit-btn rounded-xl px-10 mt-6"
                :set="['o', 'b', displayWidth < 600 || displayHeight < 700 ? '2' : 0, 0, 0, 'Sign in']"
                :disabled="isTitleBtnDisabled" 
                @click="toggleMode" 
            />
        </v-sheet>
        <v-sheet class="registration-title px-5 py-2" color="transparent">
            <p class="text-button py-2 font-weight-black" style="font-size: 28px !important">
                Hello, friend!
            </p>
            <p class="text-caption py-2 mt-4" style="font-size: 14px !important">
                Sign up and get access to the hottest fashion trends.
            </p>
            <button-ui 
                class="submit-btn rounded-xl px-10 mt-6"
                :set="['o', 'b', displayWidth < 600 || displayHeight < 700 ? '2' : 0, 0, 0, 'Sign Up']"
                :disabled="!isTitleBtnDisabled"
                @click="toggleMode"
            />
        </v-sheet>
        <Transition name="login-form">
            <v-sheet class="login-form" color="transparent" v-if="loginMode">
                <v-form @submit.prevent="submitForm" ref="formRefLogin">
                    <p 
                        class="signIn-title text-button font-weight-bold" 
                        v-bind:style="{fontSize: 'calc(0 + 24px * (100vh / 1400)) !important', display: displayWidth > 600 && displayHeight < 515 ? 'none' : displayWidth < 600 && displayHeight < 760 ? 'none' : 'block'}"
                    >
                        Sign in
                    </p>
                    <div class="googleAuth-wrapper mb-2">
                        <span class="google-btn" @click="googleAuth">
                            <span class="google-icon-wrapper">
                                <span class="google-icon" />
                            </span>
                            <span class="btn-text">
                                Sign In with Google
                            </span>
                        </span>
                    </div>
                    <v-text-field
                        v-model="loginEmail"
                        type="text"
                        ref="emailLoginInput"
                        class="email field"
                        variant="solo"
                        label="Email"
                        density="compact"
                        bg-color="transparent"
                        :rules="emailRules"
                        @blur="toggleEmailInput"
                        clearable
                    />
                    <v-text-field 
                        class="password field" 
                        variant="solo" 
                        name="Password"
                        label="Password"
                        v-model="loginPassword"
                        autocomplete="on"
                        density="compact"
                        bg-color="transparent"
                        :rules="passwordRules"
                        :type="passwordLoginType"
                        @blur="togglePasswordInput"
                    >
                        <password-icon 
                            :isVisible="!!loginPassword.length" 
                            :isPasswordVisible="loginPasswordIsVisible"
                            @click="showLoginPassword"
                        />
                    </v-text-field>
                    <v-switch
                        class="switch"
                        label="Remember me"
                        color="surface"
                        v-model="isRemember"
                        density="compact"
                        hide-details
                        inset
                        falseIcon="mdi-close"
                        trueIcon="mdi-check"
                    />
                    <p class="forgotPass-label text-center text-caption" @click="toPasswordRecovery">
                        Forgot password?
                    </p>
                    <div>
                        <button-ui 
                            class="submitLogin-btn rounded-xl px-10"
                            :set="['o', 's', displayWidth < 600 || displayHeight < 700 ? '2' : 0, 0, 0, 'Sign in']"
                            type="submit"
                            :disabled="isFetching"
                        />
                    </div>
                </v-form>
            </v-sheet>
        </Transition>
        <Transition name="registration-form">
            <v-sheet v-if="!loginMode" class="registration-form" color="transparent">
                <v-form @submit.prevent="submitForm" ref="formRefReg">
                    <p 
                        class="signUp-title text-button font-weight-bold" 
                        v-bind:style="{ fontSize: 'calc(0 + 24px * (100vh / 1400)) !important', display: displayWidth > 600 && displayHeight < 515 ? 'none' : displayWidth < 600 && displayHeight < 760 ? 'none' : 'block' }"
                    >
                        Sign up
                    </p>
                    <div class="googleAuth-wrapper mb-2">
                        <span class="google-btn" @click="googleAuth">
                            <span class="google-icon-wrapper">
                                <span class="google-icon" />
                            </span>
                            <span class="btn-text">
                                Sign Up with Google
                            </span>
                        </span>
                    </div>
                    <v-text-field
                        v-model="regEmail"
                        type="text"
                        ref="emailRegInput"
                        class="email field"
                        variant="solo"
                        label="Email"
                        density="compact"
                        bg-color="transparent"
                        :rules="emailRules"
                        @blur="toggleEmailInput"
                        clearable
                    />
                    <v-text-field 
                        class="password field"
                        name="Password"
                        variant="solo" 
                        label="Password"
                        v-model="regPassword"
                        :type="passwordRegType"
                        autocomplete="on"
                        :rules="passwordRules"
                        @blur="togglePasswordInput"
                        bg-color="transparent"
                        density="compact"
                    >
                        <password-icon 
                            :isVisible="!!regPassword.length" 
                            :isPasswordVisible="regPasswordIsVisible"
                            @click="showRegPassword"
                        />
                    </v-text-field>
                    <v-text-field 
                        class="confirm-password field"
                        name="ConfirmPassword"
                        variant="solo" 
                        label="Confirm password"
                        v-model="confirmPassword"
                        :type="passwordConfirmType"
                        autocomplete="on"
                        :rules="confirmPasswordRules"
                        @blur="toggleConfirmPasswordInput"
                        bg-color="transparent"
                        density="compact"
                    >
                        <password-icon 
                            :isVisible="!!confirmPassword.length" 
                            :isPasswordVisible="confirmPasswordIsVisible"
                            @click="showConfirmPassword"
                        />
                    </v-text-field>
                    <div class="submitReg-wrapper">
                        <button-ui 
                            class="submitReg-btn rounded-xl px-10"
                            :set="['o', 's', displayWidth < 600 || displayHeight < 700 ? '2' : 0, 0, 0, 'Sign up']"
                            type="submit"
                            :disabled="isFetching"
                        />
                    </div>
                </v-form>
            </v-sheet>
        </Transition>
        <button-ui 
            class="closeAuthModalMobileBtn"
            :set="['f', 'b', 0, 'mdi-close', 's']"
            @click="closeModal"
        />
    </v-container>
    </v-dialog>
</template>
<style>
.authModal {
    position: relative;
    width: 60vw !important;
    height: 70vh;
    background: white;
    border-radius: 8px;
}
.modal-slider {
    height: 100%;
    width: 50%;
    position: absolute;
    top: 0;
    transition: all 0.7s ease-out;
    z-index: 1 !important;
    border-radius: 8px !important;
}
.login-title, .registration-title {
    position: absolute !important;
    height: 100%;
    width: 50%;
    top: 0;
    z-index: 2 !important;
    display: flex !important;
    align-items: center;
    flex-direction: column;
    background: transparent !important;
    text-align: center;
    justify-content: center;
    user-select: none;
}
.login-title {
    left: 0;
}
.registration-title {
    left: 50%;
}
.login-form, .registration-form {
    position: absolute !important;
    z-index: 3 !important;
    top: 0;
    height: 100%;
    width: 50%;
    overflow: hidden !important;
}
.login-form {
    left: 0;
}
.registration-form {
    left: 50%;
}
.signIn-title, .signUp-title {
    margin: calc(0px + 30 * (100vh / 1400)) 0;
    color: black;
}
.field .v-field {
    max-height: 42px !important;
    color: black !important;
}
.field .v-input__control {
    display: flex !important;
    justify-content: center;
}
.field {
    min-width: 300px;
    padding: calc(0px + 0 * (100vh / 1400));
    padding-right: calc(0px + 35 * (100vw / 1400));
    padding-left: calc(0px + 35 * (100vw / 1400));
}
.login-form .v-input, .registration-form .v-input {
    max-height: 100px !important;
    max-width: 600px !important;
    margin: 0 auto;
}
.login-form .v-input__details, .registration-form .v-input__details {
    align-items: flex-start !important;
}
.closeAuthModalMobileBtn {
    display: none !important;
    position: absolute !important;
    top: 5px;
    right: 5px;
    z-index: 10;
}
form {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    justify-content: center;
}
.switch label {
    max-height: 50px !important;
}
.v-switch__track {
    max-height: 20px;
    max-width: 40px;
    color: rgba(0, 0, 0, 0.25);
}
.v-switch__thumb {
    max-height: 14px;
    max-width: 14px;
}
.switch label {
    color: black;
}
.submit-btn, .submitLogin-btn, .submitReg-btn {
    position: absolute !important;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
}
.googleAuth-wrapper {
    margin-bottom: 5px;
    padding: calc(0px + 8 * (100vh / 1400)) 0;
}
.forgotPass-label {
    position: relative;
    bottom: 20px;
    cursor: pointer;
    color: #2196F3;
}
.forgotPass-label:hover {
    color: black;
}
.submitReg-wrapper {
    height: 30px;
}
.login-form-enter-active {
    transition: all 0.55s ease;
}
.login-form-leave-active {
    transition: all 0.85s ease;
}
.login-form-enter-from {
    transform: translateX(45%);
    max-width: 50%;
    opacity: 0;
}
.login-form-leave-to {
    transform: translateX(45%);
    max-width: 50%;
    opacity: 0;
}
.registration-form-enter-active {
    transition: all 0.85s ease;
}
.registration-form-leave-active {
    transition: all 0.85s ease;
}
.registration-form-enter-from {
    transform: translateX(-45%);
    max-width: 50%;
    opacity: 0;
}
.registration-form-enter-active .google-btn {
    transition: all 0.35s ease;
    transition-delay: 0.5s;
}
.login-form-enter-active .google-btn {
    transition: 0.35s ease;
    transition-delay: 0.3s;
}
.login-form-enter-active .forgotPass-label {
    transition: 0.4s ease;
    transition-delay: 0.4s;
}
.registration-form-leave-active .google-btn,
.login-form-leave-active .google-btn,
.login-form-leave-active .forgotPass-label {
    transition: all 0.2s ease;
}
.registration-form-enter-from .google-btn, .login-form-enter-from .google-btn,
.registration-form-leave-to .google-btn, .login-form-leave-to .google-btn,
.login-form-enter-from .forgotPass-label, .login-form-leave-to .forgotPass-label {
    scale: 0;
}
.registration-form-leave-to {
    transform: translateX(-45%);
    max-width: 50%;
    opacity: 0;
}
.switch .v-icon {
    color: black !important;
    font-size: 16px !important;
}
.google-btn {
    cursor: pointer;
    display: inline-block;
    background-color: #4285F4;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    border-radius: 4px;
    padding: 12px 24px;
    text-decoration: none;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
}

.google-btn:hover {
    background-color: #327FDB;
}

.google-btn:active {
    background-color: #2468C2;
}

.google-icon-wrapper {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
}
.google-icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    background-image: url('https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg');
    background-size: cover;
}
.btn-text {
    display: inline-block;
    vertical-align: middle;
}
@media (max-width: 1000px) {
    .authModal {
        width: 80vw !important;
    }
}
@media (max-width: 750px) {
    .authModal {
        width: 100vw !important;
        height: 100vh !important;
        border-radius: 0px;
    }
    .auth_overlay .v-overlay__content {
        margin: 0 !important;
        max-width: 100% !important;
        max-height: 100% !important;
    }
    .modal-slider {
        border-radius: 0px !important;
    }
    .closeAuthModalMobileBtn {
        display: block !important;
    }
}
@media (max-width: 600px) {
    .login-form, .registration-form {
        height: 50%;
        width: 100%;
        left: 0;
    }
    .login-form {
        top: 0;
    }
    .registration-form {
        top: 50%;
    }
    .login-form .v-input, .registration-form .v-input {
        max-height: 70px !important;
        max-width: 600px !important;
    }
    .modal-slider {
        height: 50%;
        width: 100%;
        left: 0 !important;
        top: 50%;
    }
    .login-title, .registration-title {
        height: 50%;
        width: 100%;
        left: 0;
    }
    .login-title {
        top: 0;
    }
    .registration-title {
        top: 50%;
    }
    .submit-btn, .submitLogin-btn, .submitReg-btn {
        bottom: 5px;
    }
    .google-btn {
        font-size: 14px;
        padding: 4px 16px;
    }
    .login-form-enter-active {
        transition: all 0.55s ease;
    }
    .login-form-leave-active {
        transition: all 0.85s ease;
    }
    .login-form-enter-from, .login-form-leave-to, .registration-form-enter-from, .registration-form-leave-to {
        max-width: 100%;
    }
    .login-form-enter-from {
        transform: translateY(10%);
        opacity: 0;
    }
    .login-form-leave-to {
        transform: translateY(10%);
        opacity: 0;
    }
    .registration-form-enter-active {
        transition: all 0.85s ease;
    }
    .registration-form-leave-active {
        transition: all 0.85s ease;
    }
    .registration-form-enter-from {
        transform: translateY(-10%);
        opacity: 0;
    }
    .registration-form-leave-to {
        transform: translateY(-10%);
        opacity: 0;
    }
}
@media (max-height: 730px) {
    .forgotPass-label {
        bottom: 30px;
    }
}
@media (max-height: 550px) {
        .forgotPass-label {
        bottom: 30px;
    }
}
@media (max-height: 700px) {
   .submit-btn, .submitLogin-btn, .submitReg-btn {
        bottom: 5px;
    }
    .google-btn {
        font-size: 14px;
        padding: 4px 16px;
    }
}
@media (max-width: 300px) {
    .field {
        width: 80% !important;
        min-width: 200px !important;
    }
}
@media (max-height: 400px) {
    .field .v-field {
        padding: 0 !important;
        max-height: 30px !important;
        font-size: 12px !important;
    }
    .field input {
        padding-top: 0 !important;
    }
    .login-form .v-input, .registration-form .v-input {
        max-height: 50px !important;
    }
    .submit-btn, .submitLogin-btn, .submitReg-btn {
        max-height: 20px !important;
        bottom: 3px;
    }
        .forgotPass-label {
        bottom: 0px;
    }
}
@media (max-height: 375px) {
        .forgotPass-label {
        bottom: 20px;
    }
}
</style>
