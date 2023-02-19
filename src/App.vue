<script>

</script>

<template>
  <v-theme-provider theme="darkTheme">
    <RouterView />
  </v-theme-provider>
</template>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
body, #app {
  width: 100vw;
  height: 100vh;
}
#app {
  background-color: black
}
</style>
