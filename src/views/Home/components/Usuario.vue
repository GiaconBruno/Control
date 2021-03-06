<template>
  <div class="row mb-3">
    <div class="col-10 offset-1 col-md-6 offset-md-3 col-lg-4 offset-lg-4 card border-secondary p-3 shadow-lg">
      <label class="m-0">Cadastro de Usuário</label>
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
            <input v-model="usuario.usuario" type="text" name="usuario" id="usuario" class="form-control"
              placeholder="Digite um Usuário" />
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
          <div class="row m-0">
            <div class="col-7 px-0 text-left pt-3">
              <span @click="usuario.permissao = !usuario.permissao" class="btn d-flex p-0">
                <span class="mr-2">Permissao: </span>
                <b-form-checkbox v-model="usuario.permissao" switch></b-form-checkbox>
              </span>
            </div>
            <div class="col-4 offset-1 px-0 text-left pt-3">
              <span @click="usuario.ativo = !usuario.ativo" class="btn d-flex p-0">
                <span class="mr-2">Ativo:</span>
                <b-form-checkbox v-model="usuario.ativo" switch></b-form-checkbox>
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="row mt-4 justify-content-around">
        <button @click="functions.changeVisible('Contas')" class="btn btn-sm btn-danger">Cancelar</button>
        <button @click="createUsuario()" :disabled="loading" class="btn btn-sm btn-success">Criar
          <div v-if="loading" class="spinner-border spinner-border-sm ml-2" role="status"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['functions'],
    data() {
      return {
        loading: false,
        see: false,
        usuario: {
          permissao: false,
          ativo: true,
        },
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
            position: 'bottom-center'
          });
          return false;
        } else return true;
      },
      async createUsuario() {
        if (!this.valid()) return

        this.loading = true;
        let auth = JSON.parse(localStorage.getItem("auth"));
        this.usuario.token = auth.token;
        await this.axios
          .post(`${this.api}/api/usuario`, this.usuario)
          .then((response) => {
            if (response.status == 200) {
              this.$toasted.show("Usuário cadastrado com exito!", {
                iconPack: "fontawesome",
                icon: "check",
                duration: 3000,
                className: "bg-success",
                theme: "bubble",
              });
              this.usuario = {
                permissao: false,
                ativo: true,
              };
              this.functions.changeVisible('Contas');
            } else {
              this.$toasted.show(`${response.data.mensagem}`, {
                iconPack: "fontawesome",
                icon: "times",
                duration: 3000,
                className: "bg-danger",
                theme: "bubble",
              });
            }
            this.loading = false;
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
            this.loading = false;
          });
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