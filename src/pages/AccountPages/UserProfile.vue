<script>
import UserProfileProp from '@/components/AccountDetailsPageComponents/UserProfileProp.vue';
import ConfirmationCodeModal from '@/components/AccountDetailsPageComponents/ConfirmationCodeModal.vue';
export default {
    components: {
        UserProfileProp,
        ConfirmationCodeModal
    },
    data() {
        return {
            details: [],
            cachedDetails: [],
            confirmationCode: ''
        }
    },
    methods: {
        async submitForm() {
            if (this.details.find(detail => detail.name === 'Email').value === this.userData.email) {
                await this.$store.dispatch('editUserInfo', {id: this.userData.id, info: {
                    email: this.details.find(detail => detail.name === 'Email').value,
                    name: this.details.find(detail => detail.name === 'Name').value,
                    surname: this.details.find(detail => detail.name === 'Surname').value,
                    phone: this.details.find(detail => detail.name === 'Phone').value
                }});
                this.initPage();
                this.initCacheDetails();
            } else {
                this.$store.dispatch('getEmailChangeConfirmationCode', {id: this.userData.id, email: this.details.find(detail => detail.name === 'Email').value});
            }
        },
        async submitConfirmationCode() {
            await this.$store.dispatch('editUserInfo', {
                id: this.userData.id, 
                info: {
                    email: this.details.find(detail => detail.name === 'Email').value,
                    name: this.details.find(detail => detail.name === 'Name').value,
                    surname: this.details.find(detail => detail.name === 'Surname').value,
                    phone: this.details.find(detail => detail.name === 'Phone').value
                },
                code: this.confirmationCode
            });
            this.initPage();
            this.initCacheDetails();
        },
        validateEmail(email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(email);
        },
        submitInput(value) {
            this.details[this.details.findIndex(detail => detail.name === value.name)].value = value.value;
        },
        initPage() {
            this.details = [
                { name: 'Email', value: this.userData.email },
                { name: 'Verification', value: this.userData.isActivated },
                { name: 'Name', value: this.userData.name },
                { name: 'Surname', value: this.userData.surname },
                { name: 'Phone', value: this.userData.phone }
            ];
        },
        closeConfirmationCodeModal() {
            this.initPage();
            this.$store.commit('emailConfirmationModal', false);
        },
        confirmationCodeChanged(value) {
            this.confirmationCode = value;
        },
        initCacheDetails() {
            this.cachedDetails = [
                { name: 'Email', value: this.userData.email },
                { name: 'Verification', value: this.userData.isActivated },
                { name: 'Name', value: this.userData.name },
                { name: 'Surname', value: this.userData.surname },
                { name: 'Phone', value: this.userData.phone }
            ];
        }
    },
    mounted() {
        if (!this.isAuth) {
            this.$router.push('/shop/entry/men');
        } else {
            this.initPage();
            this.initCacheDetails();
        }
    },
    unmounted() {
        this.$store.commit('emailConfirmationModal', false);
    },
    watch: {
        isAuth() {
            if (!this.isAuth) {
                this.$router.push('/');
            }
        }
    },
    computed: {
        isAuth() {
            return this.$store.getters.isAuth;
        },
        userData() {
            return this.$store.state.user;
        },
        submitButtonIsDisabled() {
            return !this.details.some((detail, index) => detail.value !== this.cachedDetails[index].value);
        }
    }
}
</script>
<template>
    <main class="my-profile page">
        <Transition name="profile-page-wrapper" appear>
            <v-container 
                v-if="this.userData.email" 
                class="my-profile-wrapper elevation-8 rounded my-4" 
                fluid
            >
                <p class="my-profile-title text-button">
                    <v-icon icon="mdi-home-account" size="x-large"/>
                    My profile
                </p>
                <v-sheet class="my-profile-info mx-7" color="background">
                    <UserProfileProp 
                        v-for="detail in details" 
                        :name="detail.name" 
                        :value="detail.value" 
                        @submitInput="submitInput"
                    />
                    <v-sheet class="my-profile-btn-panel" color="background">
                        <button-ui 
                            class="my-profile-erase-btn rounded"
                            :set="[0, 0, '1', 'mdi-eraser', 0]"
                            :disabled="submitButtonIsDisabled"
                            @click="initPage" 
                        />
                        <button-ui 
                            class="my-profile-save-btn ml-1"
                            :set="[0, 0, 0, 0, 0, 'Save']"
                            :disabled="submitButtonIsDisabled"
                            @click="submitForm" 
                        />
                    </v-sheet>
                </v-sheet>
                <ConfirmationCodeModal 
                    @submitConfirmationCode="submitConfirmationCode"
                    @closeConfirmationCodeModal="closeConfirmationCodeModal"
                    @confirmationCodeChanged="confirmationCodeChanged"
                />
            </v-container>
        </Transition>
    </main>
</template>
<style>
.my-profile-title {
    font-size: 18px !important;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.my-profile-wrapper {
    height: calc(100% - 32px);
    max-width: 500px;
    max-height: 700px;
}
.my-profile-info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: calc(100% - 72px);
}
.my-profile-save-btn {
    width: calc(100% - 40px);
}
.profile-page-wrapper-enter-active {
    transition: all 0.75s ease;
}
.profile-page-wrapper-enter-from {
    opacity: 0;
    transform: translateY(100%);
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
@media (min-height: 1500px) {
    .my-profile-wrapper {
        margin-top: 250px !important;
    }
}
@media (max-width: 400px) {
    .my-profile-wrapper {
        height: 100%;
        margin: 0px !important
    }
}
</style>
