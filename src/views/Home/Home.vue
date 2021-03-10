<template>
  <section class="py-5">
    <div v-if="usuario && !loading" class="container position-relative">
      <!-- <div class="d-block text-right p-3 pb-2"> </div> -->
      <hr class="mt-0" />
      <div class="row">
        <div class="col-12 col-md-11 offset-md-1 d-flex justify-content-between align-items-center">
          <h2 class="m-0">
            <span class="smallText">Bem Vindo, </span>
            {{ usuario.nome }}
            <span v-if="(usuario.permissao)" class="smallText">(Master) </span>
          </h2>
          <div class="rounded border border-dark p-0 m-0">
            <i @click="changeVisible('TodasContas')" :class="{'disabled': (visible=='TodasContas')}"
              class="btn fa fa-home text-secundary px-1 mx-2"></i>
            <i v-if="(usuario.permissao)" @click="changeVisible('TodosUsuarios')"
              :class="{'disabled': (visible=='TodosUsuarios')}" class="btn fa fa-user-friends text-dark px-1 mx-2"></i>
            <i v-if="(usuario.permissao)" @click="createUsuario()" :class="{'disabled': (visible=='Usuario')}"
              class="btn fa fa-user-plus text-success px-1 mx-2"></i>
            <i @click="setEditUsuario()" :class="{'disabled': (visible=='Usuario')}"
              class="btn fa fa-edit text-warning px-1 mx-2"></i>
            <i @click="createConta()" :class="{'disabled': (visible=='Conta')}"
              class="btn fa fa-folder-plus text-primary px-1 mx-2"></i>
          </div>
          <span @click="sigOut()" class="btn">
            <i class="fas fa-sign-in-alt"></i> Sair
          </span>
        </div>
      </div>
      <hr class="my-2" />
      <component :is="visible" v-bind="{usuarioEdit, contaEdit, contaParcela}" :auth="usuario"
        :functions="{changeVisible, setEditUsuario, reset, tokenValido, setEditConta, setConta}"
        class="position-relative" />
    </div>
    <div v-else class="spinner-border spinner-border-lg text-light mt-5 ml-2" role="status"></div>
  </section>
</template>

<script>
  import TodosUsuarios from './components/TodosUsuarios';
  import Usuario from './components/Usuario';
  import TodasContas from './components/TodasContas';
  import Conta from './components/Conta';
  import Parcela from './components/Parcela';
  export default {
    components: {
      TodosUsuarios,
      Usuario,
      TodasContas,
      Conta,
      Parcela,
    },
    data() {
      return {
        loading: false,
        usuario: null,
        visible: 'TodasContas',
        usuarioEdit: {
          permissao: false,
          ativo: true,
        },
        contaEdit: {},
        contaParcela: {},
      }
    },
    beforeMount() {
      this.tokenValido();
    },
    methods: {
      async tokenValido() {
        let auth = this.auth()
        if (!auth) return

        // let auth = JSON.parse(localStorage.getItem("auth"));
        await this.axios
          .get(`${this.api}/api/usuario/${auth.id}`)
          .then((response) => {
            this.usuario = response.data;
          })
          .catch((err) => {
            console.log("" + err);
            this.$router.push("/");
          });
      },
      async getUsuarios() {
        this.loading = true;
        let auth = JSON.parse(localStorage.getItem("auth"));
        await this.axios
          .get(`${this.api}/api/usuarios`, {
            headers: {
              token: auth.token,
            }
          })
          .then((response) => {
            response.data.map(user => {
              if (auth.id == user.id) this.usuarioEdit = user;
            })
            this.loading = false;
          })
          .catch((err) => {
            console.log("" + err);
            this.$router.push("/");
            this.loading = false;
          });
      },
      changeVisible(payload) {
        this.visible = payload;
      },
      createUsuario() {
        this.reset();
        this.changeVisible('Usuario');
      },
      async setEditUsuario(payload) {
        this.usuarioEdit = payload;
        if (!payload) await this.getUsuarios();
        this.changeVisible('Usuario');
      },
      createConta() {
        this.reset();
        this.changeVisible('Conta');
      },
      setEditConta(payload) {
        this.contaEdit = payload;
        this.changeVisible('Conta')
      },
      setConta(payload) {
        this.contaParcela = payload;
        this.changeVisible('Parcela');
      },
      reset() {
        this.usuarioEdit = {
          permissao: false,
          ativo: true,
        };
        this.contaEdit = {};
      },
      sigOut() {
        localStorage.clear();
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
  min-height: calc(100vh - 6rem);
  max-height: calc(100vh - 6rem);
  border-radius: 5px;
  background: ghostwhite;
  overflow-y: auto;
}

.smallText {
  font-size: large;
}
</style>