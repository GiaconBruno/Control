<template>
  <div class="col-12 col-md-6 col-lg-4 offset-lg-8 d-flex align-items-center justify-content-center">
    <div class="py-5 px-4 bg-white w-100 text-left position-relative">
      <div :class="{'not-allowed':(!servidor)}" class="bg-white position-absolute"></div>
      <div v-if="loading" class="alert bg-warning alert-dismissible fade show" role="alert">
        <div v-if="loading" class="spinner-border spinner-border-sm mr-3" role="status"></div>
        Aguarde
      </div>
      <div v-else :class="(servidor)? 'bg-success' : 'bg-danger' " class="alert alert-dismissible fade show text-white"
        role="alert">
        Servidor: <strong> {{ (servidor)? 'Online!' : 'Offline!'}} </strong>
      </div>
      <div v-if="(!servidor && (!loading))" @click="status()" :class="{'alert': (!loading)}"
        class="m-0 p-0 text-center">
        <button type="button" class="btn btn-sm btn-outline-secondary">Consultar</button>
      </div>
      <div class="position-relative">
        <label for="login">Usuário:</label>
        <input @blur="valid('login')" id="login" type="text" v-model="user" class="form-control"
          placeholder="Digite seu usuário" />
        <span class="position-absolute">
          <i class="fa fa-user"></i>
        </span>
      </div>
      <div class="position-relative">
        <label for="password">Senha:</label>
        <input @keypress.enter="sigIn()" @blur="valid('password')" id="password" type="password" v-model="password"
          class="form-control" placeholder="Digite sua senha" />
        <span class="position-absolute">
          <i class="fas fa-lock"></i>
        </span>
      </div>
      <div class="mt-5 text-right">
        <button @click="sigIn()" :disabled="loading" class="form-control btn btn-success">
          <i class="fas fa-sign-in-alt mr-5"></i>
          <span class="text-white mr-5"> Entrar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
export default {
  data() {
    return {
      loading: false,
      servidor: false,
      user: "",
      password: "",
    };
  },
  beforeMount() {
    this.status();
  },
  methods: {
    async status() {
      this.loading = true;
      await this.axios
        .get(`${this.api}`)
        .then((response) => {
          console.log(response.data.start);
          this.servidor = true;
        })
        .catch((err) => {
          console.log(err);
          this.servidor = false;
        });
      this.loading = false;
    },
    valid(payload) {
      if (payload == "login" || !payload) {
        let styleUser = document.querySelector("#login").style;
        let spanUser = document.querySelectorAll("span.position-absolute")[0]
          .style;

        styleUser.borderColor = !this.user ? "#dd1818aa" : "#333";
        spanUser.color = !this.user ? "#dd1818aa" : "dimgray";
      }

      if (payload == "password" || !payload) {
        let stylePass = document.querySelector("#password").style;
        let spanPass = document.querySelectorAll("span.position-absolute")[1]
          .style;

        stylePass.borderColor = !this.password ? "#dd1818aa" : "#333";
        spanPass.color = !this.password ? "#dd1818aa" : "dimgray";
      }
    },
    async sigIn() {
      this.valid();
      if (!this.user || !this.password) return;
      this.status();

      this.loading = true;
      await this.axios
        .post(`${this.api}/autenticar`, {
          usuario: this.user,
          senha: this.password,
        })
        .then((response) => {
          localStorage.setItem("auth", JSON.stringify(response.data));
          this.$router.push("/home");
        })
        .catch((err) => {
          console.log("" + err);
        });
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.not-allowed {
  cursor: not-allowed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.4;
  z-index: 10;
}

.alert {
  z-index: 11;
}

.col-12 {
  height: 100vh;
}

.bg-white {
  border-radius: 5px;
  background-color: #ffffffcc !important;
}

label {
  margin: 1.5rem 0 0.5rem 0;
  color: dimgray;
}

input.form-control {
  height: 30px;
  padding: 0 0 0 2.5rem;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #333;
  background-color: transparent;
}

input.form-control:focus {
  outline-width: 0;
  box-shadow: none;
}

span {
  top: 60px;
  left: 10px;
}

span {
  color: dimgray;
}
</style>