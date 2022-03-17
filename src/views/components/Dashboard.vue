<template>
  <section>
    <div v-if="info.length && !loading">
      <h3>Dashdoard</h3>
      <div class="row my-lg-4 mx-0">
        <div v-for="i in info" :key="i.title" class="col-lg-4 mx-auto">
          <router-link :to="i.route">
            <div :class="i.color" class="small-box">
              <div class="inner px-4">
                <h3><small> {{ i.qtd }} </small>- {{ i.title}} </h3>
                <p class="text-left">Abertos: {{ i.open}} </p>
                <p class="text-left">Pagos: {{ i.close}} </p>
              </div>
              <div class="icon">
                <b-icon :icon="i.icon"></b-icon>
              </div>
              <div class="small-box-footer py-2"></div>
            </div>
          </router-link>
        </div>
      </div>
      <div class="row mx-0 my-3">
        <div class="col-lg-10 mx-auto">
          <div class="card py-5">Graphic</div>
        </div>
      </div>
    </div>
    <div v-else class="fas fa-4x fa-spinner fa-pulse text-success m-5" role="status"></div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        info: [],
        loading: true,
      }
    },
    beforeMount() {
      this.getDash();
    },
    methods: {
      getDash() {
        this.info = [];
        this.loading = true;
        this.info = [{
          route: '/entradas',
          title: 'Entradas',
          qtd: 'X',
          open: 'R$ XX,xx',
          close: 'R$ XX,xx',
          color: 'bg-success',
          icon: 'patch-plus-fill'
        }, {
          route: '/saidas',
          title: 'Saídas',
          qtd: 'X',
          open: 'R$ XX,xx',
          close: 'R$ XX,xx',
          color: 'bg-danger',
          icon: 'patch-minus-fill'
        }]
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    }
  }
</script>

<style scoped>
section {
  height: calc(100vh - 185px);
  overflow-y: auto;
}
a {
  text-decoration: none;
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

.small-box .icon > svg {
  font-size: 90px;
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

.small-box .icon > svg.b-icon {
  font-size: 70px;
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
</style>