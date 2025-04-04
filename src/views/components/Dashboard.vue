<template>
  <section>
    <div class="row mx-0 justify-content-center">
      <Header @R="$emit('R')" @CV="$emit('CV', $event)" @SEU="$emit('SEU',$event)" />
    </div>
    <h3 class="my-md-2">Dashdoard</h3>
    <div id="overflow">
      <div class="row mb-2 mx-0 align-items-center">
        <div class="col-12 col-lg-3 px-1 px-lg-3">Período:</div>
        <div class="col-5 col-lg-3 px-1 px-lg-3">
          <input type="date" v-model="periodo[0]" class="form-control smallText" />
        </div>
        <div class="col-5 col-lg-3 px-1 px-lg-3">
          <input type="date" v-model="periodo[1]" class="form-control smallText" />
        </div>
        <button @click="getDash(true)" class="col-auto btn btn-sm btn-outline-success mx-2">
          <i class="fa fa-repeat" />
        </button>
      </div>
      <div class="row mx-0 justify-content-center align-items-center">
        <template v-if="!loadingDash && access.dash">
          <div v-for="(i, x) in info" :key="x" class="col-lg-5 mx-auto">
            <router-link :to="i.route">
              <div :class="i.color" class="small-box">
                <div class="inner px-4">
                  <h3><small> {{ (x==0)?(dashboard.qtdEntradas||0):(dashboard.qtdSaidas||0) }} </small>- {{ i.title}}
                  </h3>
                  <p class="text-start">Abertos:
                    {{ formatMoney((x==0)?(dashboard.abertoEntradas||0):(dashboard.abertoSaidas||0)) }}
                  </p>
                  <p class="text-start">Pagos:
                    {{ formatMoney((x==0)?(dashboard.pagosEntradas||0):(dashboard.pagosSaidas||0)) }} </p>
                </div>
                <div class="icon">
                  <i :class="`fa fa-${i.icon}`" />
                </div>
                <div class="small-box-footer py-2"></div>
              </div>
            </router-link>
          </div>
          <div class="col-11 xSmallText text-start">*Atualizado: {{ formatDate(access.dash.validate-(1000*60*30))}}
          </div>
        </template>
        <div v-else class="fas fa-4x fa-spinner fa-pulse text-success m-5" role="status"></div>
      </div>
      <div class="row mx-0 my-3 justify-content-center">
        <template v-if="!loadingGraphic && access.graphic">
          <div class="col-12 col-lg-11 mx-auto">
            <div class="card px-1 px-lg-3">
              <apexchart height="300px" :options="chartOptions" :series="series" />
            </div>
          </div>
          <div class="col-11 xSmallText text-start">*Atualizado: {{ formatDate(access.graphic.validate-(1000*60*30))}}
          </div>
        </template>
        <div v-else class="fas fa-4x fa-spinner fa-pulse text-success m-5" role="status"></div>
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
        loadingDash: false,
        loadingGraphic: false,
        info: [{
          route: '/entradas',
          title: 'Entradas',
          color: 'bg-success',
          icon: 'square-plus'
        }, {
          route: '/saidas',
          title: 'Saídas',
          color: 'bg-danger',
          icon: 'square-minus'
        }],
        periodo: [null, null],
        dashboard: {},
        series: [],
        chartOptions: {
          title: {
            text: 'Contas Pagas nos últimos 12 meses',
            align: 'center',
            style: {
              fontFamily: "Poppins"
            }
          },
          chart: {
            type: 'area',
            zoom: {
              enabled: false
            },
            toolbar: {
              show: false,
              tools: {
                download: false,
                selection: false,
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false,
                reset: false,
              },
            },
          },
          xaxis: {
            categories: [0],
            labels: {
              rotate: -45,
              rotateAlways: true,
            }
          },
          yaxis: {
            labels: {
              offsetX: -18,
              style: {
                fontSize: '10px',
              },
              formatter: (value) => {
                return parseFloat(value).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                });
              }
            },
          },
          colors: ['#237a57', '#D9534F'],
          dataLabels: {
            enabled: false,
            offsetY: -5,
            textAnchor: 'middle',
            style: {
              colors: ['#fff'],
              fontSize: '9px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 'normal',
            },
            background: {
              enabled: true,
              foreColor: '#333',
              padding: 4,
              borderRadius: 2,
              borderWidth: 1,
              borderColor: '#333',
              opacity: 0.8,
              dropShadow: {
                enabled: false,
              }
            },
            formatter: (value) => {
              return parseFloat(value).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              });
            }
          },
          stroke: {
            curve: 'smooth',
            width: 2.5
          },
          fill: {
            type: 'gradient',
            gradient: {
              type: "vertical",
              shade: 'white',
              shadeIntensity: 0.5,
              inverseColors: false,
              opacityFrom: 0.7,
              opacityTo: 0.9,
              stops: [0, 50, 100]
            }
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center'
          },
          grid: {
            clipMarkers: false,
            yaxis: {
              lines: {
                show: false
              }
            }
          },
          tooltip: {
            enabled: true,
            followCursor: true,
            y: {
              formatter: function (value) {
                return (value) ? value.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }) : (0).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })
              }
            }
          }
        },
      }
    },
    beforeMount() {
      this.getDash();
    },
    methods: {
      getDash(force) {
        this.loadingDash = true;
        this.dashboard = [];
        if (!this.periodo[0]) this.periodo[0] = this.dateToSend(new Date((new Date(Date.now())).getFullYear(), (
          new Date(Date.now()).getMonth()), 1)).slice(0, 10);
        if (!this.periodo[1]) this.periodo[1] = this.dateToSend(Date.now()).slice(0, 10);
        const payload = {
          periodo: this.periodo,
          force
        }
        this.$store.dispatch('getDashboard', payload)
          .then(response => {
            this.dashboard = response.dash
            this.getGraphic(force);
          })
          .finally(() => this.loadingDash = false)
      },
      getGraphic(force) {
        this.series = [];
        this.chartOptions.xaxis.categories = [];
        this.loadingGraphic = true;
        this.$store.dispatch('getGraphic', force)
          .then(response => {
            this.chartOptions.xaxis.categories = response.graphic.categories;
            this.series.push({
              name: 'Entradas',
              data: response.graphic.entradas
            }, {
              name: 'Saídas',
              data: response.graphic.saidas
            });
          })
          .finally(() => this.loadingGraphic = false)
      }
    }
  }
