<template>
  <section>
    <h3 class="my-md-2">Mensagens</h3>
    <div class="row mx-0 my-2 my-md-3 justify-content-center">
      <div class="col col-md-auto px-0 px-md-3">
        <b-button @click="getMessage('Received')" :variant="type==1?'info':'outline-info'" class="btn-sm ">Recebidas
        </b-button>
      </div>
      <div class="col col-md-auto px-0 px-md-3">
        <b-button @click="getMessage('Send')" :variant="!type?'secondary':'outline-secondary'" class="btn-sm">Enviadas
        </b-button>
      </div>
      <div class="col col-md-auto px-0 px-md-3">
        <b-button @click="type=2" :variant="type==2?'success':'outline-success'" class="btn-sm">Criar</b-button>
      </div>
    </div>
    <section id="overflow">
      <template v-if="!loading && type!=2">
        <div v-for="(msg, m) in mensagens" :key="msg.id">
          <div @click="see(msg.id)" v-b-toggle="`msg-${msg.id}`"
            :class="[(type)?'alert-info':'alert-secondary', (!msg.status && type)?'font-weight-bold':'font-weight-normal']"
            class="row mx-0 align-items-center alert text-left my-0 px-1 px-md-2 smallText">
            <div v-if="type" class="col-4 px-1 px-md-2"> de: {{ msg.ref_remetente.nome }}
              {{ (access.auth.permissao)? ` (@${msg.ref_remetente.usuario})`:'' }} </div>
            <div v-else-if="!access.auth.permissao" class="col px-1 px-md-2"> para: {{ msg.ref_destinatario.nome }}
            </div>
            <div v-else class="col-4 px-1 px-md-2"> para: {{ msg.ref_destinatario.nome }} </div>
            <div class="col px-1 px-md-2"> {{ msg.titulo }} </div>
            <div class="col-3 col-md-auto px-1 px-md-2 text-center"> {{ formatDate(msg.created_at) }} </div>
            <div v-if="type" class="col-auto px-1 px-md-2">
              <b-icon :id="`iLerMsg${m}`" :icon="`${!msg.status?'eye-fill':'eye-slash-fill'}`" class="mx-1" />
              <b-tooltip :target="`iLerMsg${m}`" triggers="hover" noninteractive> Marcar como Lido </b-tooltip>
              <b-icon @click.prevent="showDeletar(msg)" :id="`iRemoveMsg${m}`" icon="trash-fill" variant="danger"
                class="mx-1" />
              <b-tooltip :target="`iRemoveMsg${m}`" triggers="hover" noninteractive> Deletar Mesangem </b-tooltip>
            </div>
          </div>
          <b-collapse v-if="!deletar.id" :id="`msg-${msg.id}`" accordion="mensagem"
            class="mx-2 rounded-bottom px-1 px-md-2 bg-dark" role="tabpanel">
            <div class="font-weight-light smallText py-1 py-md-2 text-white text-left" v-html="msg.mensagem.replace(/[\r\n]+/g, '<br>')"> </div>
          </b-collapse>
          <div class="mt-2 mt-md-3" />
        </div>
        <p v-if="mensagens.length==0" class="smallText text-secondary mx-0">Nenhuma Mensagem Encontrada!</p>
      </template>
      <template v-else-if="type==2">
        <div class="row mx-0 justify-content-center">
          <div class="col-12 col-lg-6 card border-secondary p-3 text-left">
            <div :class="{'has_errors': errors.includes('titulo')}" class="mb-3">
              <label for="titulo" class="my-0">Título: </label>
              <input v-model="sendMessage.titulo" type="text" name="titulo" id="titulo" class="form-control"
                placeholder="Digite o título da mensagem" />
            </div>
            <div :class="{'has_errors': errors.includes('mensagem')}" class="mb-3">
              <label for="mensagem" class="my-0">Mensagem: </label>
              <textarea v-model="sendMessage.mensagem" name="mensagem" id="mensagem"
                rows="3" class="form-control" placeholder="Digite sua mensagem..."> </textarea>
            </div>
            <template v-if="access.auth.permissao">
              <b-form-checkbox v-if="!sendMessage.destinatario" v-model="sendMessage.all" type="checkbox" name="all"
                id="all" class="text-left mb-3"> Enviar para Todos? </b-form-checkbox>
              <label v-if="!sendMessage.all" for="usuarios" class="text-left my-0">
                Destinatário: </label>
              <select v-if="!sendMessage.all" v-model="sendMessage.destinatario"
                :class="{'text-sm': (sendMessage.destinatario==null)}" name="usuarios" id="usuario"
                class="form-control py-0">
                <option :value="null" class="form-control">Selecione..</option>
                <option v-for="user in usuarios" :key="user.id" :value="user.id" class="form-control">
                  {{ user.nome.split(' ').slice(0,2).join(' ') }} @{{ user.usuario }}
                </option>
              </select>
              <hr />
            </template>
            <p v-else class="m-0 smallText text-left">* Essa mensagem será enviada para o administrador.</p>
            <div class="row mt-3 justify-content-around">
              <button @click="send()" :disabled="loading" class="btn btn-sm btn-success">
                <!-- <b-icon icon="cursor"></b-icon> -->
                <i class="fa fa-fighter-jet"></i>
                Enviar
                <div v-if="loading" class="spinner-border spinner-border-sm ml-2" role="status"></div>
              </button>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="fas fa-4x fa-spinner fa-pulse text-success m-5" role="status"></div>
    </section>
    <b-modal ref="mDelMensagem" id="mDelMensagem" hide-footer centered no-close-on-esc no-close-on-backdrop
      title="Deletar Mensagem">
      <p class="my-4">Deseja deletar a mensagem <strong> {{ deletar.titulo }} </strong> ? </p>
      <hr>
      <div class="row m-0 justify-content-around">
        <button @click="$bvModal.hide('mDelMensagem'); deletar={}" class="btn btn-sm btn-danger" block>Cancelar</button>
        <button @click="delMessage()" :disabled="loadingDel" class="btn btn-sm btn-success" block>Confirmar
          <div v-if="loadingDel" class="spinner-border spinner-border-sm ml-2" role="status"></div>
        </button>
      </div>
    </b-modal>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        loadingDel: false,
        mensagens: [],
        type: 1,
        usuarios: [],
        sendMessage: {
          titulo: '',
          mensagem: '',
          all: false,
          destinatario: null
        },
        deletar: {},
        errors: [],
      }
    },
    beforeMount() {
      this.getMessage('Received');
      this.$store.dispatch('getUserContas')
        .then(response => this.usuarios = response)
        .catch(er => this.toast(er.data.mensagem, 'times'))
    },
    methods: {
      getMessage(payload) {
        this.loading = true;
        this.type = (payload == 'Received') ? 1 : 0;
        this.$store.dispatch(`getNotify${payload}`)
          .then(response => this.mensagens = response)
          .catch(er => this.toast(er.data.mensagem, 'times'))
          .finally(() => this.loading = false)
      },
      see(payload) {
        if (this.type == 1) {
          const find = this.mensagens.findIndex(msg => msg.id == payload);
          this.mensagens[find].status = true;
          this.$store.dispatch('updateStatusNotify', payload)
            .catch(er => this.toast(er.data.mensagem, 'times'))
        }
      },
      valid() {
        this.errors = [];
        if (!this.sendMessage.titulo) this.errors.push('titulo')
        if (!this.sendMessage.mensagem) this.errors.push('mensagem')
        return this.sendMessage.titulo && this.sendMessage.mensagem;
      },
      send() {
        if (!this.valid()) return this.toast('Preencha os campos', 'times')

        this.loading = true;
        const payload = {
          ...this.sendMessage
        }
        if (payload.all) payload.destinatario = null;
        if (payload.destinatario) payload.all = null;
        if (!payload.all) delete payload.all;
        if (!payload.destinatario) delete payload.destinatario;

        this.$store.dispatch(`createNotify`, payload)
          .then(response => {
            this.toast(response.mensagem, 'check')
            this.sendMessage.titulo = '';
            this.sendMessage.mensagem = '';
            this.sendMessage.all = false;
            this.sendMessage.destinatario = null;
          })
          .catch(er => this.toast(er.data.mensagem, 'times'))
          .finally(() => this.loading = false)
      },
      showDeletar(payload) {
        this.deletar = payload;
        this.$bvModal.show('mDelMensagem');
      },
      delMessage() {
        this.loadingDel = true;
        this.$store.dispatch(`deleteNotify`, this.deletar.id)
          .then(response => {
            this.toast(response.mensagem, 'check')
            this.getMessage(this.type ? 'Received' : 'Sent');
            this.deletar = {};
            this.$refs['mDelMensagem'].hide()
          })
          .catch(er => this.toast(er.data.mensagem, 'times'))
          .finally(() => this.loadingDel = false)
      }
    }
  }
</script>

<style scoped>
#overflow {
  overflow-y: auto;
  max-height: calc(85vh - 175px);
}

.smallText {
  font-size: small;
}

.btn {
  min-width: 120px;
}

.has_errors label,
.has_errors input,
.has_errors textarea {
  color: #dc3545;
  border-color: #dc3545;
}

@media screen and (max-width: 768px) {
  #overflow {
    max-height: calc(85vh - 175px);
  }

  .btn {
    min-width: 120px;
  }
}
</style>