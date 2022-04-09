<template>
  <section>
    <div class="row mx-0 justify-content-center">
      <Header @R="$emit('R')" @CV="$emit('CV', $event)" @SEU="$emit('SEU',$event)" />
    </div>
    <div class="row mx-auto my-lg-3 px-0 px-lg-3 justify-content-center align-items-center">
      <small class="d-none d-lg-block px-3">Período: </small>
      <small><input v-model="periodo" type="date" class="form-control" /></small>
      <small class="d-none d-lg-block px-3">Status: </small>
      <div v-for="s in status" :key="s.title" @click="getLogs(s.title)" class="btn px-1 px-lg-3 text-white">
        <p :class="s.color" class="rounded py-1 px-2 m-0"> {{ s.title }} </p>
      </div>
    </div>
    <div v-if="info.length && !loading" id="overflow">
      <div v-for="(i, y) in info" :key="y" class="row mx-0 justify-content-center">
        <div class="col-3 px-0"> {{ i.createdAt }} </div>
        <div class="col-3 px-0"> {{ i.rota }} </div>
        <div class="col-3 px-0"> {{ i.usuario }} </div>
      </div>
    </div>
    <p v-else class="mx-0">Nenhum registro encontrado!</p>
  </section>
</template>

<script>
  import Header from '../Home/Header.vue';
  export default {
    components: {
      Header
    },
    data() {
      return {
        loading: false,
        periodo: new Date(Date.now()).toISOString().slice(0, 10),
        status: [{
          title: 200,
          color: 'bg-success'
        }, {
          title: 400,
          color: 'bg-warning'
        }, {
          title: 500,
          color: 'bg-danger'
        }],
        info: [],
      }
    },
    beforeMount() {
      // this.getLogs(200);
      this.info.push({
        createdAt: this.periodo.split('-').reverse().join('/'),
        rota: 'api/rota',
        usuario: '@alguem'
      });
    },
    methods: {
      getLogs(status) {
        this.loading = true;
        this.info = [];
        this.$store.dispatch('getLogs', {
            periodo: this.periodo,
            status: status
          }).then(response => this.info = response)
          .catch(er => this.toast(er.data.mensagem, 'times'))
          .finally(() => this.loading = false)
      },
    }
  }
</script>

<style scoped>
#overflow {
  height: calc(85vh - 155px);
  overflow-y: auto;
}

a {
  text-decoration: none;
}

.smallText {
  font-size: small;
}

.form-control {
  font-size: 0.8rem;
}

@media screen and (max-width: 768px) {
  #overflow {
    height: calc(85vh - 135px);
  }
}
</style>