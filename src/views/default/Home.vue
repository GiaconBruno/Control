<template>
  <div class="container home">
    <div class="btn d-block text-right my-3 p-0">
      <span @click="sigOut()">
        <i class="fas fa-sign-in-alt"></i> Sair
      </span>
    </div>
    <img alt="Vue logo" src="@/assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  beforeMount() {
    let auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth.auth) this.$router.push("/");
  },
  methods: {
    sigOut() {
      localStorage.clear();
      this.$router.push("/");
    },
  },
};
</script>