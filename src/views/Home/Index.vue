<template>
  <div class="container position-relative">
    <div id="login" class="row mx-0 justify-content-between align-items-center">
      <div class="col-12 col-md-12 text-center text-lg-left align-self-end">
        <h1 class="my-3">Control-First</h1>
      </div>
      <div id="signIn" class="col-12 col-md-6 offset-md-6 col-lg-4 offset-lg-8">
        <transition name="anim" mode="out-in">
          <router-view />
        </transition>
      </div>
      <div class="col-12 col-lg-6 mx-auto">
        <Footer />
      </div>
    </div>
  </div>
</template>

<script>
  import Footer from './Footer.vue'
  export default {
    components: {
      Footer
    },
  };
</script>

<style scoped>
section {
  width: 100vw;
  height: 100vh;
}

#login {
  height: 100vh;
  overflow-x: hidden;
}

.position-absolute {
  top: 20vh;
  left: auto;
  /* font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; */
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

#signIn {
  height: 442px;
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

  #login {
    height: 90vh !important;
    min-height: 580px;
  }
}
</style>