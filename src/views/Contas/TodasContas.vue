<template>
  <div id="overflow">
    <div class="row m-0">
      <div class="col-12 px-0">
        <h5 class="smallText"> ({{ contas.length }}) {{ rota.title }}: </h5>
      </div>
    </div>
    <filterable v-bind="{filter}" @hasChange="filter=$event" />
    <div v-if="loading" class="fas fa-4x fa-spinner fa-pulse text-success my-2" role="status"></div>
    <div v-else-if="!contas.length">
      <p class="my-0 text-black-50 text-sm">Nenhuma conta disponivel!</p>
      <button @click="$emit('CV', 'conta')" class="col-auto btn btn-success btn-sm my-1">
        <span class="text-sm">Criar Conta</span>
      </button>
    </div>
    <div v-else class="accordion" role="tablist">
      <div v-for="(conta,i) in contas" :key="conta.id" v-show="filtring(conta)" class="mb-3">
        <div @click="getParcelas(conta.id, i)"
          :class="{'rounded-bottom-0': conta.collapse || ($route.path == '/todas-contas'), 'pago': conta.status}"
          class="pointer text-start alert alert-success row m-0 px-1 px-lg-2 py-1 justify-content-between align-items-center">
          <div class="col-auto col-lg-auto px-0">
            <i :class="(hasParcelas && (parcelas[0].fk_conta_id == conta.id)) ? 'fa-folder-open' : 'fa-folder'"
              class="fa text-warning px-2 py-1" />
          </div>
          <div class="col col-lg-10 px-0">
            <div class="row m-0 align-items-center">
              <div class="col-6 col-lg-7 px-0 text-left">
                <span>{{conta.descricao}}</span>
              </div>
              <div class="col-6 col-lg-5 px-0 text-center text-sm">
                <div v-if="(hasParcelas && (parcelas[0].fk_conta_id == conta.id))"
                  class="row m-0 h-100 align-items-center justify-content-around">
                  <div class="col-12 col-lg-3 px-0">
                    <span class="text-sm">Parcelas: </span> <span>{{ hasParcelas }}</span>
                  </div>
                  <div class="col-12 col-lg-5 px-0 text-md">
                    <div class="row m-0 justify-content-around align-items-center">
                      <small class="col-auto px-0 text-green h-100">{{ parcelasPagas }} Pagos</small>
                      <small class="col-auto px-0 text-red h-100">{{ hasParcelas-parcelasPagas }} Abertos</small>
                    </div>
                    <div class="row m-0 justify-content-around align-items-center">
                      <small class="col-auto px-0 text-green border-right">{{ formatMoney(totalPago) }} </small>
                      <small class="col-auto px-0 text-red"> {{ formatMoney(totalAberto) }}</small>
                    </div>
                  </div>
                  <div class="col-12 col-lg-4 px-0">
                    <div class="row m-0 justify-content-center align-items-center">
                      <div class="col-12 col-lg-auto px-0 text-lg-end">
                        <span><strong>Total: {{ formatMoney(total) }} </strong></span>
                      </div>
                    </div>
                  </div>
                </div>
                <span v-else class="text-sm text-black-50"> Clique para mais detalhes </span>
              </div>
            </div>
          </div>
          <div v-if="['/entradas', '/saidas'].includes($route.path)" class="col-1 col-lg-auto px-0">
            <div class="row m-0 px-0 text-end align-items-center flex-column flex-lg-row">
              <i @click.stop="createParcela(crypto(conta.id))" :id="`iParela${i}`"
                class="col-4 fa fa-plus-circle text-success px-2 py-1" />
              <!-- <b-tooltip :target="`iParela${i}`" triggers="hover" noninteractive> Criar Parcela </b-tooltip> -->
              <i @click.stop="editConta(conta.id)" :id="`iEditConta${i}`"
                class="col-4 fa fa-edit text-primary px-2 py-1" />
              <!-- <b-tooltip :target="`iEditConta${i}`" triggers="hover" noninteractive> Editar Conta
              </b-tooltip> -->
              <i @click.stop="showDeletar(conta)" :id="`iRemoveConta${i}`"
                class="col-4 fa fa-trash text-danger px-2 py-1" />
              <!-- <b-tooltip :target="`iRemoveConta${i}`" triggers="hover" noninteractive> Deletar Conta
              </b-tooltip> -->
            </div>
          </div>
          <div v-else class="col-2 col-lg text-center text-lg-left px-0 text-sm">
            <small class="text-sm">{{ formatDate(conta.createdAt) }}</small></div>
        </div>
        <template v-if="$route.path == '/todas-contas'">
          <div class="row mx-0 align-items-center alert alert-primary p-0 m-0 rounded-0 text-start text-sm"
            v-for="(user, x) in conta.Usuarios" :key="`${user.nome}-${x}`">
            <div class="col px-2"> Usuário: {{ user.nome }} </div>
            <div class="col col-lg-3 text-center px-0 px-lg-2">
              {{ (user.acesso)? formatDate(user.acesso):'Nenhum' }} </div>
            <div class="col-2 col-lg-2 px-2 text-center"> Ativo: <i :class="(user.ativo)?'fa-check':'fa-times'"
                class="fa" /></div>
            <div class="col-3 col-lg-2 px-2 text-center"> Permissao: <i :class="(user.permissao)?'fa-check':'fa-times'"
                class="fa" /></div>
          </div>
        </template>
        <BCollapse :id="`parcelas-${conta.id}`" v-model="conta.collapse" accordion="parcelas"
          class="border border-top-0 rounded-bottom">
          <TodasParcelas v-bind="{parcelas, crypto, getParcelas, i, filter, loadingParcelas}" />
        </BCollapse>
      </div>
    </div>
    <b-modal v-if="deletar" ref="mDelConta" id="mDelConta" no-footer centered no-close-on-esc no-close-on-backdrop
      title="Deletar Conta">
      <p class="my-4">Deseja deletar a conta <strong> {{ deletar.descricao }} </strong>?</p>
      <hr>
      <div class="row m-0 justify-content-around">
        <button @click="$bvModal.hide('mDelConta')" class="col-auto btn btn-sm btn-danger" block>Cancelar</button>
        <button @click="deletarConta()" :disabled="loadingDel" class="col-auto btn btn-sm btn-success" block>Confirmar
          <div v-if="loadingDel" class="spinner-border spinner-border-sm ms-2" role="status"></div>
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import TodasParcelas from '../Parcelas/TodasParcelas.vue'
  export default {
    components: {
      TodasParcelas
    },
    data() {
      return {
        loading: false,
        loadingDel: false,
        loadingParcelas: false,
        contas: [],
        parcelas: [],
        parcelasPagas: 0,
        totalPago: 0,
        totalAberto: 0,
        total: 0,
        deletar: null,
        filter: [{
          name: 'Conta Status',
          type: ['Todos', 'Pagos', 'Abertos'],
          value: null,
        }, {
          name: 'Conta Descrição',
          type: 'Text',
          value: '',
        }, {
          name: 'Parcela Status',
          type: ['Todos', 'Pagos', 'Abertos'],
          value: null,
          show: false,
        }, {
          name: 'Parcela Descrição',
          type: 'Text',
          value: '',
          show: false,
        }, {
          name: 'Dt. Venc.',
          type: 'Date',
          value: ['', ''],
          show: false,
        }, {
          name: 'Dt. Pagto.',
          type: 'Date',
          value: ['', ''],
          show: false,
        }],
      }
    },
    beforeMount() {
      this.getContas();
    },
    watch: {
      $route(to) {
        if (['/entradas', '/saidas', '/todas-contas'].includes(to.path)) this.getContas();
      },
    },
    computed: {
      hasParcelas() {
        return this.parcelas.length;
      },
      rota() {
        switch (this.$route.path) {
          case '/entradas':
            return {
              title: 'Contas de Entradas', dispatch: 'getContasEntradas', tipo: 'E'
            };
          case '/saidas':
            return {
              title: 'Contas de Saídas', dispatch: 'getContasSaidas', tipo: 'S'
            };
          default:
            return {
              title: 'Todas as Contas', dispatch: 'getAllContas', tipo: 'S'
            };
        }
      }
    },
    methods: {
      getContas() {
        this.loading = true;
        this.parcelas = [];
        this.$store.dispatch(this.rota.dispatch)
          .then(response => {
            this.contas = response;
            this.contas.map(c => c.loading = false)
            this.contas.map(c => c.collapse = false)
          })
          .finally(() => this.loading = false)
      },
      createParcela(payload) {
        this.$store.commit('SET_CONTA_PARCELA', payload)
        this.$router.push('/parcela')
      },
      editConta(payload) {
        this.$store.dispatch('getContasId', payload)
          .then(response => {
            this.$store.commit('SET_EDIT_CONTA', response)
            this.$router.push('/conta')
          })
          .finally(() => this.loading = false)
      },
      crypto(payload) {
        return this.Buffer.from(`${payload*100000}`, 'utf-8').toString('base64')
      },
      getParcelas(contaId, i, type) {
        if (this.loadingParcelas) return;

        const hasOpen = this.contas.find(c => c.collapse == true);
        this.contas.map(c => c.collapse = false);
        this.parcelas = [];
        if (hasOpen && (hasOpen.id == contaId) && (type != 'deletar')) return;

        this.contas[i].collapse = true;
        this.$store.commit('SET_CONTA_PARCELA', this.crypto(contaId))
        this.filter.map((f, x) => f.show = (x > 1) ? false : f.show);
        this.loadingParcelas = true;
        this.$store.dispatch('getParcelas', contaId)
          .then(response => {
            response.map(r => r.show = true)
            this.parcelas = response
            this.filter.map((f, x) => f.show = (x > 1) ? true : f.show);
          })
          .finally(() => {
            this.formatting();
            this.loadingParcelas = false;
          })
      },
      formatting() {
        this.parcelasPagas = 0;
        this.totalPago = 0;
        this.totalAberto = 0;
        this.total = 0;

        if (this.parcelas.length)
          this.parcelas.map(e => {
            if (e.show) {
              //Totalizando
              if (e.status) this.parcelasPagas++;
              (e.recebido) ? this.totalPago += e.recebido: this.totalAberto += e.valor;
              this.total += e.valor;
              //Formatando

              e.oriVenc = e.vencimento;
              e.vencimento = ((e.vencimento).slice(0, 10).split('-').reverse().join().replaceAll(',', '/'));

              if (e.data_pagto)
                e.data_pagto = ((e.data_pagto).slice(0, 10).split('-').reverse().join().replaceAll(',', '/'));

            }
          });
      },
      async showDeletar(payload) {
        await (this.deletar = payload);
        this.$refs['mDelConta'].show()
      },
      deletarConta() {
        this.loadingDel = true;

        this.$store.dispatch('deleteConta', this.deletar.id)
          .then(response => {
            this.$toast(response.mensagem, 'success')
            this.$refs['mDelConta'].hide()
            this.getContas();
          })
          .catch(er => console.log(er.statusText || er))
          .finally(() => {
            this.loadingDel = false
            this.$refs['mDelConta'].hide()
          })
      },
      filtring(c) {
        const has = (payload) => this.filter[(this.filter).findIndex(f => f.name == payload)].value

        const contaStatus = () => (c.status == has('Conta Status') || has('Conta Status') == null)

        const contaDesc = () => (has('Conta Descrição') == '') ||
          ((c.descricao.toLowerCase()).replace(has('Conta Descrição').toLowerCase(), '') != c.descricao.toLowerCase())

        return contaStatus() && contaDesc();
      }
    }
  }
