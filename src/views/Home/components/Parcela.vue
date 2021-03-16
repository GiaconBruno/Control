<template>
  <div class="row m-0 justify-content-center">
    <div v-if="!loadingForm" class="col-12 col-lg-8 card border-secondary p-3">
      <label class="m-0"> {{ title }} </label>
      <hr class="mt-2" />
      <div class="row justify-content-between">
        <div class="col-4 pr-2 text-left text-red">
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
        <div class="col-4 px-2 text-left">
          <label for="outros">Outros:</label>
          <div class="position-relative">
            <i class="fa fa-money-bill-wave text-gray"></i>
            <money v-model="parcela.outros" type="text" name="outros" id="outros" class="form-control"
              placeholder="R$ 0,00" />
          </div>
        </div>
        <div class="col-3 px-0 text-left">
          <label for="total">Total:</label>
          <div class="position-relative">
            <i class="fa fa-equals text-gray"></i>
            <span class="pl-4">{{ total }}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6 offset-3 text-left">
          <label id="lbVencimento" for="vencimento">Vencimento:</label>
          <div class="position-relative">
            <i id="iVencimento" class="fa fa-calendar-alt text-gray"></i>
            <input v-model="parcela.vencimento" type="date" name="vencimento" id="vencimento" class="form-control" />
          </div>
        </div>
      </div>
      <div class="row">
        <div :class="(formSelect.select)? 'pr-3':'pr-0' " class="col-4 text-left">
          <label id="lbformaPagto" for="formaPagto">Forma de Pagto:</label>
          <div class="position-relative">
            <i id="iformaPagto" class="fa fa-dollar-sign text-gray"></i>
            <div v-if="formaPagto">
              <select v-if="formSelect.select" v-model="parcela.forma_pagto"
                @change="(parcela.forma_pagto == 'other')? (formSelect.select = false) : (formSelect.select = true)"
                :class="{'text-sm': (parcela.forma_pagto==null)}" name="formaPagto" id="formaPagto"
                class="form-control py-0 pl-3">
                <option :value="null" class="form-control">Selecione..</option>
                <option value="other" class="form-control">Criar</option>
                <option v-for="(forma, f) in formaPagto" :key="f" :value="forma" class="form-control">
                  {{ forma }}
                </option>
              </select>
              <div v-else class="row m-0">
                <div class="col-9 px-0">
                  <input v-model="formSelect.descricao" id="ipformaPagto" class="form-control" type="text"
                    placeholder="Digite.." />
                </div>
                <button @click="createForma()" class="btn btn-primary py-0 px-1 text-sm">OK!</button>
              </div>
            </div>
            <div v-else class="spinner-border spinner-border-sm my-2" role="status"></div>
          </div>
        </div>
        <div class="col-4 pl-0 pr-3 text-left">
          <label id="lbRecebido" for="recebido">Recebido:</label>
          <div class="position-relative">
            <i id="iRecebido" class="fa fa-donate text-gray"></i>
            <money v-model="parcela.recebido" type="text" name="recebido" id="recebido" class="form-control pr-0"
              placeholder="R$ 0,00" />
          </div>
        </div>
        <div class="col-4 pl-0 text-left">
          <label id="lbPagamento" for="pagamento">Pagamento:</label>
          <div class="position-relative">
            <i id="iPagamento" class="fa fa-calendar-check text-gray"></i>
            <input v-model="parcela.data_pagto" @keypress.delete="parcela.data_pagto=null; $forceUpdate()" type="date"
              name="pagamento" id="pagamento" class="form-control" />
          </div>
        </div>
      </div>
      <hr />
      <div class="row mt-4 justify-content-around">
        <button @click="functions.changeVisible('TodasContas')" class="btn btn-sm btn-danger">Cancelar</button>
        <button @click="createParcela()" :disabled="loading" class="btn btn-sm btn-success">{{action}}
          <div v-if="loading" class="spinner-border spinner-border-sm ml-2" role="status"></div>
        </button>
      </div>
    </div>
    <div v-else class="spinner-border text-success spinner-border-sm my-2" role="status"></div>
  </div>
</template>

