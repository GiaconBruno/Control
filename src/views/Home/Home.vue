<template>
  <div class="row mx-0 px-1 h-100 flex-column justify-content-center">
    <div v-if="usuario" class="container px-2 position-relative">
      <!-- <div class="d-block text-right p-3 pb-2"> </div> -->
      <div class="row mx-0 mt-2 my-md-3 justify-content-around">
        <div class="col col-lg-10 px-0">
          <div class="row mx-0 align-items-center justify-content-center">
            <div class="col-12 col-md-6 px-0">
              <h2 class="m-0">
                <span class="smallText">Bem Vindo, </span>
                <span>{{ usuario.nome }}</span>
                <span v-if="(usuario.permissao)" class="largeText">(Master) </span>
              </h2>
            </div>
            <Header v-if="!extra" @CV="changeVisible($event)" @SEU="setEditUsuario($event)" @R="refresh()" />
          </div>
        </div>
        <div class="col-1 col-lg-auto px-0 my-auto mx-2 mx-lg-auto">
          <span @click="sigOut()" class="btn px-0">
            <i class="fas fa-sign-in-alt"></i> Sair
          </span>
        </div>
      </div>
      <!-- <hr class="my-2" /> -->
      <!-- :auth="usuario" -->
      <transition name="anim" mode="out-in">
        <router-view v-if="!loading" ref="All" @CV="changeVisible($event)" @SEU="setEditUsuario($event)"
          @R="refresh()" />
        <div v-else class="fas fa-4x fa-spinner fa-pulse text-success my-2" role="status"></div>
      </transition>
    </div>
    <div v-else class="spinner-border spinner-border-lg text-light mt-5 ml-2" role="status"></div>
    <div class="row mx-0 w-100">
      <div class="col-12 col-lg-8 mx-auto">
        <Footer />
      </div>
    </div>
  </div>
</template>

<script>
  import Header from './Header.vue'
  import Footer from './Footer.vue'
  export default {
    components: {
      Header,
      Footer
    },
    data() {
      return {
        loading: false,
        usuarioEdit: {
          permissao: false,
          ativo: true,
        },
        contaEdit: {},
        contaParcela: {},
        parcelaEdit: {},
      }
    },
    watch: {
      $route(to, from) {
        if (from.path == '/usuario') this.$store.commit('SET_EDIT_USER');
        if (from.path == '/conta') this.$store.commit('SET_EDIT_CONTA');
        if (from.path == '/parcela') {
          this.$store.commit('SET_CONTA_PARCELA');
          this.$store.commit('SET_EDIT_PARCELA');
        }
      }
    },
    beforeMount() {
      this.$store.commit('GET_ACCESS');
    },
    computed: {
      usuario() {
        return this.access.auth;
      },
      extra() {
        return ['/dashboard', '/settings', '/logs'].includes(this.$route.path)
      }
    },
    methods: {
      changeVisible(payload) {
        this.$store.commit('SET_CONTA_TIPO', (this.$route.path == '/entradas') ? 'E' : 'S');
        if (this.$route.path != `/${payload}`) this.$router.push(`/${payload}`)
      },
      setEditUsuario(payload) {
        this.loading = true;
        this.$store.dispatch('getUserId', payload)
          .then(() => this.changeVisible('usuario'))
          .catch(er => this.toast(er.data.mensagem, 'times'))
          .finally(() => this.loading = false)
      },
      setEditParcela(payload) {
        this.parcelaEdit = payload;
        this.changeVisible('Parcela')
      },
      setConta(payload) {
        this.reset();
        this.contaParcela = payload;
        this.changeVisible('Parcela');
      },
      reset() {
        this.usuarioEdit = {
          permissao: false,
          ativo: true,
        };
        this.contaEdit = {};
        this.parcelaEdit = {};
      },
      refresh() {
        switch (this.$route.path) {
          case '/dashboard':
            // this.$refs.All.getMessage();
            this.$refs.All.getDash(true);
            // this.$refs.All.getGraphic(true);
            break;
          case '/entradas':
          case '/saidas':
          case '/todas-contas':
            this.$refs.All.getContas();
            break;
          case '/usuarios':
            this.$refs.All.getUsuarios();
            break;
        }
      },
      sigOut() {
        this.$store.commit('LOGOUT');
        this.$router.push("/");
        localStorage.clear();
      },
    },
  };
</script>

<style scoped>
.container.position-relative {
  min-height: 85vh;
  max-height: 85vh;
  border-radius: 5px;
  background: ghostwhite;
  overflow-y: hidden;
  overflow-x: hidden;
}

.largeText {
  font-size: large;
}

.smallerText {
  font-size: smaller;
}

.smallText {
  font-size: small;
}

.text-underline {
  text-decoration: underline;
}

.anim-enter-active {
  animation: home 0.6s;
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