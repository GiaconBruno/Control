<template>
  <div class="row mx-0 px-1 h-100 flex-column justify-content-center">
    <div v-if="usuario" class="container px-2 position-relative">
      <!-- <div class="d-block text-right p-3 pb-2"> </div> -->
      <div class="row mx-0 my-3">
        <div class="col-10 col-lg-9 offset-lg-1 px-0">
          <div class="row mx-0 align-items-center">
            <div class="col-12 col-md-6 px-0">
              <h2 class="m-0">
                <span class="smallText">Bem Vindo, </span>
                <span>{{ usuario.nome }}</span>
                <span v-if="(usuario.permissao)" class="largeText">(Master) </span>
              </h2>
            </div>
            <div class="col-12 col-md-6 px-0">
              <div class="rounded border border-dark p-0 m-0">
                <i v-show="($route.path != '/dashboard')" @click="changeVisible('dashboard');" id="home"
                  class="btn fa fa-home text-secundary px-0 px-md-1 mx-2"></i>
                <b-tooltip target="home" triggers="hover" noninteractive> Início </b-tooltip>
                <i v-if="(usuario.permissao)" @click="changeVisible('usuarios');" id="todosUsuarios"
                  class="btn fa fa-user-friends text-dark px-0 px-md-1 mx-2"></i>
                <b-tooltip v-if="(usuario.permissao)" target="todosUsuarios" triggers="hover" noninteractive>
                  Usuários </b-tooltip>
                <i v-if="(usuario.permissao)" @click="changeVisible('usuario')" id="criarUsuario"
                  class="btn fa fa-user-plus text-success px-0 px-md-1 mx-2"></i>
                <b-tooltip v-if="(usuario.permissao)" target="criarUsuario" triggers="hover" noninteractive>
                  Criar Usuários </b-tooltip>
                <i @click="setEditUsuario(usuario.id)" id="editarUsuario"
                  class="btn fa fa-user-edit text-warning px-0 px-md-1 mx-2"></i>
                <b-tooltip target="editarUsuario" triggers="hover" noninteractive> Editar Usuários </b-tooltip>
                <i v-if="(usuario.permissao)" @click="changeVisible('todas-contas')" id="TodasConta"
                  class="btn fa fa-file-alt text-primary px-0 px-md-1 mx-2"></i>
                <b-tooltip v-if="(usuario.permissao)" target="TodasConta" triggers="hover" noninteractive> Todas as
                  Conta </b-tooltip>
                <i @click="changeVisible('conta')" id="criarConta"
                  class="btn fa fa-folder-plus text-primary px-0 px-md-1 mx-2"></i>
                <b-tooltip target="criarConta" triggers="hover" noninteractive> Criar Conta </b-tooltip>
                <i v-show="(['/dashboard','/entradas', '/saidas','/usuarios','/todas-contas'].includes($route.path))"
                  @click="refresh()" id="atualizar" class="btn fa fa-redo-alt text-green px-0 px-md-1 mx-2"></i>
                <b-tooltip target="atualizar" triggers="hover" noninteractive> Atualizar </b-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div class="col-2 px-0">
          <div class="row mx-0 align-items-center justify-content-end h-100">
            <span @click="sigOut()" class="btn">
              <i class="fas fa-sign-in-alt"></i> Sair
            </span>
          </div>
        </div>
      </div>
      <!-- <hr class="my-2" /> -->
      <!-- :auth="usuario" -->
      <transition name="anim" mode="out-in">
        <router-view v-if="!loading" v-bind="{setEditUsuario}" ref="All" @changeVisible="changeVisible($event)" />
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
  import Footer from './Footer.vue'
  export default {
    components: {
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
      }
    },
    methods: {
      changeVisible(payload) {
        let tipo = (this.$route.path == '/entradas') ? 'E' : 'S';
        if (this.$route.path != `/${payload}`) this.$router.push({
          path: `/${payload}`,
          query: {
            tipo: tipo
          }
        })
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
            this.$refs.All.getDash();
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
        localStorage.clear();
        this.$router.push("/");
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