</script>

<style scoped>
#overflow {
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(85dvh - 40px);
}

.mb-3:focus,
.btn:focus {
  outline-style: none;
  box-shadow: none;
}

label {
  color: dimgray;
}

.text-md {
  font-size: 0.9em;
}

.text-sm {
  font-size: 0.8em;
}

.text-xs {
  font-size: 0.65em;
}

.text-green {
  color: seagreen;
}

.text-red {
  color: #dc3545;
}

.contabord {
  border-radius: 0.25rem 0.25rem 0 0;
}

.bord {
  border: 1px solid dimgray;
  border-top: 0;
  border-radius: 0 0 5px 5px;
}

.pago {
  overflow: hidden;
  position: relative;
}

.pago::before {
  content: "Pago";
  padding: 0 30px;
  font-size: 10px;
  color: white;
  background-color: seagreen;
  box-shadow: 0 0 5px 3px #eee;
  /* border-radius: 50%; */
  display: block;
  position: absolute;
  top: 9px;
  left: -30px;
  z-index: 10;
  transform: rotate(-65deg);
}

@media screen and (max-width: 767px) {
  .accordion {
    font-size: 70%;
  }

  #overflow {
    height: calc(85dvh - 90px);
  }

  .btn:not(.btn-sm) {
    font-size: 130%;
  }

  .text-md {
    font-size: 0.8em;
  }
}

@media screen and (max-width: 335px) {
  #overflow {
    height: 70dvh;
  }
}
</style>