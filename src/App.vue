<script>
import Header from './components/Header.vue';
import LoginModal from './components/LoginModal.vue';
import RegistrationModal from './components/RegistrationModal.vue';
import AlertSnackbar from './components/AlertSnackbar.vue';
  export default {
    data() {
      return {
        currentRoute: null
      };
    },
    components: {
      Header,
      LoginModal,
      RegistrationModal,
      AlertSnackbar
    },
    methods: {
      closeLoginModal() {
        this.$store.commit('toggleLoginModal', false);
      },
      closeRegModal() {
        this.$store.commit('toggleRegModal', false);
      },
      closeAlert() {
        this.$store.commit('alertOff');
      }
    },
    mounted() {
      if (localStorage.getItem('token')) {
        this.$store.dispatch('checkAuth');
      }
    },
    watch: {
      '$route.path': {
        handler() {
          this.currentRoute = this.$route.path;
        },
        immediate: true
      }
    },
    computed: {
      loginModalActive() {
        return this.$store.state.loginModalActive;
      },
      regModalActive() {
        return this.$store.state.regModalActive;
      },
      isAlertVisible() {
        return this.$store.state.alertData;
      },
      isFetching() {
        return this.$store.state.isFetching;
      }
    }
  };
</script>

<template>
  <v-theme-provider theme="darkTheme">
    <Transition name="header" appear>
      <Header v-show="this.currentRoute !== '/'" />
    </Transition>
    <RouterView />
    <login-modal :isActive="loginModalActive" @closeModal="closeLoginModal" />
    <registration-modal :isActive="regModalActive" @closeModal="closeRegModal" />
    <alert-snackbar :alertData="isAlertVisible" @closeAlert="closeAlert"/>
    <v-progress-linear :active="isFetching" absolute location="bottom" color="background" height="5" indeterminate></v-progress-linear>
  </v-theme-provider>
</template>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box !important;
}
body,
#app {
  width: 100%;
  height: 100vh;
}
.page {
  margin-top: calc(64px + 30 * (100vw / 1400)) !important;
  min-height: calc(100% - calc(64px + 30 * (100vw / 1400)));
}
.header-enter-active,
.header-leave-active {
    transition: all 1s ease;
}

.header-enter-from, .header-leave-to {
    transform: translateY(-100px);
}
</style>
