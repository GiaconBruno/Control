<template>
  <div id="overflow" class="row m-0 justify-content-center">
    <div v-if="!loadingForm" class="col-12 col-lg-8 card border-secondary p-0">
      <label class="m-0 pt-3"> {{ title }} </label>
      <hr class="mt-2" />
      <div class="row mx-0 text-left">
        <div :class="{'has_errors': errors.includes('descricao')}" class="col-7 col-lg-6 px-1 px-lg-3">
          <label id="lbDescricao" for="descricao">Descrição:</label>
          <div class="position-relative">
            <i id="iDescricao" class="fa fa-pen-alt text-gray"></i>
            <input v-model="parcela.descricao" @blur="setRecebido()" type="text" name="descricao" id="descricao"
              class="form-control" placeholder="Descrição" />
          </div>
        </div>
        <div :class="{'has_errors': errors.includes('vencimento')}" class="col-5 col-lg-6 px-1 px-lg-3">
          <label id="lbVencimento" for="vencimento">Vencimento:</label>
          <div class="position-relative">
            <i id="iVencimento" class="fa fa-calendar-alt text-gray"></i>
            <input v-model="parcela.vencimento" @blur="setRecebido()" @keydown.delete="parcela.vencimento = null"
              type="date" name="vencimento" id="vencimento" class="form-control" />
          </div>
        </div>
      </div>
      <div class="row mx-0 text-left justify-content-between">
        <div :class="{'has_errors': errors.includes('valor')}" class="col-4 px-1 px-lg-3 text-red">
          <label id="lbValor" for="valor">Valor:</label>
          <div class="position-relative">
            <i id="iValor" class="fa fa-money-bill-alt text-gray"></i>
            <money v-model="parcela.valor" type="text" name="valor" id="valor" class="form-control"
              placeholder="R$ 0,00" />
          </div>
        </div>
        <div class="position-relative" style="width: 14px;">
          <i class="fa fa-plus text-gray" style="top: auto; left: 0; bottom: 0;"></i>
        </div>
        <div class="col-4 px-1 px-lg-3">
          <label for="outros">Outros:</label>
          <div class="position-relative">
            <i class="fa fa-money-bill-wave text-gray"></i>
            <money v-model="parcela.outros" type="text" name="outros" id="outros" class="form-control"
              placeholder="R$ 0,00" />
          </div>
        </div>
        <div class="col-3 px-0">
          <label for="total">Total:</label>
          <div class="position-relative pt-2">
            <i class="fa fa-equals text-gray" style="top: auto; left: 0; bottom: 0;"></i>
            <span class="pl-3 pl-lg-4">{{ total }}</span>
          </div>
        </div>
      </div>
      <hr>
      <label class="text-center text-md-sm m-0"> Informações de pagamento </label>
      <div class="row mx-0 text-left">
        <div :class="{'has_errors': errors.includes('forma_pagto')}" class="col-4 px-1 px-lg-3">
          <label id="lbformaPagto" for="formaPagto">Forma de Pagto:</label>
          <div class="position-relative">
            <i id="iformaPagto" class="fa fa-dollar-sign text-gray"></i>
            <div v-if="formaPagto">
              <select v-if="formSelect.select" v-model="parcela.forma_pagto"
                @change="(parcela.forma_pagto == 'other')? (formSelect.select = false) : (formSelect.select = true)"
                @blur="setRecebido()" :class="{'text-sm': (parcela.forma_pagto==null)}" name="formaPagto"
                id="formaPagto" class="form-control py-0 pl-3">
                <option :value="null" class="form-control">Selecione..</option>
                <option value="other" class="form-control">Criar</option>
                <option v-for="(forma, f) in formaPagto" :key="f" :value="forma" class="form-control">
                  {{ forma }}
                </option>
              </select>
              <div v-else class="row m-0">
                <div class="col-9 px-0">
                  <input v-model="formSelect.descricao" @keypress.enter="createForma()" id="ipformaPagto"
                    class="form-control" type="text" placeholder="Digite.." />
                </div>
                <button @click="createForma()" class="btn btn-primary py-0 px-1 text-sm">OK!</button>
              </div>
            </div>
            <div v-else class="spinner-border spinner-border-sm my-2" role="status"></div>
          </div>
        </div>
        <div :class="{'has_errors': errors.includes('recebido')}" class="col-3 pl-0 px-1 px-lg-3">
          <label id="lbRecebido" for="recebido">Recebido:</label>
          <div class="position-relative">
            <i id="iRecebido" class="fa fa-donate text-gray"></i>
            <money v-model="parcela.recebido" type="text" name="recebido" id="recebido" class="form-control pr-0"
              placeholder="R$ 0,00" />
          </div>
        </div>
        <div :class="{'has_errors': errors.includes('data_pagto')}" class="col-5 px-1 px-lg-3">
          <label id="lbPagamento" for="pagamento">Pagamento:</label>
          <div class="position-relative">
            <i id="iPagamento" class="fa fa-calendar-check text-gray"></i>
            <input v-model="parcela.data_pagto" @keydown.delete="parcela.data_pagto = null" type="date" name="pagamento"
              id="pagamento" class="form-control" />
          </div>
        </div>
      </div>
      <hr />
      <template v-if="parcela.repetir!=undefined">
        <div class="row mx-0 text-left my-2">
          <div class="col-6 col-md-4 mx-auto d-flex">
            <label id="lbRepetir" for="repetir" class="m-0">Replicar:</label>
            <input id="repetir" v-model="parcela.repetir" type="number"
              @blur="(parcela.repetir<0)? parcela.repetir=0:(parcela.repetir>12)?parcela.repetir=12:parcela.repetir"
              min="0" max="12" name="repetir" class="form-control mx-2 px-0 text-center" />
            <span>vezes</span>
          </div>
        </div>
        <div id="overflow-2" class="overflow-auto">
          <div v-for="p in (parseFloat(parcela.repetir)+1)" :key="`rep-${p}`"
            class="row mx-0 justify-content-around alert m-0 py-1 border rounded-0"
            :class="{'alert-secondary': p%2==0}">
            <div class="col-auto"> {{ p }} </div>
            <div class="col"> {{ parcela.descricao || `parcela ${p}` }} </div>
            <div class="col-auto"> {{ showVencto(p-1) }} </div>
            <div class="col-auto"> {{ total }} </div>
          </div>
        </div>
        <hr />
      </template>
      <div class="row my-md-2 mx-0 justify-content-around">
        <button @click="$router.go(-1)" class="btn btn-sm btn-danger">Cancelar</button>
        <button @click="(action=='Criar')?createParcela():updateParcela()" :disabled="loading"
          class="btn btn-sm btn-success">{{action}}
          <div v-if="loading" class="spinner-border spinner-border-sm ml-2" role="status"></div>
        </button>
      </div>
    </div>
    <div v-else class="fas fa-4x fa-spinner fa-pulse text-success my-2" role="status"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        loadingForm: false,
        title: 'Criar Parcela',
        action: 'Criar',
        conta: null,
        parcela: {
          forma_pagto: null,
          vencimento: new Date(new Date()).toLocaleString('pt-BR').replace(',', '').slice(0, 10).split('/').reverse().join('-'),
          repetir: 0,
        },
        formaPagto: [],
        formSelect: {
          descricao: '',
          select: true,
        },
        errors: [],
      }
    },
    beforeMount() {
      this.loadingForm = true;
      this.conta = Buffer.from(`${this.access.contaParcela}`, 'base64').toString('utf-8') / 100000
      this.$store.dispatch('getFormasPagto')
        .then((response) => this.formaPagto = response)
        .catch(er => this.toast(er.data.mensagem, 'times'))
        .finally(() => this.loadingForm = false)
    },
    mounted() {
      if (this.access.parcelaEdit && this.access.parcelaEdit.id) {
        this.parcela = this.access.parcelaEdit;
        if (this.parcela.vencimento)
          this.parcela.vencimento = this.parcela.vencimento.split('/').reverse().join('-')
        if (this.parcela.data_pagto)
          this.parcela.data_pagto = this.parcela.data_pagto.split('/').reverse().join('-')
        this.title = 'Editar Parcela'
        this.action = 'Salvar';
      }
    },
    watch: {
      parcela() {
        this.errors = []
      }
    },
    computed: {
      total() {
        return this.formatMoney(parseFloat(this.parcela.valor || 0) + parseFloat(this.parcela.outros || 0))
      }
    },
    methods: {
      createForma() {
        if (this.formSelect.descricao) {
          this.formaPagto.push(this.formSelect.descricao.toUpperCase())
          this.parcela.forma_pagto = this.formaPagto[this.formaPagto.length - 1];
        } else this.parcela.forma_pagto = null;
        this.formSelect = {
          descricao: '',
          select: true
        };
        this.setRecebido();
      },
      setRecebido() {
        if (this.parcela.forma_pagto && (this.parcela.forma_pagto != 'other')) {
          this.parcela.recebido = parseFloat(this.parcela.valor || 0) + parseFloat(this.parcela.outros || 0);
          if (!this.parcela.data_pagto) {
            this.parcela.data_pagto = new Date(Date.now());
            this.parcela.data_pagto = (this.parcela.data_pagto).toLocaleString('pt-BR').replace(',', '')
              .slice(0, 10).split('/').reverse().join('-')
            // .replace(/(\d{2})\/(\d{2})\/(\d{4}) \d{2}:\d{2}:\d{2}/g, '$3-$2-$1');
          }
        } else {
          this.parcela.recebido = 0;
          this.parcela.data_pagto = null;
        }
      },
      showVencto(pos) {
        const vencto = new Date(Date.parse(this.parcela.vencimento)+ (3 * 60 * 60 * 1000));
        const v = new Date(vencto.getFullYear(), vencto.getMonth() + pos, vencto.getDate());
        return this.showDate(v).slice(0, 10)
      },
      valid() {
        this.errors = [];
        // if (!this.parcela.descricao) this.errors.push('descricao')
        if (!this.parcela.vencimento) this.errors.push('vencimento')
        if (!this.parcela.valor) this.errors.push('valor')
        if (this.parcela.recebido || this.parcela.data_pagto || ![null, 'other'].includes(this.parcela.forma_pagto)) {
          if (!this.parcela.recebido) this.errors.push('recebido')
          if (!this.parcela.data_pagto) this.errors.push('data_pagto')
          if (!this.parcela.forma_pagto) this.errors.push('forma_pagto')
        }
        return this.errors.length
      },
      formatting() {
        let parcela = {
          ...this.parcela
        };
        if (!this.parcela.outros) parcela.outros = 0;
        parcela.valor = parseFloat(this.parcela.valor) + parseFloat(parcela.outros);
        parcela.recebido = parseFloat(this.parcela.recebido);

        if ((parcela.recebido) && (parcela.valor != parcela.recebido)) {
          this.errors.push('recebido')
          this.loading = false;
          return
        } else if (parcela.valor == parcela.recebido) {
          parcela.status = true;
        } else {
          parcela.status = false;
          parcela.recebido = 0;
        }

        let formatting = (this.parcela.vencimento.split("/"));
        if (formatting.length > 1)
          // parcela.vencimento = `${formatting[2]}-${formatting[1]}-${formatting[0]}`;
          parcela.vencimento = `${formatting.reverse().join('-')}`;
        else parcela.vencimento = formatting[0];

        if (this.parcela.data_pagto) {
          formatting = (this.parcela.data_pagto.split("/"));
          if (formatting.length > 1)
            // parcela.data_pagto = `${formatting[2]}-${formatting[1]}-${formatting[0]}`;
            parcela.data_pagto = `${formatting.reverse().join('-')}`;
          else parcela.data_pagto = formatting[0];
        } else parcela.data_pagto = null;

        return {
          conta: this.conta,
          parcela
        }
      },
      createParcela() {
        if (this.valid()) {
          this.toast('Prenche os campos corretamente.', 'times')
          this.toast('Para parcela em ABERTAS, obrigatório: VENCIMENTO e VALOR', 'times', 8000)
          this.toast('Para parcela PAGAS, obrigatório informações de pagamento.', 'times', 12000)
          return
        }
        //Formating
        this.loading = true;
        let payload = this.formatting()

        //GRAVANDO
        this.$store.dispatch('createParcela', payload)
          .then(response => {
            this.toast(response.mensagem, 'check')
            this.$router.go(-1)
          })
          .catch(er => this.toast(er.data.mensagem, 'times'))
          .finally(() => this.loading = false)
      },
      updateParcela() {
        if (this.valid()) {
          this.toast('Prenche os campos corretamente.', 'times')
          this.toast('Para parcela em ABERTAS, obrigatório: VENCIMENTO e VALOR', 'times', 8000)
          this.toast('Para parcela PAGAS, obrigatório informações de pagamento.', 'times', 12000)
          return
        }
        //Formating
        this.loading = true;
        let payload = this.formatting()

        //GRAVANDO
        this.$store.dispatch('updateParcela', payload.parcela)
          .then(response => {
            this.toast(response.mensagem, 'check')
            this.$router.go(-1)
          })
          .catch(er => this.toast(er.data.mensagem, 'times'))
          .finally(() => this.loading = false)
      }
    }
  }
</script>

<style scoped>
#overflow {
  overflow-y: scroll;
  max-height: calc(85vh - 80px);
}

#overflow-2 {
  overflow-y: scroll;
  height: calc(85vh - 472px);
}

label {
  margin: 0.5rem 0 0 0;
}

.fa {
  color: dimgray;
  top: 5px;
  left: 5px;
  position: absolute;
  z-index: 9;
}

[class*="fa-money"] {
  left: 2px;
}

input,
select {
  height: 25px;
  padding-left: 23px;
  padding-right: 0;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #333;
}

input:focus,
select:focus {
  border-color: #28a745;
  box-shadow: none;
}

input::placeholder,
.text-sm {
  font-size: 12px;
}

hr {
  margin: 1rem 0 0 0;
  border-color: #888888aa;
}

.has_errors input,
.has_errors label,
.has_errors i,
.has_errors select {
  color: #dc3545;
  border-color: #dc3545;
}

.btn:not(.btn-primary) {
  min-width: 100px;
}

@media screen and (max-width: 992px) {
  * {
    font-size: 0.7rem;
  }
}

@media screen and (max-width: 768px) {
  #overflow {
    max-height: calc(85vh - 95px);
  }
}
</style>