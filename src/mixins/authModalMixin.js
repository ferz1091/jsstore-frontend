export default {
    data() {
        return {
            email: '',
            password: '',
            passwordType: 'password',
            formIsValid: false,
            dirtyInputs: {
                emailInputIsDirty: false,
                passwordInputIsDirty: false
            },
            emailRules: [
                value => {
                    if (value) return true;
                    return 'You must enter an email.';
                },
                value => {
                    if (this.validateEmail(value)) return true;
                    if (this.emailInputIsDirty) return 'Invalid email.';
                    return true;
                }
            ],
            passwordRules: [
                value => {
                    if (value) return true;
                    return 'You must enter a password.'
                },
                value => {
                    if (value.length > 6) return true;
                    if (this.passwordInputIsDirty) return 'Password must be longer than 6.';
                    return true;
                },
                value => {
                    if (value.length < 20) return true;
                    return 'Password must be less than 20.';
                }
            ]
        }
    },
    props: {
        isActive: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        closeModal() {
            this.$emit('closeModal');
        },
        clearEmailInput() {
            this.email = '';
            this.$refs.emailInput.blur();
        },
        showPassword() {
            this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
        },
        validateEmail(email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(email);
        },
        toggleEmailInput() {
            this.dirtyInputs.emailInputIsDirty = true;
        },
        togglePasswordInput() {
            this.dirtyInputs.passwordInputIsDirty = true;
        },
        async validateForm() {
            const { valid } = await this.$refs.formRef.validate();
            this.formIsValid = valid;
        }
    },
    computed: {
        modalIsActive() {
            return this.isActive;
        },
        emailLength() {
            return !!this.email.length;
        },
        passwordLength() {
            return !!this.password.length;
        },
        passwordIsVisible() {
            if (this.passwordType === 'text') {
                return false;
            } else {
                return true;
            }
        },
        emailInputIsDirty() {
            return this.dirtyInputs.emailInputIsDirty;
        },
        passwordInputIsDirty() {
            return this.dirtyInputs.passwordInputIsDirty;
        }
    }
}
