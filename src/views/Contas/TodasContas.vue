<template>
  <div class="overflow">
    <div class="row m-0">
      <div class="col-12 px-0">
        <h5 class="smallText"> ({{ contas.length }}) {{ rota.title }}: </h5>
      </div>
    </div>
    <filterable v-bind="{filter}" @change="filter=$event" />
    <div v-if="loading" class="fas fa-4x fa-spinner fa-pulse text-success my-2" role="status"></div>
    <div v-else-if="!contas.length">
      <p class="my-0 text-black-50 text-sm">Nenhuma conta disponivel!</p>
      <button @click="$emit('changeVisible', 'conta')" class="btn btn-success btn-sm my-1">
        <span class="text-sm">Criar Conta</span>
      </button>
    </div>
    <div v-else class="accordion" role="tablist">
      <div v-for="(conta,i) in contas" :key="conta.id" v-show="filtring(conta)" class="mb-3">
        <div @click="getParcelas(conta.id)" v-b-toggle="`parcelas-${conta.id}`"
          :class="{'contabord': (showParcelas), 'pago': (conta.status)}"
          class="btn text-left alert-success row m-0 px-1 px-lg-3 d-flex justify-content-between align-items-center">
          <div class="col-1 col-lg-auto px-0">
            <i :class="((showParcelas.length) && (parcelas[0].fk_conta_id == conta.id)) ? 'fa-folder-open' : 'fa-folder'"
              class="fa text-warning px-2 py-1"></i>
          </div>
          <div class="col col-lg-10 px-0">
            <div class="row m-0 align-items-center">
              <div class="col-12 col-lg-5 px-0 text-center text-lg-left">
                <span>{{conta.descricao}}</span>
              </div>
              <div class="col-12 col-lg-6 px-0 text-center text-sm">
                <div v-if="((showParcelas.length) && (parcelas[0].fk_conta_id == conta.id))"
                  class="row m-0 h-100 align-items-center">
                  <div class="col-3 col-lg-3 px-0">
                    <span>Parcelas: {{ showParcelas.length }}</span>
                  </div>
                  <div class="col col-lg-5 px-0 text-md">
                    <div class="row m-0 justify-content-center align-items-center">
                      <span class="px-2 text-green h-100">{{ parcelasPagas }} Pagos</span>
                      <span class="pl-3 text-red h-100">{{ showParcelas.length-parcelasPagas }}
                        Abertos</span>
                    </div>
                    <div class="row m-0 justify-content-center align-items-center">
                      <span class="text-green">{{ formatMoney(totalPago) }} </span>
                      <span class="px-1"> | </span>
                      <span class="text-red"> {{ formatMoney(totalAberto) }}</span>
                    </div>
                  </div>
                  <div class="col-3 col-lg-4 px-0">
                    <div class="row m-0 justify-content-center align-items-center">
                      <div class="col-12 col-lg-auto px-0 text-lg-right">
                        <span><strong>Total: {{ formatMoney(total) }} </strong></span>
                      </div>
                    </div>
                  </div>
                </div>
                <span v-else class="text-black-50">
                  Clique para mais detalhes
                </span>
              </div>
            </div>
          </div>
          <div v-if="['/entradas', '/saidas'].includes($route.path)" class="col-1 col-lg-auto px-0">
            <div class="row m-0 px-0 text-right align-items-center flex-column flex-lg-row">
              <i @click.stop="createParcela(crypto(conta.id))" :id="`iParela${i}`"
                class="fa fa-plus-circle text-success px-2 py-1"></i>
              <b-tooltip :target="`iParela${i}`" triggers="hover" noninteractive> Criar Parcela </b-tooltip>
              <i @click.stop="editConta(conta)" :id="`iEditConta${i}`" class="fa fa-edit text-primary px-2 py-1"></i>
              <b-tooltip :target="`iEditConta${i}`" triggers="hover" noninteractive> Editar Conta
              </b-tooltip>
              <i @click.stop="showDeletar(conta)" :id="`iRemoveConta${i}`"
                class="fa fa-trash text-danger px-2 py-1"></i>
              <b-tooltip :target="`iRemoveConta${i}`" triggers="hover" noninteractive> Deletar Conta
              </b-tooltip>
            </div>
          </div>
          <div v-else class="col px-2 text-sm"> {{ formatDate(conta.criado) }} </div>
        </div>
        <template v-if="$route.path == '/todas-contas'">
          <div class="row mx-0 alert-primary text-left text-sm" v-for="(user, x) in conta.usuarios"
            :key="`${user.nome}-${x}`">
            <div class="col px-2"> Usuário: {{ user.nome }} </div>
            <div class="col px-2"> Acesso:
              {{ (user.acesso)? formatDate(user.acesso):'Nenhum' }} </div>
            <div class="col px-2"> Ativo: <i :class="(user.ativo)?'fa-check':'fa-times'" class="fa"></i></div>
            <div class="col px-2"> Permissao: <i :class="(user.permissao)?'fa-check':'fa-times'" class="fa"></i></div>
          </div>
        </template>
        <b-collapse :id="`parcelas-${conta.id}`" accordion="parcelas" class="bord" role="tabpanel">
          <TodasParcelas v-bind="{parcelas, crypto, getParcelas, filter, loadingParcelas}" />
        </b-collapse>
      </div>
    </div>
    <b-modal v-if="deletar" ref="mDelConta" id="mDelConta" hide-footer centered no-close-on-esc no-close-on-backdrop
      title="Deletar Conta">
      <p class="my-4">Deseja deletar a conta <strong> {{ deletar.descricao }} </strong>?</p>
      <hr>
      <div class="row m-0 justify-content-around">
        <button @click="$bvModal.hide('mDelConta')" class="btn btn-sm btn-danger" block>Cancelar</button>
        <button @click="deletarConta()" :disabled="loadingDel" class="btn btn-sm btn-success" block>Confirmar
          <div v-if="loadingDel" class="spinner-border spinner-border-sm ml-2" role="status"></div>
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
        conta: 0,
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
      showParcelas() {
        const all = [];
        this.parcelas.map(p => {
          if (p.show) all.push(p)
        })
        this.formatting();
        return all;
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
            };;
          default:
            return {
              title: 'Todas as Contas', dispatch: 'getAllContas', tipo: 'S'
            };;
        }
      }
    },
    methods: {
      getContas() {
        this.loading = true;
        this.parcelas = [];
        this.$store.dispatch(this.rota.dispatch)
          .then(response => this.contas = response)
          .catch(er => {
            localStorage.clear();
            this.$router.push('/');
            console.log(er)
          })
          .finally(() => this.loading = false)
      },
      createParcela(payload) {
        this.$store.commit('SET_CONTA_PARCELA', payload)
        this.$router.push('/parcela')
      },
      editConta(payload) {
        this.$store.commit('SET_EDIT_CONTA', payload)
        this.$router.push('/conta')
      },
      crypto(payload) {
        return Buffer.from(`${payload*100000}`, 'utf-8').toString('base64')
      },
      getParcelas(payload, type) {
        this.loadingParcelas = true;
        this.$store.commit('SET_CONTA_PARCELA', this.crypto(payload))
        this.conta = payload;
        let conta = 0;
        if (this.parcelas.length) conta = this.parcelas[0].fk_conta_id;
        this.parcelas = [];
        this.filter.map((f, i) => f.show = (i > 1) ? false : f.show);
        if ((conta == payload) && (type != 'deletar')) return;

        this.$store.dispatch('getParcelas', payload)
          .then(response => {
            response.map(r => r.show = true)
            this.parcelas = response
            this.filter.map((f, i) => f.show = (i > 1) ? true : f.show);
          })
          .catch(er => {
            localStorage.clear();
            this.$router.push('/');
            console.log(er)
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
            this.toast(response.mensagem, 'check')
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
        const has = (payload) => this.filter[this.filter.findIndex(f => f.name == payload)].value

        const contaStatus = () => (c.status == has('Conta Status') || has('Conta Status') == null)

        const contaDesc = () => (has('Conta Descrição') == '') ||
          ((c.descricao.toLowerCase()).replace(has('Conta Descrição').toLowerCase(), '') != c.descricao.toLowerCase())

        return contaStatus() && contaDesc();
      }
    }
  }
</script>

<style scoped>
.overflow {
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(85vh - 70px);
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
  top: 8px;
  left: -15px;
  z-index: 10;
  transform: rotate(-35deg);
}

@media screen and (max-width: 767px) {
  .accordion {
    font-size: 70%;
  }

  .overflow {
    max-height: calc(85vh - 105px);
  }

  .btn:not(.btn-sm) {
    font-size: 130%;
  }

  .text-md {
    font-size: 0.8em;
  }
}

@media screen and (max-width: 335px) {
  .overflow {
    max-height: 60vh;
  }
}
</style>