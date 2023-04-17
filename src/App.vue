<script>
import Header from './components/Header.vue';
import AuthModal from './components/AuthModal.vue';
import AlertSnackbar from './components/AlertSnackbar.vue';
import BasketModal from './components/BasketModal.vue';
  export default {
    data() {
      return {
        currentRoute: null,
        touchCount: 0
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
      },
      resizeDocumentHeight() {
        this.touchCount +=1;
        if (this.userDeviceIsMobile) {
          if (document.documentElement.style.height !== window.innerHeight) {
            document.documentElement.style.height = window.innerHeight + 'px';
          }
        }
        if (this.touchCount > 5) {
          window.removeEventListener('touchstart', this.resizeDocumentHeight);
        }
      }
    },
    mounted() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        this.$store.commit('toggleUserDevice', true);
        document.documentElement.style.height = window.innerHeight + 'px';
        document.documentElement.style.setProperty('--inner-height', `${window.innerHeight}px`);
        window.addEventListener('touchstart', this.resizeDocumentHeight);
      } else {
        document.documentElement.style.height = '100vh';
      }
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
      isMobile() {
        return this.$store.state.userDeviceIsMobile;
      },
      htmlOverflow() {
        return this.authModalActive || this.$store.state.filterModalActive || this.basketModalActive ? 'hidden' : 'scroll';
      },
      appMarginRight() {
        return this.authModalActive || this.$store.state.filterModalActive || this.basketModalActive ? this.userDeviceIsMobile ? '0px' : '10px' : '0px';
      },
      userDeviceIsMobile() {
        return this.$store.state.userDeviceIsMobile;
      },
      innerHeight() {
        return window.innerHeight;
      }
    }
  };
</script>

<template>
  <v-theme-provider theme="darkTheme">
    <Transition name="header" appear>
      <Header v-show="this.currentRoute !== '/'" />
    </Transition>
    <v-app class="app" v-bind:style="{marginRight: appMarginRight}" full-height>
      <router-view v-slot="{ Component }">
        <Transition name="router-view" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
      <auth-modal :isActive="authModalActive" @closeModal="closeAuthModal"/>
      <alert-snackbar :alertData="isAlertVisible" @closeAlert="closeAlert"/>
      <basket-modal :isActive="basketModalActive" @closeModal="closeBasketModal"/>
      <v-progress-linear 
        class="progress-bar" 
        location="bottom" 
        :active="isFetching" 
        color="surface" 
        height="5" 
        indeterminate 
      >
    </v-progress-linear>
    <v-sheet v-if="isFetching" class="progress-bar-scrim" color="transparent" />
    </v-app>
  </v-theme-provider>
</template>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box !important;
}
.v-application__wrap {
  min-height: auto !important;
}
.v-overlay {
  height: var(--inner-height) !important;
}
body,
#app {
  width: 100%;
  height: 100%;
  background: white;
}
.v-navigation-drawer__scrim {
  position: fixed !important;
}
.page {
  margin-top: calc(64px + 30 * (100vw / 1400)) !important;
  min-height: calc(100% - calc(64px + 30 * (100vw / 1400)));
  width: 100% !important;
}
.progress-bar {
  position: fixed !important;
  z-index: 9999;
}
.progress-bar-scrim {
  position: fixed !important;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.header-enter-active,
.header-leave-active {
    transition: all 1s ease;
}

.header-enter-from, .header-leave-to {
    transform: translateY(-100px);
}
.router-view-leave-active {
    transition: all 1s ease;
}
.router-view-leave-to {
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
