<template>
  <div v-if="(loadingParcelas)" class="fas fa-2x fa-spinner fa-pulse text-success my-2" role="status">
  </div>
  <div v-else-if="!parcelas.length">
    <p class="ps-5 my-0 text-black-50 text-sm">Nenhuma parcela encontrada!</p>
    <button v-if="!['/todas-contas'].includes($route.path)" @click="$router.push('/parcela')"
      class="btn btn-success btn-sm my-1">
      <span class="text-sm">Criar Parcelas</span>
    </button>
  </div>
  <div v-else class="text-sm">
    <div class="row m-0" style="background-color: #ffc10790">
      <div :class="['/entradas', '/saidas'].includes($route.path)?'col-11':'col-12'" class="px-0">
        <div class="row m-0">
          <div class="col-12 col-lg-7 ps-2 pe-1 pe-lg-0 text-sm">
            <div class="row m-0">
              <div class="col-4 ps-0 pe-2 text-start"> DESCRIÇÃO </div>
              <div class="col-3 ps-0 pe-2"> VALOR </div>
              <div class="col-3 ps-0 pe-2"> DT VENCIMENTO </div>
              <div class="col-2 px-0"> STATUS </div>
            </div>
          </div>
          <div class="col-12 col-lg-5 ps-2 pe-1 px-lg-0 text-sm">
            <div class="row m-0">
              <div class="col-4 pe-2 ps-0"> DT PAGAMENTO </div>
              <div class="col-4 ps-0 pe-2"> FORMA PAGTO </div>
              <div class="col-4 px-0"> VALOR PAGTO </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr class="m-0">
    <div v-for="(parcela, i) in parcelas" :key="parcela.id" :class="{'pago':(parcela.status)}"
      class="row m-0 align-items-center border-bottom" v-show="filtring(parcela)"
      :style="`background-color: ${(vencido(parcela)) ? '#dc354580' : '#ffc10790'}`">
      <template>
        <div class="col px-0">
          <div class="row m-0">
            <div class="col-12 col-lg-7 ps-2 pe-1 pe-lg-0">
              <div class="row m-0 align-items-center">
                <div class="col-4 px-2 text-start">
                  {{ (parcela.descricao) ? parcela.descricao : `Parcela ${i+1} / ${parcelas.length}`}}</div>
                <div class="col-3 ps-0 pe-2">{{ formatMoney(parcela.valor) }}</div>
                <div class="col-3 ps-0 pe-2">{{ parcela.vencimento}}</div>
                <div class="col-2 px-0">
                  {{ (parcela.status) ? 'Pago' : 'Aberto' }}</div>
              </div>
            </div>
            <div class="col-12 col-lg-5 ps-2 pe-1 px-lg-0">
              <div :class="{'vencido': (vencido(parcela))}" class="row m-0 h-100 align-items-center">
                <div class="col-4 px-2 ps-lg-0"> {{ (parcela.data_pagto) ? parcela.data_pagto : '-' }} </div>
                <div class="col-4 ps-0 pe-2 text-xs">{{ (parcela.forma_pagto) ? parcela.forma_pagto : '-' }}</div>
                <div class="col-3 px-0">{{ formatMoney(parcela.recebido) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="['/entradas', '/saidas'].includes($route.path)" class="px-0 px-lg-2 text-end">
          <div class="row m-0 pe-1 pe-lg-0 justify-content-center justify-content-sm-between">
            <i @click="editParcela(parcela)" :id="`iPagarEditar${i}-${crypto(parcela.id)}`"
              class="btn fa fa-dollar-sign text-success px-1 px-lg-2" />
            <b-tooltip :target="`iPagarEditar${i}-${crypto(parcela.id)}`" triggers="hover" noninteractive> Pagar/Editar
              Parcela </b-tooltip>
            <i @click="showDeletar(parcela)" :id="`iRemoveParcela${i}-${crypto(parcela.id)}`"
              class="btn fa fa-trash-alt text-danger px-1 px-lg-2" />
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
        <strong> {{ formatMoney(deletar.valor) }} </strong>
        e vencimento <strong> {{ deletar.vencimento }} </strong> ?
      </p>
      <hr>
      <div class="row m-0 justify-content-around">
        <button @click="$bvModal.hide('mDelParcela')" class="btn btn-sm btn-danger" block>Cancelar</button>
        <button @click="deletarParcela()" :disabled="loadingDel" class="btn btn-sm btn-success" block>Confirmar
          <div v-if="loadingDel" class="spinner-border spinner-border-sm ms-2" role="status"></div>
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    props: ['parcelas', 'crypto', 'getParcelas', 'filter', 'loadingParcelas'],
    data() {
      return {
        deletar: '',
        loadingDel: false,
      }
    },
    methods: {
      vencido(payload) {
        return (Date.parse(new Date(payload.oriVenc.slice(0, 10).split('/').reverse().join('-') + 'T23:59:59')) <
          Date.now() && (!payload.status))
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
            this.$toast(response.mensagem, 'success')
            this.getParcelas(this.deletar.fk_conta_id, 'deletar');
            this.deletar = null;
            this.$refs['mDelParcela'].hide()
          })
          .finally(() => this.loadingDel = false)
      },
      filtring(p) {
        const has = (payload) => this.filter[this.filter.findIndex(f => f.name == payload)].value
        const venct = Date.parse(p.vencimento.split('/').reverse().join('-'));
        const pagto = Date.parse((p.data_pagto || '').split('/').reverse().join('-'));

        const parcelaStatus = () => (p.status == has('Parcela Status') || has('Parcela Status') == null)

        const parcelaDesc = () => (has('Parcela Descrição') == '') ||
          ((p.descricao.toLowerCase()).replace(has('Parcela Descrição').toLowerCase(), '') !=
            p.descricao.toLowerCase())

        const parcelaVenc = () => (has('Dt. Venc.')[0] == '') || (has('Dt. Venc.')[1] == '') ||
          ((venct >= Date.parse(has('Dt. Venc.')[0])) && (venct <= Date.parse(has('Dt. Venc.')[1])))

        const parcelaPagto = () => (has('Dt. Pagto.')[0] == '') || (has('Dt. Pagto.')[1] == '') ||
          ((pagto >= Date.parse(has('Dt. Pagto.')[0])) && (pagto <= Date.parse(has('Dt. Pagto.')[1])))

        p.show = parcelaStatus() && parcelaDesc() && parcelaVenc() && parcelaPagto()
        return p.show;
      }
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
  padding: 0 20px;
  font-size: 8px;
  color: white;
  background-color: seagreen;
  /* box-shadow: 0 0 5px 3px #eee; */
  /* border-radius: 50%; */
  display: block;
  text-align: center;
  position: absolute;
  top: 35%;
  left: -24px;
  /* bottom: calc(50% - 5px); */
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