<template>
  <div class="container-fluid px-0 mx-0 position-relative">
    <div class="row mx-0 vh-100 flex-column justify-content-around">
      <div id="login" class="row w-100 mx-0 justify-content-between align-items-center">
        <div class="col-12 col-md-6 text-center text-lg-left align-self-start my-0 my-lg-5">
          <h1 class="my-0 my-lg-3">Control-First</h1>
        </div>
        <div id="signIn" class="col-12 col-sm-8 mx-auto col-md-6 mx-md-0 col-lg-4">
          <transition name="anim" mode="out-in">
            <router-view />
          </transition>
        </div>
      </div>
      <div class="row mx-0 w-100 align-items-between">
        <Footer />
        <div class="col-12 mt-2 mx-auto smallText">
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
  import Footer from './Footer.vue';

  import config from '@/services/config.json';
  import * as fireDB from '@/services/firebase.js';
  import * as fireGets from "firebase/firestore";
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
        const amb =
          import.meta.env.DEV ? config.dev : config.prod;
        const fireDBs = fireGets.collection(fireDB.db, "sites");
        this.loading = true;
        fireGets.onSnapshot(fireDBs, doc => {
          doc.docChanges().map(async change => {
            if (change.type === 'added' && (change.doc.id === amb.main)) {
              const docRef = fireGets.doc(fireDBs, amb.main);
              const newCount = parseInt(change.doc.data().count) + 1;

              await fireGets.updateDoc(docRef, {
                count: newCount,
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
    width: 100dvw;
    height: 100dvh;
  }

  .container-fluid {
    height: 100dvh;
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
      transform: translateX(30dvw);
      opacity: 0.5;
    }

    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>