<template>
  <div>
    <div v-show="!loading" class="py-4 py-lg-5 px-4 bg-white w-100 text-left position-relative">
      <div :class="{'not-allowed':(!servidor && !loading)}" class="bg-white position-absolute"></div>
      <div v-if="loadServ" class="alert bg-warning alert-dismissible fade show" role="alert">
        <div class="spinner-border spinner-border-sm mr-3 my-1" role="status"></div>
        <strong>Aguarde!</strong> <small> ({{ timer.toString().padStart(2,0) }}) </small>
      </div>
      <div v-else :class="(servidor)? 'bg-success' : 'bg-danger' " class="alert alert-dismissible fade show text-white"
        role="alert">
        Servidor: <strong> {{ (servidor)? 'Online!' : 'Offline!'}}</strong>
        <small> ({{ timer.toString().padStart(2,0) }}) </small>
      </div>
      <div v-if="(!servidor && !loading)" :class="{'alert': (loadServ)}" class="m-0 p-0 text-center">
        <button @click="status()" type="button" class="btn btn-sm btn-outline-secondary position-relative"
          style="z-index:11;">
          Consultar
        </button>
      </div>
      <div :class="{'hasError': errors.includes('login')}" class="position-relative">
        <label for="login">Usuário:</label>
        <input v-model="user" @blur="valid('login')" @keyup="valid('login')" id="login" type="text" class="form-control"
          placeholder="Digite seu usuário" />
        <span class="position-absolute">
          <i class="fa fa-user"></i>
        </span>
      </div>
      <div :class="{'hasError': errors.includes('password')}" class="position-relative">
        <label for="password">Senha:</label>
        <input v-model="password" @keypress.enter="sigIn()" @blur="valid('password')" @keyup="valid('password')"
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
        <button @click="create()" :disabled="loading" class="form-control btn btn-primary mt-3">
          <i class="fas fa-user-circle mr-2 mr-sm-5"></i>
          <span class="text-white mr-2 mr-sm-5"> Criar</span>
        </button>
      </div>
    </div>
    <div v-if="loading" class="m-auto">
      <i class="fas fa-4x fa-spinner fa-pulse text-light" role="status"></i>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['changeVisible'],
    data() {
      return {
        loading: false,
        loadServ: false,
        servidor: false,
        user: "",
        password: "",
        errors: [],
        reload: Function,
        interval: Function,
        timer: 0,
      };
    },
    mounted() {
      this.status();
    },
    methods: {
      status() {
        this.loadServ = true;
        this.awaitingStart();
        this.$store.dispatch('status')
          .then(response => {
            console.log(response.data.join('\n'));
            this.servidor = true;
            clearInterval(this.reload);
            this.$store.commit('GET_ACCESS');
            if (this.access.auth && this.access.auth.id) this.$router.push("/dashboard");
          })
          .catch(() => {
            this.servidor = false
            localStorage.clear();
            this.reload = setTimeout(() => this.status(), 10000);
          })
          .finally(() => {
            this.loadServ = false;
            clearInterval(this.interval);
          })
      },
      valid() {
        this.errors = [];
        if (!this.user) this.errors.push('login')
        if (!this.password) this.errors.push('password')
      },
      awaitingStart() {
        this.timer = 0;
        if (this.loadServ)
          this.interval = setInterval(() => this.timer++, 1000);
      },
      sigIn() {
        this.valid();
        if (!this.user || !this.password) {
          this.toast('Preencha os dados', 'times')
          return;
        }
        this.status()
        this.loading = true;

        this.user = this.user.toLowerCase();

        let payload = {
          usuario: this.user,
          senha: this.password,
        }
        this.$store.dispatch('sigIn', payload)
          .then(() => {
            this.$router.push("/dashboard")
          })
          .catch(er => {
            if (er) this.toast(er.data.mensagem, 'times')
            localStorage.clear();
          })
          .finally(() => this.loading = false)
      },
      create() {
        localStorage.clear();
        this.$router.push('/cadastro')
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

  [class*="bg-"] {
    transition: all 0.3s;
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