<template>
  <div v-if="filter.length">
    <hr class="my-2">
    <div v-b-toggle.filter>
      <b-icon :icon="`box-arrow-${(!visible)? 'down':'up'}`" />
        <span> {{ (!visible)?'Mostrar':'Esconder' }} </span>
        Filtros
    </div>
    <b-collapse id="filter" v-model="visible" class="col-12 px-0">
      <div class="row mx-0">
        <template v-for="f in filter">
          <div v-if="Array.isArray(f.type) && f.show!=false" :key="f.name"
            class="col-12 col-lg-2 my-1 my-lg-0 px-0 d-flex align-items-center">
            <label class="w-75 text-left text-lg-right smallText my-0 pr-2" :for="f.name"> {{ f.name }}: </label>
            <select v-model="f.value" @change="change()" :name="f.name" :id="f.name"
              class="form-control px-1 smallText">
              <option v-for="(t,i) in f.type" :key="`${t}${i}`" :value="(i==0?null:(i==1))"> {{ t }} </option>
            </select>
          </div>
          <div v-if="f.type=='Text' && f.show!=false" :key="f.name"
            class="col-12 col-lg-4 my-1 my-lg-0 px-0 d-flex align-items-center">
            <label class="w-25 text-left text-lg-right smallText my-0 pr-2" :for="f.name"> {{ f.name }}: </label>
            <input v-model="f.value" @keypress="change()" :name="f.name" type="text" class="form-control smallText"
              :placeholder="`Digite para buscar...`" />
          </div>
          <div v-if="f.type=='Date' && f.show!=false" :key="f.name" class="col-12 col-lg-6 mt-1 px-0">
            <div class="row mx-0 align-items-center">
              <span class="col px-0 text-left text-lg-right smallText my-0 pr-2" :for="f.name"> {{ f.name }}: </span>
              <input v-model="f.value[0]" @change="change()" :name="f.name" type="date"
                class="col-5 px-1 form-control smallText" />
              <input v-model="f.value[1]" @change="change()" :name="f.name" type="date"
                class="col-5 px-1 form-control smallText" />
            </div>
          </div>
        </template>
      </div>
    </b-collapse>
    <hr class="my-2">
  </div>
</template>

<script>
  export default {
    props: {
      filter: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data() {
      return {
        visible: false,
      }
    },
    methods: {
      change() {
        this.$emit('change', this.filter)
      },
    }
  }
</script>

<style scoped>
.smallText {
  font-size: small;
}
</style>