<template>
  <section class="pt-3 pt-lg-5">
    <div v-if="usuario " class="container position-relative">
      <!-- <div class="d-block text-right p-3 pb-2"> </div> -->
      <hr class="mt-0" />
      <div class="row mx-0">
        <div class="col-10 col-lg-9 offset-lg-1 px-0">
          <div class="row mx-0 align-items-center">
            <div class="col-12 col-md-6 px-0">
              <h2 class="m-0">
                <span class="smallText">Bem Vindo, </span>
                {{ usuario.nome }}
                <span v-if="(usuario.permissao)" class="largeText">(Master) </span>
              </h2>
            </div>
            <div class="col-12 col-md-6 px-0">
              <div class="rounded border border-dark p-0 m-0">
                <i @click="changeVisible('contas');" id="todasContas"
                  class="btn fa fa-home text-secundary px-1 mx-2"></i>
                <b-tooltip target="todasContas" triggers="hover" noninteractive> início </b-tooltip>
                <i v-if="(usuario.permissao)" @click="changeVisible('usuarios');" id="todosUsuarios"
                  class="btn fa fa-user-friends text-dark px-1 mx-2"></i>
                <b-tooltip target="todosUsuarios" triggers="hover" noninteractive> Usuários </b-tooltip>
                <i v-if="(usuario.permissao)" @click="changeVisible('usuario')" id="criarUsuario"
                  class="btn fa fa-user-plus text-success px-1 mx-2"></i>
                <b-tooltip target="criarUsuario" triggers="hover" noninteractive> Criar Usuários </b-tooltip>
                <i @click="setEditUsuario(usuario.id)" id="editarUsuario"
                  class="btn fa fa-user-edit text-warning px-1 mx-2"></i>
                <b-tooltip target="editarUsuario" triggers="hover" noninteractive> Editar Usuários </b-tooltip>
                <i @click="changeVisible('conta')" id="criarConta"
                  class="btn fa fa-folder-plus text-primary px-1 mx-2"></i>
                <b-tooltip target="criarConta" triggers="hover" noninteractive> Criar Conta </b-tooltip>
                <i v-show="(['TodasContas','TodosUsuarios'].includes(visible))" @click="refresh()" id="atualizar"
                  class="btn fa fa-redo-alt text-green px-1 mx-2"></i>
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
      <hr class="my-2" />
      <!-- :auth="usuario" -->
      <transition name="anim" mode="out-in">
        <router-view v-if="!loading" v-bind="{setEditUsuario}" />
        <!-- <component :is="visible" v-bind="{usuarioEdit, contaEdit, contaParcela, parcelaEdit}"
          :functions="{changeVisible, setEditUsuario, reset, setEditConta, setConta, setEditParcela}" ref="All"
          class="position-relative" /> -->
        <div v-else class="fas fa-4x fa-spinner fa-pulse text-success my-2" role="status"></div>
      </transition>
    </div>
    <div v-else class="spinner-border spinner-border-lg text-light mt-5 ml-2" role="status"></div>
    <div class="position-fixed p-0" style="top: auto; bottom: 5px; left: 0; right: 0;">
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
  </section>
</template>

<script>
  // import TodosUsuarios from './components/TodosUsuarios';
  // import Usuario from './components/Usuario';
  // import TodasContas from './components/TodasContas';
  // import Conta from './components/Conta';
  // import Parcela from './components/Parcela';
  // import loading from './components/loading';
  export default {
    components: {
      // TodosUsuarios,
      // Usuario,
      // TodasContas,
      // Conta,
      // Parcela,
      // loading,
    },
    data() {
      return {
        loading: false,
        // usuario: null,
        visible: 'TodasContas',
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
      }
    },
    beforeMount() {
      this.$store.commit('GET_ACCESS');
    },
    computed: {
      usuario() {
        return this.$store.state.default.access.auth;
      }
    },
    methods: {
      changeVisible(payload) {
        if (this.$route.path != `/${payload}`) this.$router.push(payload)
      },
      setEditUsuario(payload) {
        this.loading = true;
        this.$store.dispatch('getUserId', payload)
          .then(() => this.changeVisible('usuario'))
          .catch(() => this.$router.push("/contas"))
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
        if (this.visible == "TodasContas") this.$refs.All.getContas();
        else this.$refs.All.getUsuarios();
      },
      sigOut() {
        localStorage.clear();
        this.$store.commit('LOGOUT');
        this.$router.push("/");
      },
    },
  };
</script>

<style scoped>
section {
  min-height: 100vh;
}

.container {
  min-height: calc(100vh - 5.5rem);
  max-height: calc(100vh - 5.5rem);
  border-radius: 5px;
  background: ghostwhite;
  overflow-y: auto;
  overflow-x: hidden;
}

.largeText {
  font-size: large;
}

.smallText {
  font-size: 10px;
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

@media screen and (max-width: 992px) {
  .container {
    min-height: calc(100vh - 3rem);
    max-height: calc(100vh - 3rem);
  }
}

@media screen and (max-width: 767px) {
  .container {
    min-height: calc(100vh - 4rem);
    max-height: calc(100vh - 4rem);
  }
}
</style>