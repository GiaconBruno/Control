<template>
  <div class="row py-0 px-2 my-2 mx-0 justify-content-between align-items-center alert alert-secondary">
    <template v-if="pagination.limit">
      <div class="col-auto col-lg-auto px-0">
        <div class="row mx-0 small px-0 align-items-center justify-content-between">
          <small class="d-none d-lg-inline col-auto px-0 pe-1"> Exibir: </small>
          <select v-model="pagination.limit" @change="aplly()" class="form-control py-0 px-2 px-lg-3 w-auto text-end">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
      <BPagination v-model="pagination.current" @update:modelValue="aplly()" :total-rows="pagination.total"
        :per-page="pagination.limit" :class="'col-auto px-0 m-0'" size="sm" align="center" />
      <small class="col-auto px-0"> {{ pagination.total || 0 }} Registros</small>
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
          this.$emit('hasChange', this.pagination)
        }, 100);
      },
      reset() {
        this.pagination.current = 1;
      },
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