<template>
  <div class="py-4 py-lg-5 px-4 bg-white w-100 text-left position-relative">
    <div :class="{'not-allowed':(!servidor)}" class="bg-white position-absolute"></div>
    <div v-if="loading" class="alert bg-warning alert-dismissible fade show" role="alert">
      <div class="spinner-border spinner-border-sm mr-3" role="status"></div>
      <strong>Aguarde!</strong>
    </div>
    <div v-else :class="(servidor)? 'bg-success' : 'bg-danger' " class="alert alert-dismissible fade show text-white"
      role="alert">
      Servidor: <strong> {{ (servidor)? 'Online!' : 'Offline!'}} </strong>
    </div>
    <div v-if="(!servidor && (!loading))" :class="{'alert': (!loading)}" class="m-0 p-0 text-center">
      <button @click="status()" type="button" class="btn btn-sm btn-outline-secondary">Consultar</button>
    </div>
    <div :class="{'hasError': errors.includes('login')}" class="position-relative">
      <label for="login">Usuário:</label>
      <input v-model="user" @blur="valid('login')" @keypress="valid('login')" id="login" type="text"
        class="form-control" placeholder="Digite seu usuário" />
      <span class="position-absolute">
        <i class="fa fa-user"></i>
      </span>
    </div>
    <div :class="{'hasError': errors.includes('password')}" class="position-relative">
      <label for="password">Senha:</label>
      <input v-model="password" @keypress.enter="sigIn()" @blur="valid('password')" @keypress="valid('password')"
        id="password" type="password" class="form-control" placeholder="Digite sua senha" />
      <span class="position-absolute">
        <i class="fas fa-lock"></i>
      </span>
    </div>
    <div class="mt-3 text-right">
      <button @click="sigIn()" :disabled="loading" class="form-control btn btn-success">
        <i class="fas fa-sign-in-alt mr-2 mr-sm-5"></i>
        <span class="text-white mr-2 mr-sm-5"> Entrar</span>
      </button>
      <button @click="$router.push('/cadastro')" :disabled="loading" class="form-control btn btn-primary mt-3">
        <i class="fas fa-user-circle mr-2 mr-sm-5"></i>
        <span class="text-white mr-2 mr-sm-5"> Criar</span>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['changeVisible'],
    data() {
      return {
        loading: false,
        servidor: false,
        user: "admin",
        password: "n3x4n5",
        errors: [],
      };
    },
    beforeMount() {
      this.status();
    },
    methods: {
      status() {
        this.loading = true;
        this.$store.dispatch('status')
          .then(response => {
            console.log(response.data.start);
            this.servidor = true;
            this.$store.commit('GET_ACCESS');
            if (this.access.auth && this.access.auth.id) this.$router.push("/contas");
          })
          .catch(er => {
            console.log(er);
            localStorage.clear();
            this.servidor = false
          })
          .finally(() => this.loading = false)
      },
      valid() {
        this.errors = [];
        if (!this.user) this.errors.push('login')
        else this.errors.splice(this.errors.findIndex(e => e == 'login'), 1)
        if (!this.password) this.errors.push('password')
        else this.errors.splice(this.errors.findIndex(e => e == 'password'), 1)
      },
      sigIn() {
        this.valid();
        if (!this.user || !this.password) {
          this.$toasted.show("Preencha os dados", {
            iconPack: "fontawesome",
            icon: "times",
            duration: 3000,
            className: "bg-danger",
            theme: "bubble",
          });
          return;
        }
        this.status();

        this.user = this.user.toLowerCase();
        this.loading = true;

        let payload = {
          usuario: this.user,
          senha: this.password,
        }
        this.$store.dispatch('sigIn', payload)
          .then(() => this.$router.push("/contas"))
          .catch((er) => console.log(er))
          .finally(() => this.loading = false)
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

.hasError label,
.hasError span {
  color: #dc3545;
}

.hasError input {
  border-color: #dc3545;
}
</style>