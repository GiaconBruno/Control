<template>
  <div class="container position-relative">
    <div class="position-absolute">
      <h1>Control-First</h1>
    </div>
    <div class="row mx-0 justify-content-center ">
      <div class="col-12 col-md-6 col-lg-4 offset-lg-8 d-flex align-items-center">
        <component :is="visible" v-bind="{changeVisible}" />
      </div>
    </div>
  </div>
</template>

<script>
  import LogIn from "./components/Login";
  import Usuario from "../Home/components/Usuario";
  export default {
    components: {
      LogIn,
      Usuario,
    },
    data() {
      return {
        visible: 'LogIn',
      }
    },
    methods: {
      changeVisible(payload) {
        this.visible = payload;
      }
    }
  };
</script>

<style scoped>
section {
  width: 100vw;
  height: 100vh;
}

.col-12 {
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