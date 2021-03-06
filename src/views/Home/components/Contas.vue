<template>
  <div class="row">
    <div class="col-12">
      <div v-if="loading" class="spinner-border text-green spinner-border-sm mr-3" role="status"></div>
      <label v-else-if="!contas.length">Nenhuma conta disponivel!</label>
      <div v-else>
        <div class="accordion" role="tablist">
          <div v-for="conta in contas" :key="conta.id" class="mb-3">
            <div @click="getParcelas(conta.id)" v-b-toggle="`parcelas-${conta.id}`"
              :class="{'contabord': (parcelas.length)}"
              class="btn text-left alert-success row m-0 d-flex justify-content-between align-items-center">
              <div class="col px-0">
                <i @click.stop="click('Editar')" class="fa fa-edit text-primary px-2 py-1"></i>
              </div>
              <div class="col-9 col-lg-10 px-0">
                <div class="row m-0">
                  <div class="col-12 px-0">
                    <div class="row m-0">
                      <div class="col-12 col-lg-4 px-0 text-center text-lg-left">
                        {{conta.descricao}}
                      </div>
                      <div class="col-12 col-lg-8 px-0 text-center text-sm text-lg-left">
                        <div v-if="((parcelas.length) && (parcelas[0].fk_conta_id == conta.id))"
                          class="row m-0 h-100 align-items-center">
                          <div class="col-6 col-lg-4 px-0">
                            Parcelas:
                            <span class="pl-2 text-xs h-100">Pagos: </span>
                            {{ parcelasPagas }} | {{ parcelas.length }}
                            <span class="text-xs h-100"> Abertos</span>
                          </div>
                          <div class="col-6 col-lg-7 offset-lg-1 px-0">
                            Total:
                            <span class="pl-2 text-xs h-100">Pagos: </span>
                            {{ totalPago }} | {{ total }}
                            <span class="text-xs h-100"> Abertos</span>
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
              <div class="col px-0">
                <div class="col px-0 text-right">
                  <i @click.stop="click('Deletar')" class="fa fa-trash text-danger px-2"></i>
                </div>
              </div>
            </div>
            <b-collapse :id="`parcelas-${conta.id}`" accordion="parcelas" class="bord" role="tabpanel">
              <parcelas v-bind="{loadingParcelas, contas, parcelas}" />
            </b-collapse>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import parcelas from './Parcelas'
  export default {
    components: {
      parcelas
    },
    data() {
      return {
        loading: false,
        loadingParcelas: false,
        contas: [],
        parcelas: [],
        parcelasPagas: 0,
        totalPago: 0,
        total: 0,
      }
    },
    beforeMount() {
      this.getContas();
    },
    methods: {
      async getContas() {
        let auth = JSON.parse(localStorage.getItem("auth"));
        this.loading = true;
        await this.axios
          .post(`${this.api}/api/contas/${auth.id}`, {
            token: auth.token,
          })
          .then((response) => {
            this.contas = response.data;
          })
          .catch((err) => {
            console.log("" + err);
            localStorage.clear();
            this.$router.push("/");
          });
        this.loading = false;
      },
      async getParcelas(payload) {
        this.parcelas = [];
        let auth = JSON.parse(localStorage.getItem("auth"));
        this.loadingParcelas = true;
        await this.axios
          .post(`${this.api}/api/${payload}/parcelas`, {
            token: auth.token,
          })
          .then((response) => {
            this.parcelas = response.data;
          })
          .catch((err) => {
            console.log("" + err);
            localStorage.clear();
            this.$router.push("/");
          });

        this.formatting();

        this.loadingParcelas = false;
      },
      formatting() {
        this.parcelasPagas = 0;
        this.totalPago = 0;
        this.total = 0;

        if (this.parcelas.length)
          this.parcelas.map(e => {
            //Totalizando
            if (e.status) this.parcelasPagas++;
            if (e.recebido) this.totalPago += e.recebido;
            this.total += e.valor;

            //Formatando
            e.valor = `R$ ${String((e.valor).toFixed(2)).replaceAll('.', ',')}`;

            e.vencimento = ((e.vencimento).slice(0, 10).split('-').reverse().join().replaceAll(',', '/'));

            if (e.data_pagto)
              e.data_pagto = ((e.data_pagto).slice(0, 10).split('-').reverse().join().replaceAll(',', '/'));

            e.recebido = `R$ ${String((e.recebido).toFixed(2)).replaceAll('.', ',')}`;

          });
        this.totalPago = `R$ ${String((this.totalPago).toFixed(2)).replaceAll('.', ',')}`;
        this.total = `R$ ${String((this.total).toFixed(2)).replaceAll('.', ',')}`;
      },
      click(payload) {
        console.log(payload);
      }
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