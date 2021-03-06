<template>
  <div>
    <div v-if="usuarios.length" class="row m-0">
      <div v-for="usuario in usuarios" :key="usuario.id"
        class="col-12 card border-secondary alert-info mb-2 py-1 rounded">
        <div class="row align-items-center">
          <div class="col-9 col-lg-11 py-lg-0">
            <div class="row text-lg-left align-items-center">
              <div class="col-12 col-lg-6">
                <span class="text-sm">Usuário: </span>
                <strong>{{usuario.nome}}</strong> - @{{ usuario.usuario }}
              </div>
              <div class="col-12 col-lg-4">
                <div class="row justify-content-around align-items-center text-sm">
                  <div class="col-6">
                    <span>Permissão: </span>
                    <i :class="(usuario.permissao) ? 'fa-check text-success': 'fa-times text-danger'"
                      class="fa mx-1"></i>
                  </div>
                  <div class="col-6">
                    <span>Ativo: </span>
                    <i :class="(usuario.ativo) ? 'fa-check text-success': 'fa-times text-danger'" class="fa mx-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col px-0">
            <i class="btn fa fa-edit text-primary p-0 mx-2"></i>
            <i class="btn fa fa-trash text-danger p-0 mx-2"></i>
          </div>
        </div>
      </div>
      <span class="text-white">@ - usuario</span>
    </div>
    <div v-else class="spinner-border spinner-border-sm ml-2" role="status"></div>
    <div class="row text-center">
      <div class="col-12">
        <button @click="functions.changeVisible('Contas')"
          class="btn btn-sm btn-light border border-secondary">Voltar</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['functions'],
    data() {
      return {
        usuarios: [],
      }
    },
    beforeMount() {
      this.getUsuarios();
    },
    methods: {
      async getUsuarios() {
        let auth = JSON.parse(localStorage.getItem("auth"));
        await this.axios
          .post(`${this.api}/api/usuarios`, {
            token: auth.token,
          })
          .then((response) => {
            this.usuarios = response.data;
          })
          .catch((err) => {
            console.log("" + err);
            this.$toasted.show("Ocorreu um erro!", {
              iconPack: "fontawesome",
              icon: "times",
              duration: 3000,
              className: "bg-danger",
              theme: "bubble",
            });
            this.functions.changeVisible('Contas');
          });
      }
    }
  }
</script>

<style scoped>
.text-sm {
  font-size: 0.8em;
}
</style>