<template>
  <div>
    <h5 class="smallText text-center">Usuários: </h5>
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
        <button @click="removerUsers()" :disabled="loading" class="btn btn-sm btn-success" block>Confirmar
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
        this.usuarios = [];
        let response = await this.common.getUsuarios('todos');
        (response) ? this.usuarios = response: this.$router.push("/");
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

        let response = await this.common.deletarUsuario(this.deletar.id);
        if (response)
          this.$toasted.show(`${response.mensagem}`, {
            iconPack: "fontawesome",
            icon: "check",
            duration: 3000,
            className: "bg-success",
            theme: "bubble",
          });
        else this.$router.push("/");

        this.deletar = null;
        await this.getUsuarios();
        this.loading = false;
      },
      async removerUsers() {
        //DELETAR USUARIO DE CONTAS EXISTENTES
        this.loading = true;
        let response = await this.common.getContas(this.deletar.id);

        if (response) {
          let allContas = response;
          let usersConta;
          let attConta;

          let promise = await this.removeContas(allContas, usersConta, attConta);
          if (promise) await this.deletarUsuario();
        } else this.$router.push("/");

        this.loading = false;
      },
      async removeContas(allContas, usersConta, attConta) {
        let promise = new Promise((resolve) => {
          allContas.map((contas) => {
            usersConta = contas.fk_usuario_id.replace(/[['\]]/g, "").split(",").map(c => parseInt(c));
            if (usersConta.length > 1) { // REMOVE USUARIO E SALVA CONTA
              let pos = usersConta.indexOf(this.deletar.id);
              usersConta.splice(pos, 1);
              usersConta = String(`[${usersConta.map(user => `'${user}'`)}]`)
              attConta = {
                descricao: contas.descricao,
                fk_usuario_id: usersConta,
              }
              this.common.createConta(attConta, `atualizar-conta/${contas.id}`);
            } else if (usersConta.length == 1) { // DELETAR CONTA
              this.common.deletarConta(contas.id)
            }
          })
          resolve(true);
        });
        return promise;
      },
    }
  }
</script>

<style scoped>
.text-sm {
  font-size: 0.8em;
}
</style>