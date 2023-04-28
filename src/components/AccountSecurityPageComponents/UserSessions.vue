<script>
export default {
    mounted() {
        if (!this.sessions) {
            this.$store.dispatch('getUserSessions', {id: this.userId});
        }
    },
    unmounted() {
        this.$store.commit('clearSessions');
    },
    methods: {
        deviceIcon(device) {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(device) ? 'mdi-cellphone' : 'mdi-monitor';
        },
        closeSession(session) {
            this.$store.dispatch('closeSession', {sessionId: session, userId: this.userId});
        }
    },
    computed: {
        userId() {
            return this.$store.state.user.id;
        },
        sessions() {
            return this.$store.state.userSessions;
        }
    }
}
</script>
<template>
    <Transition name="my-security-sessions">
        <v-sheet
            v-if="sessions"
            class="my-security-sessions mt-4" 
            color="background"
        >
            <p class="my-security-sessions-title text-button text-center mb-4">
                Your current sessions
            </p>
            <v-sheet class="my-security-session-wrapper" color="background">
                <p 
                    v-for="session in sessions" 
                    class="my-security-session text-caption elevation-3 py-3 pl-6 pr-8 my-2 mx-1 rounded-lg"
                >
                <v-badge v-if="session.current" location="top start" content="now" color="success">
                    <v-icon class="mr-2" :icon="deviceIcon(session.device)" size="large" />
                </v-badge>
                <v-icon v-else class="mr-2" :icon="deviceIcon(session.device)" size="large"/>
                    {{ session.device }}
                    <button-ui
                        v-if="!session.current"
                        class="my-security-session-stop-btn"
                        :set="['t', 'e', '1', 'mdi-delete-forever']"
                        @click="closeSession(session.id)"
                    />
                </p>
            </v-sheet>
        </v-sheet>
        <p v-else class="my-security-session-warning text-button text-center mt-8 pa-1 rounded-lg">
            Try reloading the page, if that doesn't work try again later.
        </p>
    </Transition>
</template>
<style>
.my-security-sessions {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.my-security-session {
    position: relative;
    display: flex;
    align-items: center;
}
.my-security-session-wrapper {
    width: 100%;
    max-width: 1000px;
}
.my-security-session-stop-btn {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
}
.my-security-sessions-enter-active,
.my-security-sessions-leave-active {
    transition: all 0.8s ease;
}

.my-security-sessions-enter-from {
    opacity: 0;
    transform: translateX(100%);
}
.my-security-session-warning {
    background: rgba(255, 0, 0, 0.2);
}
.my-security-sessions-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
@media (max-width: 500px) {
    .my-security-session {
        min-height: 72px;
    }
}
</style>
