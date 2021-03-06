<template>
  <div v-if="(loadingParcelas)" class="spinner-border text-green spinner-border-sm mr-3"
    role="status">
  </div>
  <div v-else-if="parcelas.length">
    <div class="row m-0">
      <div class="col-12 col-lg-7 px-3 pr-lg-0 text-sm">
        <div class="row m-0">
          <div class="col-4 pl-0 pr-2 text-left"> DESCRIÇÃO </div>
          <div class="col-3 pl-0 pr-2"> VALOR </div>
          <div class="col-3 pl-0 pr-2"> DT VENCIMENTO </div>
          <div class="col-2 px-0"> STATUS </div>
        </div>
      </div>
      <div class="col-12 col-lg-5 px-3 pl-lg-0 text-sm">
        <div class="row m-0">
          <div class="col-4 pr-2 pl-0"> DT PAGAMENTO </div>
          <div class="col-4 pl-0 pr-2"> FORMA PAGTO </div>
          <div class="col-4 px-0"> VALOR PAGTO </div>
        </div>
      </div>
    </div>
    <hr class="m-0">
    <div v-for="(parcela, i) in parcelas" :key="parcela.id" :class="{'pago':(parcela.status)}" class="row m-0">
      <div class="col-12 col-lg-7 px-3 pr-lg-0">
        <div class="row m-0">
          <div class="col-4 pl-0 pr-2 text-left">Parcela {{ i+1 }}/ {{ parcelas.length }}</div>
          <div class="col-3 pl-0 pr-2">{{ parcela.valor }}</div>
          <div class="col-3 pl-0 pr-2">{{ parcela.vencimento}}</div>
          <div class="col-2 px-0">
            {{ (parcela.status) ? 'Pago' : 'Aberto' }}</div>
        </div>
      </div>
      <div class="col-12 col-lg-5 px-3 pl-lg-0">
        <div class="row m-0">
          <div class="col-4 px-2 pl-lg-0"> {{ (parcela.data_pagto) ? parcela.data_pagto : '-' }} </div>
          <div class="col-4 pl-0 pr-2">{{ (parcela.forma_pagto) ? parcela.forma_pagto : '-' }}</div>
          <div class="col-4 px-0">{{ parcela.recebido }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <span class="pl-5 text-black-50 text-sm">Nenhuma parcela encontrada!</span>
  </div>
</template>

<script>
  export default {
    props: ['loadingParcelas', 'conta', 'parcelas'],
  }
</script>

<style scoped>
.text-sm {
  font-size: 0.8em;
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
  box-shadow: 3px 0 10px dimgray;
  display: block;
  position: absolute;
  top: 5px;
  left: -10px;
  z-index: 10;
  transform: rotate(-25deg);
}
</style>