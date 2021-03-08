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
            <i @click="editUsuario(usuario)" class="btn fa fa-edit text-primary p-0 mx-2"></i>
            <i @click="showDeletar(usuario)" class="btn fa fa-trash text-danger p-0 mx-2"></i>
          </div>
        </div>
      </div>
      <div class="col-3 offset-9 text-right" style="font-size: 10px; margin-top: -5px;">
        <span>@ = usuario</span>
      </div>
    </div>
    <div v-else class="spinner-border spinner-border-sm my-2" role="status"></div>
    <div class="row text-center">
      <div class="col-12 mb-3">
        <button @click="functions.changeVisible('TodasContas')"
          class="btn btn-sm btn-light border border-secondary">Voltar</button>
      </div>
    </div>
    <b-modal v-if="deletar" ref="mConfirm" id="mConfirm" hide-footer centered no-close-on-esc no-close-on-backdrop
      title="Deletar Usuário">
      <p class="my-4">Deseja deletar o usuário <strong> {{ deletar.nome }} </strong>?</p>
      <hr>
      <div class="row m-0 justify-content-around">
        <button @click="$bvModal.hide('mConfirm')" class="btn btn-sm btn-danger" block>Cancelar</button>
        <button @click="deletarUsuario()" :disabled="loading" class="btn btn-sm btn-success" block>Confirmar
          <div v-if="loading" class="spinner-border spinner-border-sm ml-2" role="status"></div>
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    props: ['functions'],
    data() {
      return {
        loading: false,
        usuarios: [],
        deletar: {},
      }
    },
    beforeMount() {
      this.getUsuarios();
    },
    methods: {
      async getUsuarios() {
        let auth = JSON.parse(localStorage.getItem("auth"));
        await this.axios
          .get(`${this.api}/api/usuarios`, {
            headers: {
              token: auth.token,
            }
          })
          .then((response) => {
            this.usuarios = response.data;
          })
          .catch((err) => {
            console.log("" + err);
            this.$router.push("/");
          });
      },
      editUsuario(payload) {
        this.functions.setEditUsuario(payload);
      },
      showDeletar(payload) {
        this.deletar = payload;
        this.$refs['mConfirm'].show()
      },
      async deletarUsuario() {
        this.loading = true;
        let auth = JSON.parse(localStorage.getItem("auth"));
        await this.axios
          .delete(`${this.api}/api/deletar-usuario/${this.deletar.id}`, {
            headers: {
              token: auth.token,
            }
          })
          .then((response) => {
            this.$toasted.show(`${response.data.mensagem}`, {
              iconPack: "fontawesome",
              icon: "check",
              duration: 3000,
              className: "bg-success",
              theme: "bubble",
            });
          })
          .catch((err) => {
            console.log("" + err);
            this.$router.push("/");
            this.loading = false;
          });
        this.deletar = null;
        await this.getUsuarios();
        this.loading = false;
      },
    }
  }
</script>

<style scoped>
.text-sm {
  font-size: 0.8em;
}
</style>