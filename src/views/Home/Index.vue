<template>
  <div class="container px-0 position-relative">
    <div class="row mx-0 h-100 flex-column justify-content-center">
      <div id="login" class="row w-100 mx-0 mb-md-5 justify-content-between align-items-center">
        <div class="col-12 col-md-6 text-center text-lg-left align-self-start">
          <h1 class="my-3">Control-First</h1>
        </div>
        <div id="signIn" class="col-12 col-sm-8 mx-auto col-md-6 mx-md-0 col-lg-4">
          <transition name="anim" mode="out-in">
            <router-view />
          </transition>
        </div>
      </div>
      <div class="row mx-0 w-100">
        <div class="col-12 col-lg-6 mx-auto">
          <Footer />
        </div>
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

.container {
  height: 100vh;
  overflow-x: hidden;
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
</style>