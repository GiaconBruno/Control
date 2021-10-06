<template>
  <div v-if="(loadingParcelas)" class="fas fa-2x fa-spinner fa-pulse text-success my-2" role="status">
  </div>
  <div v-else-if="(parcelas.length) && (hasParcelasStatus)" class="text-sm">
    <div class="row m-0" style="background-color: #ffc10790">
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
    </div>
    <hr class="m-0">
    <div v-for="(parcela, i) in parcelas" :key="parcela.id" :class="{'pago':(parcela.status && (parcelasStatus)),
     'parcela':((parcela.status==parcelasStatus) || parcelasStatus=='all')}" class="row m-0 align-items-center"
      :style="(vencido(parcela)) ? 'background-color: #dc354580' : 'background-color: #ffc10790'">
      <template v-if="((parcelasStatus != 'all') ? parcelasStatus==parcela.status : parcelasStatus)">
        <div class="col-11 px-0">
          <div class="row m-0">
            <div class="col-12 col-lg-7 pl-2 pr-1 pr-lg-0">
              <div class="row m-0">
                <div class="col-4 pl-3 pr-2 text-left text-sm">
                  {{ (parcela.descricao) ? parcela.descricao : `Parcela ${i+1} / ${parcelas.length}`}}</div>
                <div class="col-3 pl-0 pr-2">{{ parcela.valor }}</div>
                <div class="col-3 pl-0 pr-2">{{ parcela.vencimento}}</div>
                <div class="col-2 px-0">
                  {{ (parcela.status) ? 'Pago' : 'Aberto' }}</div>
              </div>
            </div>
            <div class="col-12 col-lg-5 pl-2 pr-1 px-lg-0">
              <div :class="{'vencido': (vencido(parcela))}" class="row m-0">
                <div class="col-4 px-2 pl-lg-0"> {{ (parcela.data_pagto) ? parcela.data_pagto : '-' }} </div>
                <div class="col-4 pl-0 pr-2 text-xs">{{ (parcela.forma_pagto) ? parcela.forma_pagto : '-' }}</div>
                <div class="col-3 px-0">{{ parcela.recebido }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-1 px-0 px-lg-2 text-right">
          <div class="row m-0 pr-1 pr-lg-0 justify-content-between">
            <i @click="editParcela(parcela)" :id="`iPagarEditar${i}-${crypto(parcela.id)}`"
              class="btn fa fa-dollar-sign text-success px-0 px-lg-2"></i>
            <b-tooltip :target="`iPagarEditar${i}-${crypto(parcela.id)}`" triggers="hover" noninteractive> Pagar/Editar
              Parcela </b-tooltip>
            <i @click="showDeletar(parcela)" :id="`iRemoveParcela${i}-${crypto(parcela.id)}`"
              class="btn fa fa-trash-alt text-danger px-0 px-lg-1"></i>
            <b-tooltip :target="`iRemoveParcela${i}-${crypto(parcela.id)}`" triggers="hover" noninteractive> Deletar
              Parcela
            </b-tooltip>
          </div>
        </div>
      </template>
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
    props: ['parcelas', 'crypto', 'getParcelas', 'parcelasStatus', 'loadingParcelas'],
    data() {
      return {
        deletar: '',
        loadingDel: false,
      }
    },
    computed: {
      hasParcelasStatus() {
        return this.parcelas.some(parcela => ((this.parcelasStatus == 'all') ||
          (parcela.status == this.parcelasStatus)))
      }
    },
    methods: {
      vencido(payload) {
        return (Date.parse(new Date(payload.oriVenc.slice(0, 10) + 'T23:59:59')) < Date.now() && (!payload.status))
      },
      editParcela(payload) {
        this.$store.commit('SET_EDIT_PARCELA', payload)
        this.$router.push('/parcela')
      },
      async showDeletar(payload) {
        await (this.deletar = payload);
        this.$refs['mDelParcela'].show()
      },
      async deletarParcela() {
        this.loadingDel = true;
        this.$store.dispatch('deleteParcela', this.deletar.id)
          .then(response => {
            this.toast(response.mensagem, 'check')
            this.getParcelas(this.deletar.fk_conta_id, 'deletar');
            this.deletar = null;
            this.$refs['mDelParcela'].hide()
          })
          .catch(er => this.toast(er.data.mensagem, 'times'))
          .finally(() => this.loadingDel = false)
      },
    }
  }
</script>

<style scoped>
.text-sm {
  font-size: 0.8em;
  align-self: center;
}

.text-xs {
  font-size: 0.7em;
  align-self: center;
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
  padding: 0 10px;
  font-size: 8px;
  color: white;
  background-color: seagreen;
  box-shadow: 0 0 5px 3px #eee;
  /* border-radius: 50%; */
  display: block;
  position: absolute;
  top: 8px;
  left: -13px;
  bottom: 8px;
  z-index: 10;
  z-index: 10;
  transform: rotate(-90deg);
}

.vencido {
  overflow: hidden;
  position: relative;
}

.vencido::before {
  content: "vencido";
  padding: 0 30px;
  font-size: 10px;
  color: #fff;
  background-color: #dc3545;
  box-shadow: 0 0 5px 0.5px #eee;
  border-radius: 5px;
  display: block;
  position: absolute;
  top: 20%;
  left: 10px;
  z-index: 10;
  /* transform: rotate(-0deg); */
}

@media screen and (max-width: 992px) {
  .vencido::before {
    top: 0;
    font-size: 8px;
  }
}
</style>