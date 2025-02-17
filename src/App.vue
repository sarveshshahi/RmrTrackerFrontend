<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
<style lang="scss">
// Import Main styles for this application
@import "styles/style";
@import "~@fortawesome/fontawesome-free/css/all.min.css";
#app {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
