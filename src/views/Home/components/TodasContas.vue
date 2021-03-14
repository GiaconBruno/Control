<template>
  <div class="row">
    <div class="col-12 px-2">
      <div v-if="loading" class="spinner-border text-green spinner-border-sm mr-3" role="status"></div>
      <label v-else-if="!contas.length">Nenhuma conta disponivel!</label>
      <div v-else>
        <h5 class="smallText">Contas: </h5>
        <div class="accordion" role="tablist">
          <div v-for="conta in contas" :key="conta.id" class="mb-3">
            <div @click="getParcelas(conta.id)" v-b-toggle="`parcelas-${conta.id}`"
              :class="{'contabord': (parcelas.length)}"
              class="btn text-left alert-success row m-0 d-flex justify-content-between align-items-center">
              <div class="col-auto px-0">
                <i :class="((parcelas.length) && (parcelas[0].fk_conta_id == conta.id)) ? 'fa-folder-open' : 'fa-folder'"
                  class="fa text-warning px-2 py-1"></i>
              </div>
              <div class="col-9 col-lg-10 px-0">
                <div class="row m-0">
                  <div class="col-12 px-0">
                    <div class="row m-0 align-items-center">
                      <div class="col-12 col-lg-4 px-0 text-center text-lg-left">
                        <span>{{conta.descricao}}</span>
                      </div>
                      <div class="col-12 col-lg-8 px-0 text-center text-sm text-lg-left">
                        <div v-if="((parcelas.length) && (parcelas[0].fk_conta_id == conta.id))"
                          class="row m-0 h-100 align-items-center">
                          <div class="col-6 col-lg-5 px-0">
                            <div class="row m-0 justify-content-center align-items-center">
                              <div class="col-12 col-lg-5 px-0">
                                <span>Parcelas: {{ parcelas.length }}</span>
                              </div>
                              <div class="col-12 col-lg-6 px-0">
                                <div class="row m-0 justify-content-center align-items-center">
                                  <span class="pr-2 text-xs h-100">Pagos: </span>
                                  <span>{{ parcelasPagas }} | {{ parcelas.length-parcelasPagas }}</span>
                                  <span class="pl-2 text-xs h-100"> Abertos</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col-6 col-lg-7 px-0">
                            <div class="row m-0 justify-content-center align-items-center">
                              <div class="col-12 col-lg-5 px-0 text-lg-right">
                                <span><strong>Total: {{ total }} </strong></span>
                              </div>
                              <div class="col-12 col-lg-7 px-0">
                                <div class="row m-0 justify-content-center align-items-center">
                                  <span class="px-2 text-xs text-green h-100">Pagos</span>
                                  <span class="pl-3 text-xs text-red h-100">Abertos</span>
                                </div>
                                <div class="row m-0 justify-content-center align-items-center">
                                  <span class="text-green">{{ totalPago }} </span>
                                  <span class="px-1"> | </span>
                                  <span class="text-red"> {{ totalAberto }}</span>
                                </div>
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
                </div>
              </div>
              <div class="col-auto px-0">
                <div class="row m-0 px-0 text-right align-items-center flex-column flex-lg-row">
                  <i @click.stop="functions.setConta(conta)" class="fa fa-plus-circle text-success px-2 py-1"></i>
                  <i @click.stop="functions.setEditConta(conta)" class="fa fa-edit text-primary px-2 py-1"></i>
                  <i @click.stop="showDeletar(conta)" class="fa fa-trash text-danger px-2 py-1"></i>
                </div>
              </div>
            </div>
            <b-collapse :id="`parcelas-${conta.id}`" accordion="parcelas" class="bord" role="tabpanel">
              <TodasParcelas v-bind="{loadingParcelas, parcelas, functions, conta, getParcelas}" />
            </b-collapse>
          </div>
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
  </div>
</template>

<script>
  import TodasParcelas from './TodasParcelas'
  export default {
    props: ['functions'],
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
      }
    },
    beforeMount() {
      this.getContas();
    },
    methods: {
      async getContas() {
        this.loading = true;
        let response = await this.common.getContas();
        if (response) this.contas = response;
        else {
          this.$toasted.show("Dados não autorizados!", {
            iconPack: "fontawesome",
            icon: "times",
            duration: 5000,
            className: "bg-danger",
            theme: "bubble",
          });
          localStorage.clear();
          this.$router.push("/");
        }
        this.loading = false;
      },
      async getParcelas(payload, type) {
        this.loadingParcelas = true;
        this.conta = payload;
        let conta = 0;
        if (this.parcelas.length) conta = this.parcelas[0].fk_conta_id;
        this.parcelas = [];
        if ((conta == payload) && (type != 'deletar')) return;

        let response = await this.common.getParcelas(payload);
        if (response) this.parcelas = response;
        else {
          localStorage.clear();
          this.$router.push("/");
        }

        this.formatting();
        this.loadingParcelas = false;
      },
      formatting() {
        this.parcelasPagas = 0;
        this.totalPago = 0;
        this.totalAberto = 0;
        this.total = 0;

        if (this.parcelas.length)
          this.parcelas.map(e => {
            //Totalizando
            if (e.status) this.parcelasPagas++;
            (e.recebido) ? this.totalPago += e.recebido: this.totalAberto += e.valor;
            this.total += e.valor;
            //Formatando
            e.valor = `R$ ${String((e.valor).toFixed(2)).replaceAll('.', ',')}`;

            e.vencimento = ((e.vencimento).slice(0, 10).split('-').reverse().join().replaceAll(',', '/'));

            if (e.data_pagto)
              e.data_pagto = ((e.data_pagto).slice(0, 10).split('-').reverse().join().replaceAll(',', '/'));

            e.recebido = `R$ ${String((e.recebido).toFixed(2)).replaceAll('.', ',')}`;

          });
        this.totalPago = `R$ ${String((this.totalPago).toFixed(2)).replaceAll('.', ',')}`;
        this.totalAberto = `R$ ${String((this.totalAberto).toFixed(2)).replaceAll('.', ',')}`;
        this.total = `R$ ${String((this.total).toFixed(2)).replaceAll('.', ',')}`;
      },
      async showDeletar(payload) {
        await (this.deletar = payload);
        this.$refs['mDelConta'].show()
      },
      async deletarConta() {
        this.loadingDel = true;

        let response = await this.common.deletarConta(this.deletar.id);
        if (response)
          this.$toasted.show(`${response.mensagem}`, {
            iconPack: "fontawesome",
            icon: "check",
            duration: 3000,
            className: "bg-success",
            theme: "bubble",
          });
        else {
          this.$router.push("/");
          this.loadingDel = false;
        }
        this.deletar = null;
        await this.getContas();
        this.loadingDel = false;
      },
    }
  }
</script>

<style scoped>
.mb-3:focus,
.btn:focus {
  outline-style: none;
  box-shadow: none;
}

label {
  color: dimgray;
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

@media screen and (max-width: 768px) {
  .accordion {
    font-size: 70%;
  }

  .btn {
    font-size: 130%;
  }
}
</style>