<template>
  <div class="container position-relative">
    <div class="position-absolute">
      <h1>Control-First</h1>
    </div>
    <div class="row mx-0 justify-content-center ">
      <div class="col-12 col-md-6 col-lg-4 offset-lg-8 d-flex align-items-center">
        <transition name="anim">
          <component :is="visible" v-bind="{changeVisible}" />
        </transition>
      </div>
    </div>
    <div class="position-absolute p-0" style="top:auto;bottom:5px;left:0;right:0;">
      <div class="row m-0 justify-content-between align-items-center">
        <div class="col-6 col-md-4 px-0">
          <span class="text-white smallText">Desenvolvido por: Bruno Giacon</span>
        </div>
        <div class="col-6 col-md-4 px-0">
          <span>
            <a href="http://github.com/giaconbruno" target="_blank" class="text-white smallText text-underline">
              github.com/giaconbruno</a>
          </span>
        </div>
        <div class="col-6 offset-3 col-md-4 offset-md-0 px-0">
          <span class="text-white smallText">email: giacon_bruno@hotmail.com</span>
        </div>
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
  overflow-x: hidden;
}

.position-absolute {
  top: 20vh;
  left: auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  color: white;
}

.smallText {
  font-size: 12px;
}

.text-underline {
  text-decoration: underline;
}

.anim-enter-active {
  min-width: 100%;
  animation: home 1.6s;
}

.anim-leave-active {
  min-width: 100%;
  animation: home 0.6s;
  animation-direction: reverse;
}

@keyframes home {
  from {
    transform: translateX(30vw);
    opacity: 0.5;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
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