<template>
  <div class="row py-0 px-2 my-2 mx-0 justify-content-between align-items-center alert alert-secondary">
    <template v-if="pagination.limit">
      <small> {{ pagination.total || 0 }} Registros</small>
      <div class="d-flex align-items-center">
        <b-pagination v-model="pagination.current" @change="aplly()" :total-rows="pagination.total"
          :per-page="pagination.limit" :class="'m-0'" />
        <div class="col-auto d-flex justify-content-center align-items-center px-0">
          <small class="mx-1 mx-lg-2"> Exibir: </small>
          <select v-model="pagination.limit" @change="aplly()" class="form-control px-1 px-lg-2 col-8 col-lg-7">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pagination: {
          current: 1,
          limit: 5,
          total: 0,
        }
      }
    },
    beforeMount() {
      // this.$emit('change', this.pagination)
    },
    methods: {
      update(total) {
        this.pagination.total = total;
      },
      aplly() {
        setTimeout(() => {
          this.$emit('change', this.pagination)
        }, 100);
      }
    }
  }
</script>

<style scopped>
@media screen and (max-width: 768px) {
  small {
    font-size: x-small;
  }
}
</style>