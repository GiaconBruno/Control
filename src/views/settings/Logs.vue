<template>
  <section>
    <div class="row mx-0 justify-content-center">
      <Header @R="$emit('R')" @CV="$emit('CV', $event)" @SEU="$emit('SEU',$event)" />
    </div>
    <div class="row mx-0 my-2 flex-column flex-lg-row">
      <!-- <div class="row mx-0 justify-content-center">
        <div v-for="amb in 2" :key="`amb-${amb}`" @click="ambiente=(amb-1)"
          :class="(amb==1)?'bg-warning':'bg-success text-white'"
          class="btn col-auto d-flex align-items-center py-0 px-2 mx-2 rounded smallText">
          <b-icon v-if="ambiente==(amb-1)" icon="check-square" />
          <b-icon v-else icon="x-square" />
          <span class="px-1">{{ (amb==1)?'Desenvolvimento':'Produção' }}</span>
        </div>
      </div> -->
      <div class="row mx-auto px-0 px-lg-2 justify-content-center align-items-center">
        <small class="d-none d-lg-block px-3">Período: </small>
        <small><input v-model="periodo" type="date" class="form-control px-1" /></small>
        <small class="d-none d-lg-block px-3">Status: </small>
        <div v-for="s in status" :key="s.title" @click="getLogs(s.title, $refs.page.pagination)"
          class="btn px-0 pl-1 px-lg-3 text-white smallText">
          <p :class="s.color" class="rounded py-1 px-1 m-0 d-flex align-items-center">
            <b-icon v-if="type==s.title" icon="check-square" />
            <b-icon v-else icon="x-square" />
            <small class="px-2">{{ s.title }}</small>
          </p>
        </div>
      </div>
    </div>
    <div id="overflow">
      <template v-if="!loading">
        <template v-if="info.length">
          <div v-for="(log, i) in info" :key="`info-${i}`" v-b-toggle="`log-${i}`"
            :class="(log.status==200)?'alert-success':(log.status==500)?'alert-danger':'alert-warning'"
            class="btn w-100 mx-0 px-2 mx-0 alert smallText">
            <div class="row justify-content-around align-items-center mx-0">
              <div class="col-auto px-0"> {{ showDate(log.createdAt) }} </div>
              <div class="col-auto px-0"> {{ log.status }} </div>
              <div class="col-auto px-0"> {{ (log.ref_usuario)?`@${log.ref_usuario.usuario}`:'-' }} </div>
              <div class="col-7 px-0 text-left xSmallText"> {{ log.rota }} </div>
              <div @click.stop="showDeletar(log)" class="col-auto px-0">
                <b-icon :id="`iRemoveLog${i}`" icon="trash" variant="danger" />
                <b-tooltip :target="`iRemoveLog${i}`" triggers="hover" noninteractive> Deletar Log </b-tooltip>
              </div>
            </div>
            <b-collapse :id="`log-${i}`" accordion="logs" role="tabpanel">
              <div @click.prevent="" class="row mx-0 py-2 text-left">
                <div class="col col-lg px-0 my-2 mx-2 mx-lg-1 my-lg-0 bg-dark rounded">
                  <div class="code p-2 text-white" v-html="formatCode(log.request)"></div>
                </div>
                <div class="col col-lg px-0 my-2 mx-2 mx-lg-1 my-lg-0 bg-dark rounded">
                  <div class="code p-2 text-white" v-html="formatCode(log.response)"></div>
                </div>
              </div>
            </b-collapse>
          </div>
        </template>
        <p v-else class="mx-0">Nenhum registro encontrado!</p>
      </template>
      <div v-else class="fas fa-4x fa-spinner fa-pulse text-success m-5" role="status"></div>
    </div>
    <Pagination ref="page" @change="getLogs(type, $event)" />
    <b-modal ref="mDelLog" id="mDelLog" hide-footer centered no-close-on-esc no-close-on-backdrop title="Deletar Conta">
      <p class="my-4">Deseja deletar o log <strong> {{ deletar.id }} </strong> de <strong>
          {{ formatDate(deletar.createdAt) }} </strong> ?</p>
      <p class="my-4">Clique em <strong> Deletar Todos </strong> para deletar todos os registros do dia
        (<strong>{{ periodo.split('-').reverse().join('/') }} </strong>).</p>
      <hr>
      <div class="row m-0 justify-content-around">
        <button @click="$bvModal.hide('mDelLog')" class="btn btn-sm btn-danger" block>Cancelar</button>
        <button @click="deletarLog(true)" :disabled="loadingDel" class="btn btn-sm btn-success" block>Confirmar
          <div v-if="loadingDel" class="spinner-border spinner-border-sm ml-2" role="status"></div>
        </button>
        <button @click="deletarLog()" :disabled="loadingDel" class="btn btn-sm btn-warning" block>Deletar Todos
          <div v-if="loadingDel" class="spinner-border spinner-border-sm ml-2" role="status"></div>
        </button>
      </div>
    </b-modal>
  </section>
</template>

<script>
  import Header from '../Home/Header.vue';
  import Pagination from '../components/Pagination.vue';
  export default {
    components: {
      Header,
      Pagination
    },
    data() {
      return {
        loading: false,
        loadingDel: false,
        periodo: new Date(Date.now() - (1000 * 60 * 60 * 3)).toISOString().slice(0, 10),
        type: 200,
        deletar: {},
        status: [{
          title: 200,
          color: 'bg-success'
        }, {
          title: 400,
          color: 'bg-warning'
        }, {
          title: 500,
          color: 'bg-danger'
        }],
        info: [],
      }
    },
    methods: {
      formatCode(payload) {
        return JSON.stringify(payload).replace(/},/g, '}<br>').replace(/],/g, ']<br>').replace(/","/g, '"<br>   "')
      },
      getLogs(status, pagination) {
        this.loading = true;
        this.type = status;
        this.info = [];
        const payload =
          `status=${status}&periodo=${this.periodo}${(this.ambiente)?'':'&ambiente=1'}&limit=${pagination.limit}&offset=${((pagination.current-1)*pagination.limit)}`;
        this.$store.dispatch('getLogs', payload)
          .then(response => {
            this.info = response.rows
            this.$refs.page.update(response.count)
          })
          .catch(er => this.toast(er.data.mensagem, 'times'))
          .finally(() => this.loading = false)
      },
      async showDeletar(payload) {
        await (this.deletar = payload);
        this.$refs['mDelLog'].show()
      },
      deletarLog(payload) {
        const del = (payload) ? this.deletar.id : this.periodo;
        this.loadingDel = true
        this.$store.dispatch('deleteLogs', del)
          .then(response => this.toast(response.mensagem, 'check'))
          .catch(er => this.toast(er.data.mensagem, 'times'))
          .finally(() => {
            this.loadingDel = false
            this.deletar = {}
            this.$refs['mDelLog'].hide();
            this.getLogs(this.type, this.$refs.page.pagination);
          })
      },
    }
  }
</script>

<style scoped>
#overflow {
  height: calc(85vh - 255px);
  overflow-y: auto;
}

a {
  text-decoration: none;
}

.smallText {
  font-size: small;
}

.xSmallText {
  font-size: x-small;
}

.form-control {
  font-size: 0.8rem;
}

.code {
  word-break: break-all;
  /* text-overflow: ellipsis; */
  max-height: 200px;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  font-size: 0.65rem;
}

@media screen and (max-width: 768px) {
  #overflow {
    height: calc(85vh - 260px);
  }

  .smallText {
    font-size: x-small;
  }
}
</style>