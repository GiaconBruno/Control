<template>
  <div v-if="(loadingParcelas)" class="spinner-border text-green spinner-border-sm mr-3" role="status">
  </div>
  <div v-else-if="parcelas.length">
    <div class="row m-0" style="background-color: #ffc10790;">
      <div class="col-11 px-0">
        <div class="row m-0">
          <div class="col-12 col-lg-7 pl-2 pr-1 pr-lg-0 text-sm">
            <div class="row m-0">
              <div class="col-4 pl-0 pr-2 text-left"> DESCRIÇÃO </div>
              <div class="col-3 pl-0 pr-2"> VALOR </div>
              <div class="col-3 pl-0 pr-2"> DT VENCIMENTO </div>
              <div class="col-2 px-0"> STATUS </div>
            </div>
          </div>
          <div class="col-12 col-lg-5 pl-2 pr-1 px-lg-0 text-sm">
            <div class="row m-0">
              <div class="col-4 pr-2 pl-0"> DT PAGAMENTO </div>
              <div class="col-4 pl-0 pr-2"> FORMA PAGTO </div>
              <div class="col-4 px-0"> VALOR PAGTO </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-1 px-0"></div>
    </div>
    <hr class="m-0">
    <div v-for="(parcela, i) in parcelas" :key="parcela.id" :class="{'pago':(parcela.status)}"
      class="row m-0 parcela align-items-center">
      <div class="col-11 px-0">
        <div class="row m-0">
          <div class="col-12 col-lg-7 pl-2 pr-1 pr-lg-0">
            <div class="row m-0">
              <div class="col-4 pl-0 pr-2 text-left">Parcela {{ i+1 }}/ {{ parcelas.length }}</div>
              <div class="col-3 pl-0 pr-2">{{ parcela.valor }}</div>
              <div class="col-3 pl-0 pr-2">{{ parcela.vencimento}}</div>
              <div class="col-2 px-0">
                {{ (parcela.status) ? 'Pago' : 'Aberto' }}</div>
            </div>
          </div>
          <div class="col-12 col-lg-5 pl-2 pr-1 px-lg-0">
            <div class="row m-0">
              <div class="col-4 px-2 pl-lg-0"> {{ (parcela.data_pagto) ? parcela.data_pagto : '-' }} </div>
              <div class="col-4 pl-0 pr-2">{{ (parcela.forma_pagto) ? parcela.forma_pagto : '-' }}</div>
              <div class="col-3 px-0">{{ parcela.recebido }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-1 px-0 px-lg-2 text-right">
        <i @click="showDeletar(parcela)" class="btn fa fa-trash-alt text-danger px-1"></i>
      </div>
    </div>
    <b-modal v-if="deletar" ref="mDelParcela" id="mDelParcela" hide-footer centered no-close-on-esc no-close-on-backdrop
      title="Deletar Parcela">
      <p class="my-4">Deseja deletar a parcela de valor
        <strong> {{ deletar.valor }} </strong>
        e vencimento <strong> {{ deletar.vencimento }} </strong> ?
      </p>
      <hr>
      <div class="row m-0 justify-content-around">
        <button @click="$bvModal.hide('mDelParcela')" class="btn btn-sm btn-danger" block>Cancelar</button>
        <button @click="deletarParcela()" :disabled="loadingDel" class="btn btn-sm btn-success" block>Confirmar
          <div v-if="loadingDel" class="spinner-border spinner-border-sm ml-2" role="status"></div>
        </button>
      </div>
    </b-modal>
  </div>
  <div v-else>
    <span class="pl-5 text-black-50 text-sm">Nenhuma parcela encontrada!</span>
  </div>
</template>

<script>
  export default {
    props: ['loadingParcelas', 'parcelas', 'conta', 'getParcelas'],
    data() {
      return {
        deletar: '',
        loadingDel: false,
      }
    },
    methods: {
      async showDeletar(payload) {
        await (this.deletar = payload);
        this.$refs['mDelParcela'].show()
      },
      async deletarParcela() {
        this.loadingDel = true;
        let auth = JSON.parse(localStorage.getItem("auth"));
        await this.axios
          .delete(`${this.api}/api/deletar-parcela/${this.deletar.id}`, {
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
            this.loadingDel = false;
          });
        this.getParcelas(this.conta.id, 'deletar');
        this.deletar = null;
        this.loadingDel = false;
      },
    }
  }
</script>

<style scoped>
.text-sm {
  font-size: 0.8em;
}

.parcela {
  border-bottom: 1px solid dimgray;
  background-color: #ffc10735;
}

.pago {
  overflow: hidden;
  position: relative;
}

.pago::before {
  content: "Pago";
  padding: 3px 45px;
  font-size: 10px;
  color: white;
  background-color: seagreen;
  box-shadow: 0 -2px 5px 0.5px dimgray;
  /* border-radius: 50%; */
  display: block;
  position: absolute;
  top: 5px;
  left: -10px;
  z-index: 10;
  transform: rotate(-25deg);
}
</style>