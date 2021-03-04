<template>
    <div class="row">
        <div class="col-12">
            <div v-if="loading" class="spinner-border text-green spinner-border-sm mr-3" role="status"></div>
            <label v-else-if="!contas.length">Nenhuma conta disponivel!</label>
            <div v-else>
                <div class="accordion" role="tablist">
                    <div v-for="conta in contas" :key="conta.id" @click="getParcelas(conta.id)"
                        v-b-toggle="`parcelas-${conta.id}`" class=" mb-3">
                        <div class="btn text-left w-100 alert-success d-flex justify-content-between">
                            <span>
                                <i @click.stop="click('Editar')" class="fa fa-edit text-primary px-2 py-1"></i>|
                                {{conta.descricao}}
                                <span class="pl-5 text-black-50 text-sm">Clique para mais detalhes</span>
                            </span>
                            <div> |<i @click.stop="click('Deletar')" class="fa fa-trash text-danger px-2"></i></div>
                        </div>
                        <b-collapse :id="`parcelas-${conta.id}`" :accordion="`parcelas`" class="bord" role="tabpanel">
                            <div v-if="(loadingParcelas)" class="spinner-border text-green spinner-border-sm mr-3"
                                role="status"></div>
                            <div v-else-if="parcelas.length" class="text-left">
                                <span class="px-2">
                                    DESCRIÇÃO | VALOR | DATA VENCIMENTO | STATUS | DATA PAGTO | FORMA PAGTO | VALOR
                                    PAGTO
                                </span>
                                <div v-for="(parcela, i) in parcelas" :key="parcela.id">
                                    <span class="px-2">Parcela {{ i+1 }}/ {{ parcelas.length }}</span>
                                    <span class="px-2">{{ parcela.valor }}</span>
                                    <span class="px-2">{{ parcela.vencimento}}</span>
                                    <span class="px-2">{{ (parcela.status) ? 'Pago' : 'Aberto' }}</span>
                                    <span class="px-2">{{ parcela.data_pagto }}</span>
                                    <span class="px-2">{{ parcela.forma_pagto }}</span>
                                    <span class="px-2">{{ parcela.recebido }}</span>
                                </div>
                            </div>
                            <div v-else>
                                <span class="pl-5 text-black-50 text-sm">Nenhuma parcela encontrada!</span>
                            </div>
                        </b-collapse>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                loadingParcelas: false,
                contas: [],
                parcelas: []
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
                this.loadingParcelas = false;

                this.parcelas.map(e => {
                    e.valor = `R$ ${String(e.valor).replaceAll('.', ',')}`;
                    e.vencimento = ((e.vencimento).slice(0, 10).split('-').reverse()
                        .join().replaceAll(',', '/'));
                    if (e.data_pagto)
                        e.data_pagto = ((e.data_pagto).slice(0, 10).split('-').reverse()
                            .join().replaceAll(',', '/'));
                })
            },
            click(payload) {
                console.log(payload);
            }
        }
    }
</script>

<style scoped>
.mb-3:focus {
  outline-style: none;
}

label {
  color: dimgray;
}

.text-sm {
  font-size: 0.8em;
}

.bord {
  border: 1px solid dimgray;
  border-top: 0;
  border-radius: 0 0 5px 5px;
}
</style>