<script>
import Header from './components/Header.vue';
import AuthModal from './components/AuthModal.vue';
import AlertSnackbar from './components/AlertSnackbar.vue';
import BasketModal from './components/BasketModal.vue';
  export default {
    data() {
      return {
        currentRoute: null
      };
    },
    components: {
      Header,
      AlertSnackbar,
      AuthModal,
      BasketModal
    },
    methods: {
      closeAlert() {
        this.$store.commit('alertOff');
      },
      closeBasketModal() {
        this.$store.commit('toggleBasketModal', false);
      },
      closeAuthModal() {
        this.$store.commit('toggleAuthModal', false);
      }
    },
    mounted() {
      document.documentElement.style.overflowY = this.htmlOverflow;
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
      },
      htmlOverflow(newValue) {
        document.documentElement.style.overflowY = newValue;
      }
    },
    computed: {
      authModalActive() {
        return this.$store.state.authModalActive;
      },
      basketModalActive() {
        return this.$store.state.basketModalActive;
      },
      isAlertVisible() {
        return this.$store.state.alertData;
      },
      isFetching() {
        return this.$store.state.isFetching;
      },
      htmlOverflow() {
        return this.authModalActive || this.$store.state.filterModalActive || this.$store.state.basketModalActive ? 'hidden' : 'scroll';
      },
      appMarginRight() {
        return this.authModalActive || this.$store.state.filterModalActive || this.$store.state.basketModalActive ? '10px' : '0px';
      }
    }
  };
</script>

<template>
  <v-theme-provider theme="darkTheme">
    <Transition name="header" appear>
      <Header v-show="this.currentRoute !== '/'" />
    </Transition>
    <v-app class="app" :style="{marginRight: appMarginRight}" full-height>
      <router-view v-slot="{ Component }">
        <Transition name="test" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
      <auth-modal :isActive="authModalActive" @closeModal="closeAuthModal"/>
      <alert-snackbar :alertData="isAlertVisible" @closeAlert="closeAlert"/>
      <basket-modal :isActive="basketModalActive" @closeModal="closeBasketModal"/>
      <v-progress-linear class="progress-bar" location="bottom" :active="isFetching" color="surface" height="5" indeterminate></v-progress-linear>
    </v-app>
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
  height: 100%;
  background: white;
}
.page {
  margin-top: calc(64px + 30 * (100vw / 1400)) !important;
  min-height: calc(100% - calc(64px + 30 * (100vw / 1400)));
}
.progress-bar {
  position: fixed !important;
  z-index: 1000;
}
.header-enter-active,
.header-leave-active {
    transition: all 1s ease;
}

.header-enter-from, .header-leave-to {
    transform: translateY(-100px);
}
.test-leave-active {
    transition: all 1s ease;
}
.test-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-thumb {
  background-color: black;
  border: 2px solid white;
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background-color: white;
}
</style>