<script>
  export default {
    props: ['contaParcela', 'functions', 'parcelaEdit'],
    data() {
      return {
        loading: false,
        loadingForm: false,
        title: 'Criar Parcela',
        action: 'Criar',
        mensagem: 'Parcela criada com exito!',
        url: `${this.contaParcela.id}/parcelas`,
        parcela: {
          forma_pagto: null,
        },
        formaPagto: [],
        formSelect: {
          descricao: '',
          select: true,
        },
      }
    },
    async beforeMount() {
      this.loadingForm = true;
      let response = await this.common.getFormasPagto();
      if (response) this.formaPagto = response;
      else this.$router.push("/");
      this.loadingForm = false;
    },
    mounted() {
      if (this.parcelaEdit.id) {
        this.parcela = {
          ...this.parcelaEdit
        };
        let data;
        if (this.parcela.vencimento) {
          data = this.parcela.vencimento.split('/');
          this.parcela.vencimento = `${data[2]}-${data[1]}-${data[0]}`;
        }
        if (this.parcela.data_pagto) {
          data = this.parcela.data_pagto.split('/');
          this.parcela.data_pagto = `${data[2]}-${data[1]}-${data[0]}`;
        }

        this.title = 'Parcela';
        this.action = 'Salvar';
        this.url = `atualizar-parcela/${this.parcela.id}`;
        this.mensagem = 'Parcela atualizada!!';
      } else
        this.parcela.vencimento =
        `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
    },
    computed: {
      total() {
        return `R$ ${(parseFloat(this.parcela.valor || 0) + parseFloat(this.parcela.outros || 0)).toFixed(2).replace('.',',')}` ||
          'R$ 0,00';
      }
    },
    methods: {
      createForma() {
        if (this.formSelect.descricao)
          this.formaPagto.push(this.formSelect.descricao.toUpperCase())
        this.formSelect = {
          descricao: '',
          select: true
        };
        this.parcela.forma_pagto = null;
      },
      valid() {
        if (!this.parcela.vencimento || !this.parcela.valor) {
          if (!this.parcela.valor) {
            document.querySelector('#lbValor').style.color = "#dc3545";
            document.querySelector('#iValor').style.color = "#dc3545";
            document.querySelector('#valor').style.borderColor = "#dc3545";
          }
          if (!this.parcela.vencimento) {
            document.querySelector('#lbVencimento').style.color = "#dc3545";
            document.querySelector('#iVencimento').style.color = "#dc3545";
            document.querySelector('#vencimento').style.borderColor = "#dc3545";
          }
          this.$toasted.show(`Prenche os compos corretamente`, {
            iconPack: "fontawesome",
            icon: "times",
            duration: 3000,
            className: "bg-danger",
            theme: "bubble",
          });
          return false
        } else if (!this.parcela.recebido && !this.parcela.data_pagto && !this.parcela.forma_pagto) {
          return true
        } else if (!this.parcela.recebido || !this.parcela.data_pagto ||
          (!this.parcela.forma_pagto && !this.formaPagto.select)) {
          if (!this.parcela.recebido) {
            document.querySelector('#lbRecebido').style.color = "#dc3545";
            document.querySelector('#iRecebido').style.color = "#dc3545";
            document.querySelector('#recebido').style.borderColor = "#dc3545";
          }
          if (!this.parcela.data_pagto) {
            document.querySelector('#lbPagamento').style.color = "#dc3545";
            document.querySelector('#iPagamento').style.color = "#dc3545";
            document.querySelector('#pagamento').style.borderColor = "#dc3545";
          }
          if (!this.parcela.forma_pagto && !this.formaPagto.select) {
            document.querySelector('#lbformaPagto').style.color = "#dc3545";
            document.querySelector('#iformaPagto').style.color = "#dc3545";
            document.querySelector('#formaPagto').style.borderColor = "#dc3545";
          }

          this.$toasted.show(`Prencha os campos para parcelas pagas`, {
            iconPack: "fontawesome",
            icon: "times",
            duration: 5000,
            className: "bg-danger",
            theme: "bubble",
          });
          return false
        } else {
          return true;
        }
      },
      async createParcela() {
        if (!this.valid()) return

        //Formating
        this.loading = true;
        let parcela = {
          ...this.parcela
        };
        if (!this.parcela.outros) parcela.outros = 0;
        parcela.valor = parseFloat(this.parcela.valor) + parseFloat(parcela.outros);
        parcela.recebido = parseFloat(this.parcela.recebido);

        if ((parcela.recebido) && (parcela.valor != parcela.recebido)) {
          this.$toasted.show(`Valor Recebido dever ser igual ao Valor Total`, {
            iconPack: "fontawesome",
            icon: "times",
            duration: 3000,
            className: "bg-danger",
            theme: "bubble",
          });
          document.querySelector('#lbRecebido').style.color = "#dc3545";
          document.querySelector('#iRecebido').style.color = "#dc3545";
          document.querySelector('#recebido').style.borderColor = "#dc3545";
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
          parcela.vencimento = `${formatting[2]}-${formatting[1]}-${formatting[0]}`;
        else parcela.vencimento = formatting[0];

        if (this.parcela.data_pagto) {
          formatting = (this.parcela.data_pagto.split("/"));
          if (formatting.length > 1)
            parcela.data_pagto = `${formatting[2]}-${formatting[1]}-${formatting[0]}`;
          else parcela.data_pagto = formatting[0];
        } else parcela.data_pagto = null;


        //GRAVANDO
        let response = await this.common.createParcela(parcela, this.url);
        if (response) {
          this.$toasted.show(`${this.mensagem}`, {
            iconPack: "fontawesome",
            icon: "check",
            duration: 3000,
            className: "bg-success",
            theme: "bubble",
          });
          this.functions.changeVisible('TodasContas');
        } else this.$router.push("/");
        this.loading = false;
      },
    }
  }
</script>

<style scoped>
label {
  margin: 1rem 0 0 0;
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

input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
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
  margin: 1rem -15px 0 -15px;
  border-color: #888888aa;
}

.btn:not(.btn-primary) {
  min-width: 100px;
}
</style>