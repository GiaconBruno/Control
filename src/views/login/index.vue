<template>
    <div class="container position-relative">
      <div class="position-absolute">
        <h1>Control-First</h1>
      </div>
      <div class="row justify-content-center">
        <LogIn />
      </div>
    </div>
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
}

.position-absolute {
  top: 20vh;
  left: auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  color: white;
}

@media screen and (max-width: 768px) {
  .position-absolute {
    position: relative !important;
    top: 0;
    text-align: center;
    padding: 1em 0;
  }
  .col-12 {
    height: auto;
  }
}
</style>