<template>
  <div>
    <h5 class="smallText text-center">Usuários: </h5>
    <div v-if="usuarios.length" class="row m-0">
      <div v-for="(usuario, i) in usuarios" :key="usuario.id"
        class="col-12 card border-secondary alert-info mb-2 py-1 rounded">
        <div class="row align-items-center">
          <div class="col-10 col-lg-11 pr-0 py-lg-0">
            <div class="row mx-0 text-left align-items-center">
              <div class="col col-lg px-0">
                <div class="row mx-0 justify-content-between">
                  <span>
                    <span class="text-sm">Usuário: </span>
                    <strong>{{ [usuario.nome.split(' ')[0],usuario.nome.split(' ')[1]].join(' ')}}</strong> -
                    @{{ usuario.usuario }}
                  </span>
                  <span>
                    <span class="text-sm"> {{ usuario.acesso || 'Nenhum' }}</span>
                  </span>
                </div>
              </div>
              <div class="col-12 col-lg-3 px-0 px-lg-3">
                <div class="row justify-content-around align-items-center text-sm">
                  <div class="col-6 pr-0">
                    <span>Permissão: </span>
                    <i :class="(usuario.permissao) ? 'fa-check text-success': 'fa-times text-danger'"
                      class="fa mx-1"></i>
                  </div>
                  <div class="col-6 pr-0">
                    <span>Ativo: </span>
                    <i :class="(usuario.ativo) ? 'fa-check text-success': 'fa-times text-danger'" class="fa mx-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col px-0">
            <i @click="setEditUsuario(usuario.id)" :id="`usuarioEditar${i}`"
              class="btn fa fa-edit text-primary p-0 mx-1 mx-lg-2"></i>
            <b-tooltip :target="`usuarioEditar${i}`" triggers="hover" noninteractive> Editar Usuário </b-tooltip>
            <i @click="showDeletar(usuario)" :id="`usuarioRemove${i}`" class="btn fa fa-trash text-danger p-0 mx-2"></i>
            <b-tooltip :target="`usuarioRemove${i}`" triggers="hover" noninteractive> Deletar Usuário
            </b-tooltip>
          </div>
        </div>
      </div>
      <div class="col-3 offset-9 text-right" style="font-size: 10px; margin-top: -5px;">
        <span>@ = usuario</span>
      </div>
    </div>
    <div v-else class="fas fa-4x fa-spinner fa-pulse text-success my-2" role="status"></div>
    <div class="row text-center">
      <div class="col-12 mb-3">
        <button @click="$router.go(-1)" class="btn btn-sm btn-light border border-secondary">Voltar</button>
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
    props: ['setEditUsuario'],
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
      getUsuarios() {
        this.usuarios = [];
        this.loading = true;
        this.$store.dispatch('getUsers')
          .then(response => {
            this.usuarios = response
            this.usuarios.map(user => {
              if (user.acesso) {
                user.acesso = user.acesso.split('T')
                user.acesso[0] = user.acesso[0].split('-').reverse().join('/')
                user.acesso[1] = user.acesso[1].slice(0, -5)
                user.acesso = user.acesso.join(' ')
              }
            })
          })
          .catch(() => this.$router.push("/"))
          .finally(() => this.loading = false)
      },
      showDeletar(payload) {
        this.deletar = payload;
        this.$refs['mConfirm'].show()
      },
      deletarUsuario() {
        this.loading = true;
        //DELETAR USUARIO DE CONTAS EXISTENTES
        this.$store.dispatch('getContasId', this.deletar.id)
          .then(response => {
            response.map((contas) => {
              let usersConta = contas.fk_usuario_id.replace(/[['\]]/g, "").split(",").map(c => parseInt(c));
              if (usersConta.length > 1) { // REMOVE USUARIO E SALVA CONTA
                let pos = usersConta.indexOf(this.deletar.id);
                usersConta.splice(pos, 1);
                usersConta = String(`[${usersConta.map(user => `'${user}'`)}]`)
                let attConta = {
                  descricao: contas.descricao,
                  fk_usuario_id: usersConta,
                }
                this.$store.commit('SET_EDIT_CONTA', contas)
                this.$store.dispatch('updateConta', attConta)
                  .catch((error) => console.log(error))
              } else if (usersConta.length == 1) { // DELETAR CONTA
                this.$store.dispatch('deletarConta', contas.id)
                  .catch((error) => console.log(error))
              }
            })
          })
          .catch(() => this.$router.push("/"))
          .finally(() => {
            //DELETAR USUARIO PERMANENTEMENTE
            this.$store.dispatch('deletarUser', this.deletar.id)
              .then(response => {
                this.$toasted.show(`${response.mensagem}`, {
                  iconPack: "fontawesome",
                  icon: "check",
                  duration: 3000,
                  className: "bg-success",
                  theme: "bubble",
                });
              })
              .catch(() => this.$router.push("/"))
              .finally(() => {
                this.loading = false
                this.deletar = null;
                this.$refs['mConfirm'].hide()
                this.getUsuarios();
              })
          })
      },
    }
  }
</script>

<style scoped>
.text-sm {
  font-size: 0.8em;
}
</style>