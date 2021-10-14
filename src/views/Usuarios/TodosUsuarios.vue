<template>
  <div class="overflow">
    <h5 class="smallText my-0 text-center">({{ usuarios.length }}) Usuários: </h5>
    <filterable v-bind="{filter}" @change="filter=$event" />
    <div v-if="usuarios.length" class="row m-0">
      <div v-for="(usuario, i) in usuarios" :key="usuario.id" v-show="filtring(usuario)"
        class="col-12 card border-secondary alert-info mb-2 py-1 rounded">
        <div class="row align-items-center">
          <div class="col-10 col-lg-11 pl-1 pl-lg-3 pr-0 py-lg-0">
            <div class="row mx-0 text-left align-items-center">
              <div class="col col-lg px-0">
                <div class="row mx-0 justify-content-between align-items-center">
                  <span class="text-sm text-lg-sm">
                    <strong>{{ [usuario.nome.split(' ')[0],usuario.nome.split(' ')[1]].join(' ')}}</strong> -
                    @{{ usuario.usuario }}
                  </span>
                  <span class="text-xs text-sm"> {{ usuario.acesso || 'Nenhum' }}</span>
                </div>
              </div>
              <div class="col-12 col-lg-3 px-0 px-lg-3">
                <div class="row justify-content-around align-items-center text-center text-sm">
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
    <div class="row mx-0 text-center">
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
        filter: [{
          name: 'Permissão',
          type: ['Todos', 'Sim', 'Não'],
          value: null,
        }, {
          name: 'Ativo',
          type: ['Todos', 'Sim', 'Não'],
          value: null,
        }, {
          name: 'Nome',
          type: 'Text',
          value: '',
        }]
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
              if (user.acesso) user.acesso = this.formatDate(user.acesso)
            })
          })
          .catch(er => this.toast(er.data.mensagem, 'times'))
          .finally(() => this.loading = false)
      },
      showDeletar(payload) {
        this.deletar = payload;
        this.$refs['mConfirm'].show()
      },
      deletarUsuario() {
        this.loading = true;
        //DELETAR USUARIO PERMANENTEMENTE
        this.$store.dispatch('deleteUser', this.deletar.id)
          .then(response => this.toast(response.mensagem, 'check'))
          .catch(er => this.toast(er.data.mensagem, 'times'))
          .finally(() => {
            this.loading = false
            this.deletar = null;
            this.$refs['mConfirm'].hide()
            this.getUsuarios();
          })
      },
      filtring(user) {
        const has = (payload) => this.filter[this.filter.findIndex(f => f.name == payload)].value

        const usuarioPermissao = () => (user.permissao == has('Permissão')) || (has('Permissão') == null)

        const usuarioAtivo = () => (user.ativo == has('Ativo')) || (has('Ativo') == null)

        const usuarioNome = () => (has('Nome') == '') ||
          (((user.nome.toLowerCase()).replace(has('Nome').toLowerCase(), '')) != (user.nome.toLowerCase()))

        return usuarioPermissao() && usuarioAtivo() && usuarioNome()
      }
    }
  }
</script>

<style scoped>
.overflow {
  /* overflow-x: hidden; */
  overflow-y: auto;
  max-height: calc(90vh - 70px);
}

.text-sm {
  font-size: 0.8em;
}

.text-xs {
  font-size: x-small;
}

@media screen and (min-width: 1200px) {
  .text-sm {
    font-size: 0.8em;
  }

  .text-lg-sm {
    font-size: medium;
  }
}

@media screen and (max-width: 768px) {
  .overflow {
    max-height: calc(80vh - 103px);
  }
}
</style>