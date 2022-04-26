<template>
  <section>
    <h3 class="my-md-2">Mensagens</h3>
    <div class="row mx-0 my-md-3 justify-content-center">
      <div class="col-md-auto">
        <button @click="getMessage('Received')" class="btn btn-sm btn-info">Recebidas</button>
      </div>
      <div class="col-md-auto">
        <button @click="getMessage('Send')" class="btn btn-sm btn-secondary">Enviadas</button>
      </div>
      <div class="col-md-auto">
        <button class="btn btn-sm btn-success">Criar</button>
      </div>
    </div>
    <template v-if="!loading">
      <div v-for="msg in mensagens" :key="msg.id">
        <div @click="see(msg.id)" v-b-toggle="`msg-${msg.id}`"
          :class="[(type)?'alert-info':'alert-secondary', (!msg.status && type)?'font-weight-bold':'font-weight-normal']"
          class="row mx-0 alert text-left my-0 px-1 px-md-2 smallText">
          <div class="col-4 px-1 px-md-2"> {{ msg.titulo }} </div>
          <div class="col px-1 px-md-2">para: @{{ msg.ref_remetente.usuario }} </div>
          <div class="col-auto px-1 px-md-2"> {{ formatDate(msg.created_at) }} </div>
          <div v-if="type" class="col-auto px-1 px-md-2">
            <b-icon :icon="`${!msg.status?'eye-fill':'eye-slash-fill'}`" />
          </div>
        </div>
        <b-collapse :id="`msg-${msg.id}`" accordion="mensagem"
          class="mx-2 rounded-bottom px-1 px-md-2 bg-dark text-white text-left" role="tabpanel">
          <div class="font-weight-light smallText py-1 py-md-2"> {{ msg.mensagem }} </div>
        </b-collapse>
        <div class="mt-2 mt-md-3" />
      </div>
    </template>
    <div v-else class="fas fa-4x fa-spinner fa-pulse text-success m-5" role="status"></div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        mensagens: [],
        type: 1,
      }
    },
    beforeMount() {
      this.getMessage('Received')
    },
    methods: {
      getMessage(payload) {
        this.loading = true;
        this.type = (payload == 'Received') ? 1 : 0;
        this.$store.dispatch(`getNotify${payload}`)
          .then(response => this.mensagens = response)
          .catch(er => this.toast(er.data.mensagem, 'times'))
          .finally(() => this.loading = false)
      },
      see(payload) {
        const find = this.mensagens.findIndex(msg => msg.id == payload);
        console.log(find);
        this.mensagens[find].status = true;
        // this.dispatch('updateNotify', payload)
        //   .catch(er => this.toast(er.data.mensagem, 'times'))
      }
    }
  }
</script>

<style scoped>
.smallText {
  font-size: small;
}
</style>