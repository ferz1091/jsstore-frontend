<script>
import ProductProp from '@/components/ProductItemPageComponents/ProductProp.vue';
import ProfilePropInput from './UserProfilePropInput.vue';
export default {
    components: {
        ProductProp,
        ProfilePropInput
    },
    props: {
        name: {type: String, required: true},
        value: {type: [String, Boolean], default: null}
    },
    data() {
        return {
            inputIsVisible: false,
            propError: null,
            propIsValid: true
        }
    },
    methods: {
        openInput() {
            if (this.name !== 'Verification') {
                this.inputIsVisible = true;
            } else if (!this.emailIsVerified) {
                this.$store.dispatch('sendActivationLink', this.userId);
            }
        },
        hideInput() {
            this.inputIsVisible = false;
            this.propIsValid = false;
            this.propError = null;
        },
        focusInput() {
            this.$refs['propInput'].focus();
        },
        propValidation(value) {
            if (!value) {
                this.propIsValid = true;
                this.propError = null;
            } else {
                this.propIsValid = false;
                this.propError = value;
            }
        },
        submitInput(value) {
            this.$emit('submitInput', {name: this.name, value: value});
            this.inputIsVisible = false;
        }
    },
    computed: {
        propColor() {
            return this.name === 'Verification' ? !this.value ? '#FB8C00' : '#4CAF50' : !this.value ? 'gray' : 'black';
        },
        myProfileProp() {
            return this.name === 'Verification' ? !this.value ? 'Not verified' : 'Verified' : !this.value ? 'Not indicated' : this.value;
        },
        myProfilePropAlertIcon() {
            return !this.value ? 'mdi-alert-circle' : this.name === 'Verification' ? 'mdi-check-circle-outline' : false;
        },
        myProfileEditProp() {
            return this.name === 'Verification' ? !this.value ? 'Send activation email' : false : !this.value ? 'Add' : 'Edit';
        },
        myProfileEditPropIcon() {
            return this.name === 'Verification' ? !this.value ? 'mdi-email' : false : !this.value ? 'mdi-plus-box' : 'mdi-pencil';
        },
        emailIsVerified() {
            return this.$store.state.user.isActivated;
        },
        userId() {
            return this.$store.getters.userId;
        },
        authMethodIsEmail() {
            return this.$store.state.user.authMethod === 'email';
        }
    }
}
</script>
<template>
    <product-prop class="my-profile-prop" :name="name">
        <span 
            class="ml-4 font-italic text-body-2" 
            v-bind:style="{color: this.propColor, wordBreak: 'break-all'}"
        >
            <v-icon 
                v-if="myProfilePropAlertIcon" 
                class="my-profile-prop-alert-icon" 
                :icon="myProfilePropAlertIcon" 
                size="x-small" 
                :color="propColor" 
            />
            {{ myProfileProp }}
        </span>
        <v-divider />
        <span class="my-profile-edit-prop" v-if="myProfileEditPropIcon && name !== 'Email' || name === 'Email' && emailIsVerified && authMethodIsEmail" @click="openInput">
            {{ myProfileEditProp }}
            <v-icon class="my-profile-edit-prop-icon" :icon="myProfileEditPropIcon" size="x-small" />
        </span>
        <span v-if="name === 'Email' && !emailIsVerified && authMethodIsEmail" v-bind:style="{fontSize: '12px', color: 'gray'}">
            Verify current email for change this email
        </span>
        <Transition name="profile-prop-input">
            <profile-prop-input 
                v-if="inputIsVisible" 
                @hideInput="hideInput" 
                :value="value" 
                :name="name" 
                @propValidation="propValidation"
                @submitInput="submitInput"
            />
        </Transition>
        <p class="my-profile-prop-error text-caption" v-if="!propIsValid">
            {{ propError }}
        </p>
    </product-prop>
</template>
<style>
.my-profile-prop {
    position: relative;
}
.my-profile-prop-alert-icon {
    position: relative;
    bottom: 1px;
}
.my-profile-edit-prop {
    cursor: pointer;
    font-size: 12px;
    color: #2779F6;
}
.my-profile-edit-prop:hover {
    color: black;
}
.my-profile-edit-prop-icon {
    position: relative;
    bottom: 1px;
}
.my-profile-prop-error {
    color: red;
    position: absolute;
    bottom: 100%;
    left: 0;
}
.profile-prop-input-enter-active,
.profile-prop-input-leave-active {
    transition: all 0.25s ease;
}

.profile-prop-input-enter-from {
    scale: 0;
}

.profile-prop-input-leave-to {
    scale: 0;
}
@media (max-height: 750px) {
    .my-profile-prop input {
        min-height: auto !important;
        height: 30px !important;
    }
}
</style>
