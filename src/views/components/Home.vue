<template>
  <section class="py-5">
    <div v-if="usuario" class="container">
      <div class="d-block text-right p-3 pb-2">
        <span @click="sigOut()" class="btn">
          <i class="fas fa-sign-in-alt"></i> Sair
        </span>
      </div>
      <hr class="mt-0" />
      <div class="row">
        <div class="col-12 col-md-11 offset-md-1 d-flex justify-content-between align-items-center">
          <h2>
            <span class="smallText">Bem Vindo, </span> {{ usuario }}
          </h2>
          <div><i class="fa fa-edit px-2 float-right"></i></div>
        </div>
      </div>
      <hr />
      <contas />
    </div>
  </section>
</template>

<script>
  import Contas from './Contas.vue';
  export default {
    components: {
      Contas
    },
    data() {
      return {
        usuario: null,
      }
    },
    beforeMount() {
      this.tokenValido();
    },
    methods: {
      async tokenValido() {
        let auth = this.auth()
        if (!auth) return

        // let auth = JSON.parse(localStorage.getItem("auth"));
        await this.axios
          .get(`${this.api}/api/usuario/${auth.id}`)
          .then((response) => {
            this.usuario = response.data.nome;
          })
          .catch((err) => {
            console.log("" + err);
            this.$toasted.show("Dados não autorizados!", {
              iconPack: "fontawesome",
              icon: "times",
              duration: 3000,
              className: "bg-danger",
              theme: "bubble",
            });
          });
      },
      sigOut() {
        localStorage.clear();
        this.$router.push("/");
      },
    },
  };
</script>

<style scoped>
section {
  min-height: 100vh;
}

.container {
  min-height: calc(100vh - 6rem);
  border-radius: 5px;
  background: ghostwhite;
}

.smallText {
  font-size: large;
}
</style>