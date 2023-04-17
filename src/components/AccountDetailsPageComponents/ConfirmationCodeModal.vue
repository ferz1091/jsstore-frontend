<script>
export default {
    data() {
        return {
            confirmationCode: ''
        }
    },
    methods: {
        submitConfirmationCode() {
            this.$emit('submitConfirmationCode');
        },
        closeConfirmationCodeModal() {
            this.$emit('closeConfirmationCodeModal');
        }
    },
    watch: {
        confirmationCode() {
            this.$emit('confirmationCodeChanged', this.confirmationCode);
        }
    },
    computed: {
        emailConfirmationModalActive() {
            return this.$store.state.emailConfirmationModalActive;
        },
        confirmationCodeBtnIsDisabled() {
            return this.confirmationCode.length !== 6;
        }
    }
}
</script>
<template>
    <v-sheet 
        v-if="emailConfirmationModalActive"
        class="emailConfirmation-modal-scrim"
        color="transparent"
    >
        <v-sheet 
            class="emailConfirmation-modal pa-8 rounded elevation-4" 
            color="background"
        >
            <v-text-field
                class="elevation-4"
                v-model="confirmationCode" 
                bg-color="surface" 
                variant="solo" 
                label="Enter code" 
                hide-details 
                density="compact"
                type="number"
            />
            <v-btn 
                class="w-100 mt-3 elevation-4" 
                color="surface" 
                density="comfortable"
                @click="submitConfirmationCode"
                :disabled="confirmationCodeBtnIsDisabled"
            >
                Send
            </v-btn>
            <v-btn 
                class="emailConfirmation-close-modal-btn" 
                icon="mdi-close" 
                color="surface" 
                density="compact" 
                size="small"
                variant="text"
                @click="closeConfirmationCodeModal"
            />
        </v-sheet>
    </v-sheet>
</template>
<style>
.emailConfirmation-modal-scrim {
    cursor: not-allowed;
    position: fixed;
    z-index: 5000;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.emailConfirmation-modal {
    cursor: auto;
    position: relative;
    min-width: 250px;
}
.emailConfirmation-close-modal-btn {
    position:  absolute;
    top: 5px;
    right: 5px;
}
</style>
