<template>
  <div class="container px-0 position-relative">
    <div class="row mx-0 h-100 flex-column justify-content-around">
      <div id="login" class="row w-100 mx-0 justify-content-between align-items-center">
        <div class="col-12 col-md-6 text-center text-lg-left align-self-start">
          <h1 class="my-3">Control-First</h1>
        </div>
        <div id="signIn" class="col-12 col-sm-8 mx-auto col-md-6 mx-md-0 col-lg-4">
          <transition name="anim" mode="out-in">
            <router-view />
          </transition>
        </div>
      </div>
      <div class="row mx-0 w-100 align-items-between">
        <div class="col-12 col-lg-6 mx-auto">
          <Footer />
        </div>
        <div class="col-12 mt-2 mx-auto">
          <span class="text-white">Visualizações:
            <span v-if="!loading" id="count" class="px-2"> {{ count }} </span>
            <div v-else id="loading" class="fas fa-spinner fa-pulse" role="status"></div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Footer from './Footer.vue'
  import firebase from "firebase/app";
  import "firebase/firestore"

  export default {
    components: {
      Footer
    },
    data() {
      return {
        loading: false,
        count: 0,
      }
    },
    mounted() {
      this.start();
    },
    methods: {
      start() {
        const config = require("@/services/config.json");
        if (firebase && !firebase.apps.length) firebase.initializeApp(config);
        const db = firebase.firestore()
        const amb = (window.location.hostname === "localhost") ? config.dev : config.prod;
        this.loading = true;
        db.collection('sites').onSnapshot(doc => {
          doc.docChanges().map(change => {
            if (change.type === 'added' && (change.doc.id === amb.main)) {
              db.collection('sites').doc(amb.main).update({
                count: parseInt(change.doc.data().count) + 1,
                hash: amb.hash
              })
            } else if ((change.type === 'modified') && (change.doc.id === amb.main)) {
              this.count = change.doc.data().count
              this.loading = false;
            }
          })
        })
      }
    }
  }
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

  #login {
    min-height: 450px;
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