</script>

<style scoped>
  #overflow {
    max-height: calc(85dvh - 140px);
    overflow-y: auto;
  }

  a {
    text-decoration: none;
  }

  .smallText {
    font-size: small;
  }

  .xSmallText {
    font-size: x-small;
  }

  .small-box {
    border-radius: 0.25rem;
    box-shadow: 0 0 1px rgb(0 0 0 / 13%), 0 1px 3px rgb(0 0 0 / 20%);
    display: block;
    position: relative;
  }

  .small-box>.inner {
    padding: 10px;
  }

  .bg-success,
  .bg-danger,
  .bg-success>a,
  .bg-danger>a {
    color: #fff !important;
  }

  .small-box .icon {
    color: rgba(0, 0, 0, 0.15);
    z-index: 0;
  }

  .small-box .icon i {
    font-size: 90px;
    position: absolute;
    right: 10%;
    top: 20%;
    transition: -webkit-transform 0.3s linear;
    transition: transform 0.3s linear;
    transition: transform 0.3s linear, -webkit-transform 0.3s linear;
  }

  .small-box:hover .icon i {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }

  .small-box .icon i {
    font-size: 70px;
    top: 25%;
  }

  .small-box>.small-box-footer {
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
      max-height: calc(85dvh - 175px);
    }
  }
</style>