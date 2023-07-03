<script>
import ChangePasswordForm from '@/components/AccountSecurityPageComponents/ChangePasswordForm.vue';
import UserSessions from '@/components/AccountSecurityPageComponents/UserSessions.vue';
export default {
    components: {
        ChangePasswordForm,
        UserSessions
    },
    data() {
        return {
            tab: 'one'
        }
    },
    mounted() {
        if (!this.isAuth) {
            this.$router.push('/shop/entry/men');
        }
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
        formIsDisabled() {
            return !this.$store.state.user.isActivated;
        },
        authMethodIsEmail() {
            return this.$store.state.user.authMethod === 'email';
        }
    }
}
</script>
<template>
    <main class="my-security page">
        <Transition name="my-security-wrapper" appear>
            <v-container 
                v-if="isAuth" 
                class="my-security-wrapper" 
                fluid
            >
                <v-tabs 
                    class="w-100" 
                    align-tabs="center"
                    v-model="tab" 
                >
                    <v-tab value="one">
                        password
                    </v-tab>
                    <v-tab value="two">
                        sessions
                    </v-tab>
                </v-tabs>
                <v-window class="w-100" v-model="tab">
                    <v-window-item value="one">
                        <ChangePasswordForm :authMethodIsEmail="authMethodIsEmail"/>
                    </v-window-item>
                    <v-window-item value="two">
                        <UserSessions />
                    </v-window-item>
                </v-window>
                <Transition name="my-security-email-warning">
                    <p 
                        v-if="formIsDisabled && tab === 'one' && authMethodIsEmail" 
                        class="my-security-email-warning text-caption font-weight-bold pa-2 text-center rounded-lg elevation-5" 
                        color="info"
                    >
                        To change your password, you must 
                        <router-link class="verify-link" to="/account/profile">
                            verify
                        </router-link> 
                        your email
                    </p>
                </Transition>
                <Transition name="my-security-email-warning">
                    <p 
                        v-if="!authMethodIsEmail && tab === 'one'"
                        class="my-security-email-warning text-caption font-weight-bold pa-2 text-center rounded-lg elevation-5" 
                        color="info"
                    >
                        You can't change your password because you're signed in with Google
                    </p>
                </Transition>
            </v-container>
        </Transition>
    </main>
</template>
<style>
.my-security {
    overflow-x: hidden !important;
}
.my-security-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.my-security-email-warning {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 300px;
    background: white;
    color: #B00020;
    z-index: 2;
}
.verify-link {
    color: black;
}
.my-security-email-warning-enter-active,
.my-security-email-warning-leave-active {
    transition: all 0.8s ease;
}

.my-security-email-warning-enter-from {
    opacity: 0;
    transform: translate(-50%, 100%);
}

.my-security-email-warning-leave-to {
    opacity: 0;
    transform: translate(-50%, 100%);
}
.my-security-wrapper-enter-active {
    transition: all 0.75s ease;
}
.my-security-wrapper-enter-from {
    opacity: 0;
    transform: translateY(100%);
}
</style>
