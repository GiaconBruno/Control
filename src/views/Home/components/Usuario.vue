<template>
  <div class="row mb-3">
    <div :class="(autorization) ? 'col-10 offset-1 col-md-6 offset-md-3 col-lg-4 offset-lg-4' : 'col-12 px-0' "
      class="card border-secondary p-3 shadow-lg">
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
          <div class="row m-0">
            <div class="col-7 px-0 text-left pt-3">
              <span v-if="(autorization && autorization.permissao)" @click="usuario.permissao = !usuario.permissao"
                class="btn d-flex p-0">
                <span class="mr-2">Permissao: </span>
                <b-form-checkbox v-model="usuario.permissao" switch>
                </b-form-checkbox>
              </span>
            </div>
            <div v-if="(autorization && autorization.id)" class="col-4 offset-1 px-0 text-left pt-3">
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
        <button @click="(autorization)? functions.changeVisible(rota):changeVisible('LogIn') "
          class="btn btn-sm btn-danger">Cancelar</button>
        <button @click="createUsuario()" :disabled="loading" class="btn btn-sm btn-success">{{action}}
          <div v-if="loading" class="spinner-border spinner-border-sm ml-2" role="status"></div>
        </button>
      </div>
    </div>
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
        url: 'usuario',
        rota: 'TodasContas',
        mensagem: 'Usuário cadastrado com exito!',
        action: 'Criar'
      }
    },
    beforeMount() {
      this.autorization = this.auth();
      if (this.usuarioEdit && this.usuarioEdit.id) {
        this.usuario = this.usuarioEdit;
        this.title = `Edição de Usuário`;
        this.url = `atualizar-usuario/${this.usuario.id}`;
        this.mensagem = `Usuário atualizado com exito!`;
        if (this.autorization.permissao) this.rota = `TodosUsuarios`;
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
      async createUsuario() {
        if (!this.valid()) return
        this.loading = true;
        this.usuario.usuario = this.usuario.usuario.toLowerCase();

        let response = await this.common.createUsuario(this.usuario, this.url);

        if (response) {
          if (response.status == 200) {
            this.$toasted.show(`${this.mensagem}`, {
              iconPack: "fontawesome",
              icon: "check",
              duration: 3000,
              className: "bg-success",
              theme: "bubble",
            });

            if (this.autorization) {
              if (this.usuarioEdit.id == this.autorization.id) {
                await this.common.sigIn(this.usuario);
                await this.functions.tokenValido();
              }
              this.usuario = {
                permissao: false,
                ativo: true,
              };
              this.functions.reset();
              this.functions.changeVisible(this.rota);
            } else {
              await this.common.sigIn(this.usuario);
              this.changeVisible('LogIn');
            }
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
        }
      },
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