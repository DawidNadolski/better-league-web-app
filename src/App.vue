<template>
  <the-header></the-header>
  <main class="main-content">
    <router-view></router-view>
  </main>
</template>

<script>
import TheHeader from "./components/TheHeader.vue";

export default {
  name: "App",
  components: { TheHeader },
  created() {
    this.$store.dispatch("tryLogin");
  },
};
</script>

<style>
.main-content {
  flex: 1;
}
</style>
