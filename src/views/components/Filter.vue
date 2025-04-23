<template>
  <div v-if="filter.length">
    <hr class="my-1">
    <div @click="visible=!visible" class="pointer">
      <i :class="`fa fa-circle-chevron-${(!visible)? 'down':'up'}`" class="me-1" />
      <span> {{ (!visible)?'Mostrar':'Esconder' }} </span> Filtros
    </div>
    <BCollapse id="filter" v-model="visible" class="col-12 px-0" accordion="filter">
      <div class="row mx-0">
        <template v-for="f in filter">
          <div v-if="f.type=='Text' && f.show!=false" :key="f.name"
            class="col-12 col-lg-6 mt-1 px-0 pe-2 d-flex align-items-center">
            <label class="col-3 col-lg-3 text-start smallText my-0" :for="f.name">{{ f.name }}:</label>
            <input v-model="f.value" @keypress="change()" :name="f.name" type="text" class="form-control ms-2 smallText"
              :placeholder="`Digite para buscar...`" />
          </div>
          <div v-if="Array.isArray(f.type) && f.show!=false" :key="f.name"
            class="col-12 col-lg-6 mt-1 px-0 pe-2 d-flex align-items-center">
            <label class="col-3 col-lg- text-start smallText my-0" :for="f.name">{{ f.name }}:</label>
            <select v-model="f.value" @change="change()" :name="f.name" :id="f.name"
              class="form-control smallText ms-2">
              <option v-for="(t,i) in f.type" :key="`${t}${i}`" :value="(i==0?null:(i==1))"> {{ t }} </option>
            </select>
          </div>
          <div v-if="f.type=='Date' && f.show!=false" :key="f.name" class="col-12 col-lg-6 mt-1 px-0 pe-2">
            <div class="row mx-0 align-items-center">
              <span class="col-3 px-0 text-start smallText my-0" :for="f.name"> {{ f.name }}: </span>
              <div class="col ps-2 pe-0">
                <input v-model="f.value[0]" @change="change()" :name="f.name" type="date"
                  class="form-control smallText" />
              </div>
              <div class="col ps-2 pe-0">
                <input v-model="f.value[1]" @change="change()" :name="f.name" type="date"
                  class="form-control smallText" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </BCollapse>
    <hr class="my-1">
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
        this.$emit('hasChange', this.filter)
      },
    }
  }
</script>

<style scoped>
.smallText {
  font-size: x-small;
}
</style>