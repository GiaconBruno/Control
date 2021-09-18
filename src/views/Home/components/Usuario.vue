<template>
  <div class="row mx-0 mb-3">
    <div v-if="(usuario)" :class="($route.path=='/usuario') ? 'col-10 col-md-6 col-lg-4' : 'col-12 px-0'"
      class="card mx-auto border-secondary p-3 shadow-lg">
      <label class="m-0"> {{ title }} </label>
      <hr class="mt-2" />
      <div class="row px-3">
        <div class="col-12 text-left">
          <label for="nome">Nome:</label>
          <div class="position-relative">
            <i class="fa fa-address-card text-gray"></i>
            <input v-model="usuario.nome" type="text" name="nome" id="nome" class="form-control"
              placeholder="Digite o Nome" />
          </div>
        </div>
        <div class="col-12 text-left">
          <label for="usuario">Usuário:</label>
          <div class="position-relative">
            <i class="fa fa-user text-gray"></i>
            <input v-model="usuario.usuario" :disabled="(usuario.id)" type="text" name="usuario" id="usuario"
              class="form-control" placeholder="Digite um Usuário" />
          </div>
        </div>
        <div class="col-12 text-left">
          <label for="senha">Senha:</label>
          <div class="position-relative">
            <i class="fa fa-lock text-gray"></i>
            <input v-model="usuario.senha" :type="(see) ? 'text': 'password' " name="senha" id="senha"
              class="form-control" placeholder="Digite uma Senha" />
            <i @click="see=!see" :class="(see) ? 'fa-eye' : 'fa-eye-slash' " class="fa text-gray"></i>
          </div>
          <div v-if="(autorization && autorization.id)" class="row m-0">
            <div class="col-7 px-0 text-left pt-3">
              <span class="d-flex p-0">
                <b-form-checkbox v-model="usuario.permissao" switch>
                  <span>Permissao </span>
                </b-form-checkbox>
              </span>
            </div>
            <div class="col-4 offset-1 px-0 text-left pt-3">
              <span class="d-flex p-0">
                <b-form-checkbox v-model="usuario.ativo" switch>
                  <span>Ativo</span>
                </b-form-checkbox>
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="row mt-4 justify-content-around">
        <button @click="$router.go(-1)" class="btn btn-sm btn-danger">Cancelar</button>
        <button @click="(action=='Criar')?createUsuario():updateUsuario()" :disabled="loading"
          class="btn btn-sm btn-success">{{action}}
          <div v-if="loading" class="spinner-border spinner-border-sm ml-2" role="status"></div>
        </button>
      </div>
    </div>
    <div v-else class="fas fa-4x fa-spinner fa-pulse text-success my-2" role="status"></div>
  </div>
</template>

<script>
  export default {
    props: ['usuarioEdit', 'functions', 'changeVisible'],
    data() {
      return {
        loading: false,
        see: false,
        autorization: {},
        usuario: {
          permissao: false,
          ativo: true,
        },
        title: 'Cadastro de Usuário',
        action: 'Criar'
      }
    },
    beforeMount() {
      this.autorization = this.$store.state.default.access.auth;
      if (this.$store.state.default.access.userEdit && this.$store.state.default.access.userEdit.id) {
        this.usuario = this.$store.state.default.access.userEdit;
        this.title = `Edição de Usuário`;
        this.action = `Alterar`;
      }
    },
    methods: {
      valid() {
        if ((!this.usuario.nome) || (!this.usuario.usuario) || (!this.usuario.senha)) {
          this.$toasted.show("Preencha os dados", {
            iconPack: "fontawesome",
            icon: "times",
            duration: 3000,
            className: "bg-danger",
            theme: "bubble",
          });
          return false;
        } else return true;
      },
      createUsuario() {
        if (!this.valid()) return
        this.loading = true;
        this.usuario.usuario = this.usuario.usuario.toLowerCase();

        this.$store.dispatch('createUser', this.usuario)
          .then((response) => {
            this.$toasted.show(response.mensagem, {
              iconPack: "fontawesome",
              icon: "check",
              duration: 3000,
              className: "bg-success",
              theme: "bubble",
            });
            this.$router.push('/contas')
          })
          .catch((error) => this.$toasted.show(error.data.mensagem, {
            iconPack: "fontawesome",
            icon: "times",
            duration: 3000,
            className: "bg-danger",
            theme: "bubble",
          }))
          .finally(() => this.loading = false)
      },
      updateUsuario() {
        if (!this.valid()) return
        this.loading = true;
        this.usuario.usuario = this.usuario.usuario.toLowerCase();

        this.$store.dispatch('updateUser', this.usuario)
          .then(response => {
            this.$toasted.show(`${response.data.mensagem}`, {
              iconPack: "fontawesome",
              icon: "check",
              duration: 3000,
              className: "bg-success",
              theme: "bubble",
            });
            if (this.autorization) {
              if (this.$store.state.default.access.userEdit.id == this.autorization.id) {
                this.$store.dispatch('sigIn', this.usuario)
              }
              this.usuario = {
                permissao: false,
                ativo: true,
              };
              this.$router.push('/contas')
            }
          })
          .catch(() => this.$router.push("/"))
          .finally(() => this.loading = false)
      }
    }
  }
</script>

<style scoped>
label {
  margin: 1rem 0 0 0;
}

.fa {
  color: dimgray;
  top: 5px;
  left: 5px;
  position: absolute;
}

[class*="fa-eye"] {
  left: auto;
  right: 5px;
}

input {
  height: 25px;
  padding-left: 30px;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #333;
}

input:focus {
  border-color: #28a745;
  box-shadow: none;
}

input::placeholder {
  font-size: 12px;
}

hr {
  margin: 1rem -15px 0 -15px;
  border-color: #888888aa;
}

.btn {
  min-width: 100px;
}
</style>