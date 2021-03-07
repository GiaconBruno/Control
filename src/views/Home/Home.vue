<template>
  <section class="py-5">
    <div v-if="usuario" class="container position-relative">
      <!-- <div class="d-block text-right p-3 pb-2">
      </div> -->
      <hr class="mt-0" />
      <div class="row">
        <div class="col-12 col-md-11 offset-md-1 d-flex justify-content-between align-items-center">
          <h2>
            <span class="smallText">Bem Vindo, </span> {{ usuario.nome }}
          </h2>
          <div>
            <i v-if="(usuario.permissao)" @click="changeVisible('TodosUsuarios')"
              class="btn fa fa-user-friends text-dark px-1 mx-2"></i>
            <i v-if="(usuario.permissao)" @click="createUsuario()"
              class="btn fa fa-user-plus text-success px-1 mx-2"></i>
            <i class="btn fa fa-folder-plus text-primary px-1 mx-2"></i>
            <span @click="sigOut()" class="btn">
              <i class="fas fa-sign-in-alt"></i> Sair
            </span>
          </div>
        </div>
      </div>
      <hr />
      <component :is="visible" v-bind="{usuarioEdit}" :functions="{changeVisible, setEditUsuario, reset, tokenValido}"
        class="position-relative" />
    </div>
    <div v-else class="spinner-border spinner-border-lg text-light mt-5 ml-2" role="status"></div>
  </section>
</template>

<script>
  import Contas from './components/Contas';
  import TodosUsuarios from './components/TodosUsuarios';
  import Usuario from './components/Usuario';
  export default {
    components: {
      Contas,
      TodosUsuarios,
      Usuario,
    },
    data() {
      return {
        usuario: null,
        visible: 'Contas',
        usuarioEdit: {
          permissao: false,
          ativo: true,
        },
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
      changeVisible(payload) {
        this.visible = payload;
      },
      createUsuario() {
        this.reset();
        this.changeVisible('Usuario');
      },
      setEditUsuario(payload) {
        this.usuarioEdit = payload;
      },
      reset() {
        this.usuarioEdit = {
          permissao: false,
          ativo: true,
        };
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