<template>
    <div class="row">
        <div class="col-12">
            <div v-if="loading" class="spinner-border text-green spinner-border-sm mr-3" role="status"></div>
            <label v-else-if="!contas.length">Nenhuma conta disponivel!</label>
            <div v-else>
                <div v-for="conta in contas" :key="conta.id"
                    class="btn text-left w-100 mb-3 alert-success d-flex justify-content-between">
                    <div>
                        <i class="fa fa-edit text-primary px-2"></i>|
                        {{conta.descricao}}
                        <span class="pl-5 text-black-50 text-sm">Clique para mais detalhes</span>
                    </div>
                    <div> |<i class="fa fa-trash text-danger px-2"></i></div>
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
                contas: [],
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
                    });
                this.loading = false;
            }
        }
    }
</script>

<style scoped>
label {
  color: dimgray;
}

.text-sm {
  font-size: 0.8em;
}
</style>