<script>
import Header from './components/Header.vue';
  export default {
  data() {
    return {
      currentRoute: null
    };
  },
  watch: {
    '$route.path': {
      handler() {
        this.currentRoute = this.$route.path;
      },
      immediate: true
    }
  },
  components: {
    Header
  }
};
</script>

<template>
  <v-theme-provider theme="darkTheme">
    <Transition name="header" appear>
      <Header v-show="this.currentRoute !== '/'" />
    </Transition>
    <RouterView />
  </v-theme-provider>
</template>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
body,
#app {
  width: 100vw;
  height: 100vh;
}
.header-enter-active,
.header-leave-active {
    transition: all 1s ease;
}

.header-enter-from, .header-leave-to {
    transform: translateY(-100px);
}
</style>
