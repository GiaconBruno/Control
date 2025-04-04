<template>
  <section>
    <div class="row mx-0 justify-content-center">
      <Header @R="$emit('R')" @CV="$emit('CV', $event)" @SEU="$emit('SEU',$event)" />
    </div>
    <div id="overflow" class="row mx-0 justify-content-center">
      <div v-for="(i, x) in info" :key="x" @click="action(i.action, x)" class="btn col-10 col-lg-4 my-lg-3 mx-0">
        <div :class="i.color" class="small-box">
          <div class="inner px-4">
            <p class="col-9 col-lg-8 px-0 my-3 text-start">{{ i.title}}</p>
          </div>
          <div class="icon">
            <i v-if="!i.loading" :icon="i.icon" />
            <i v-else class="fas fa-spinner fa-pulse" role="status" />
          </div>
          <div class="small-box-footer py-2"></div>
        </div>
      </div>
    </div>
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
        info: [{
          action: 'statusContas',
          title: 'Corrigir Status de Contas',
          color: 'bg-success',
          icon: 'file-earmark-check-fill',
          loading: false
        }, {
          action: 'vincUsuariosConta',
          title: 'Corrigir Vinculação de Usuários',
          color: 'bg-success',
          icon: 'file-earmark-person-fill',
          loading: false
        }],
      }
    },
    methods: {
      action(action, i) {
        this.info[i].loading = true;
        this.dashboard = [];
        this.$store.dispatch(action)
          .then(response => this.$toast(response.mensagem, 'success'))
          .finally(() => this.info[i].loading = false)
      },
    }
  }
</script>

<style scoped>
#overflow {
  max-height: calc(85dvh - 155px);
  overflow-y: auto;
}

a {
  text-decoration: none;
}

.smallText {
  font-size: small;
}

.small-box {
  border-radius: 0.25rem;
  box-shadow: 0 0 1px rgb(0 0 0 / 13%), 0 1px 3px rgb(0 0 0 / 20%);
  display: block;
  margin-bottom: 20px;
  position: relative;
}

.small-box > .inner {
  padding: 10px;
}

.bg-success,
.bg-danger,
.bg-success > a,
.bg-danger > a {
  color: #fff !important;
}

.small-box .icon {
  color: rgba(0, 0, 0, 0.15);
  z-index: 0;
}

.small-box .icon > svg,
.small-box .icon > i {
  font-size: 50px;
  position: absolute;
  right: 10%;
  top: 20%;
  transition: -webkit-transform 0.3s linear;
  transition: transform 0.3s linear;
  transition: transform 0.3s linear, -webkit-transform 0.3s linear;
}

.small-box:hover .icon > svg {
  -webkit-transform: scale(1.1);
  transform: scale(1.5);
}

.small-box .icon > svg.i {
  font-size: 50px;
  top: 25%;
}

.small-box > .small-box-footer {
  background-color: rgba(0, 0, 0, 0.1);
  color: rgba(255, 255, 255, 0.8);
  display: block;
  padding: 3px 0;
  position: relative;
  text-align: center;
  text-decoration: none;
  z-index: 10;
}

@media screen and (max-width: 768px) {
  #overflow {
    max-height: calc(85dvh - 135px);
  }
}
</style>