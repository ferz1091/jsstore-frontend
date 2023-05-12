<script>
import api from '@/init/http/api.js';
export default {
    name: 'profile-prop-input',
    props: {
        name: {type: String, required: true},
        value: {type: [String, Boolean], default: null}
    },
    data() {
        return {
            initValue: this.value,
            inputValue: this.value ? this.value : '',
            inputIsValid: false,
            inputError: null
        }
    },
    mounted() {
        this.$refs.propInput.focus();
    },
    methods: {
        hideInput() {
            this.$emit('hideInput');
        },
        async submitInput() {
            if (this.name === 'Email') {
                this.$store.commit('toggleIsFetching', true);
                const response = await api.checkEmail(this.inputValue);
                this.$store.commit('toggleIsFetching', false);
                if (!response.data.status) {
                    this.$emit('submitInput', this.inputValue);
                } else {
                    this.inputIsValid = false;
                    this.inputError = 'Mail already registered';
                    this.$emit('propValidation', 'Mail already registered');
                }
            }
            if (this.inputIsValid) {
                this.$emit('submitInput', this.inputValue);
            }
        },
        validateInput() {
            return {
                email(value) {
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    const result = emailRegex.test(value);
                    return {valid: result, error: result ? '' : 'Invalid email.'}
                },
                name(value) {
                    const result = value.trim().length > 2 && value.trim().length < 13;
                    return {valid: result, error: result ? '' : 'Name must be longer than 2 and shorter than 13 characters.'}
                },
                surname(value) {
                    const result = value.trim().length > 2 && value.trim().length < 20;
                    return { valid: result, error: result ? '' : 'Surname must be longer than 2 and shorter than 20 characters.' }
                },
                phone(value) {
                    const phoneRegex = /^\+380(67|68|96|97|98|50|95|73|73|93)\d{7}$/;
                    const phoneRegex2 = /^0(67|68|96|97|98|50|95|73|73|93)\d{7}$/;
                    const result = phoneRegex.test(value) || phoneRegex2.test(value);
                    return {valid: result, error: result ? '' : 'Format: 0##-###-##-##'};
                }
            }
        },
    },
    watch: {
        inputValue(newValue) {
            const result = this.validateInput()[this.name.toLowerCase()](newValue);
            if (result.valid) {
                this.inputIsValid = true;
                this.inputError = null;
                this.$emit('propValidation');
            } else {
                this.inputIsValid = false;
                this.inputError = result.error;
                this.$emit('propValidation', result.error);
            }
        }
    }
}
</script>
<template>
    <v-text-field
        class="profile-prop-input"
        variant="solo" 
        bg-color="background" 
        density="compact" 
        ref="propInput"
        :type="name === 'Phone' ? 'number' : 'text'"
        v-model="inputValue"
        hide-details
        @blur="hideInput"
    >
        <button-ui 
            class="submit-input-btn"
            :set="['t', 0, '2', 'mdi-check', 0]"
            :disabled="!inputIsValid"
            @click="submitInput"
        />
    </v-text-field>
</template>
<style>
.profile-prop-input {
    position: absolute !important;
    top: calc(50% + 4px);
    left: 0;
    width: 100%;
}
.submit-input-btn {
    position: absolute;
    top: 50%;
    left: calc(100% + 5px);
    transform: translateY(-50%);
}
</style>
