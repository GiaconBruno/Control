<template>
  <section>
    <div class="container">
      <div class="row justify-content-center">
        <LogIn />
      </div>
    </div>
  </section>
</template>

<script>
import LogIn from "./components/login.vue";
export default {
  components: {
    LogIn,
  },
};
</script>

<style scoped>
section {
  width: 100vw;
  height: 100vh;
  background: #093028;
  background: -webkit-linear-gradient(to bottom, #237a57, #093028);
  background: linear-gradient(to bottom, #237a57, #093028);
}
</style>