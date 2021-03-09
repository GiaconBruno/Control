<template>
  <div class="row m-0 justify-content-center">
    <div v-if="(usuarios.length)" class="col-12 col-lg-6 card border-secondary p-3">
      <label class="m-0"> {{ title }} </label>
      <hr class="mt-2" />
      <div class="row">
        <div class="col-12 text-left">
          <label for="conta">Descrição:</label>
          <div class="position-relative">
            <i class="fa fa-folder text-gray"></i>
            <input v-model="conta.descricao" type="text" name="conta" id="conta" class="form-control"
              placeholder="Digite a descrição da conta" />
          </div>
        </div>
        <div class="col-12 text-left">
          <label for="usuario">Quem pode visualizar?</label>
          <div class="position-relative">
            <i class="fa fa-user text-gray"></i>
            <div class="row m-0 mb-3">
              <div class="col-11 px-0">
                <select v-model="usuario" :class="{'text-sm': (usuario==null)}" name="usuarios" id="usuario"
                  class="form-control py-0">
                  <option :value="null" class="form-control">Selecione..</option>
                  <option v-for="user in (listaUsers)" :key="user.id" :value="user.id" class="form-control">
                    {{user.nome}} @{{user.usuario}}
                  </option>
                </select>
              </div>
              <div class="col-1 p-0">
                <i @click="addUsuario(usuario)" class="fa fa-plus btn btn-primary px-0 py-1 text-white w-100"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 text-center">
          <div class="row m-0 position-relative">
            <div v-for="(contaUsuario, ci) in fk_usuario_id" :key="contaUsuario"
              class="col-auto p-2 pt-3 m-2 alert-success text-sm rounded">
              {{ usuarios[usuarios.findIndex(user => (user.id == contaUsuario))].nome }}
              @{{ usuarios[usuarios.findIndex(user => (user.id == contaUsuario))].usuario }}
              <i v-if="(ci>0)" @click="removeUsuario(ci)" class="fa fa-times text-danger"></i>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="row mt-4 justify-content-around">
        <button @click="functions.changeVisible('TodasContas')" class="btn btn-sm btn-danger">Cancelar</button>
        <button @click="createConta()" :disabled="loading" class="btn btn-sm btn-success">{{action}}
          <div v-if="loading" class="spinner-border spinner-border-sm ml-2" role="status"></div>
        </button>
      </div>
    </div>
    <div v-else class="spinner-border spinner-border-sm my-2" role="status"></div>
  </div>
</template>

<script>
  export default {
    props: ['functions', 'contaEdit'],
    data() {
      return {
        loading: false,
        conta: {},
        fk_usuario_id: [],
        usuario: null,
        usuarios: [],
        title: 'Criar Conta',
        url: 'contas',
        mensagem: 'Conta criada com exito!',
        action: 'Criar',
      }
    },
    async beforeMount() {
      await this.getUsuarios();

      let auth = JSON.parse(localStorage.getItem("auth"));
      this.usuarios.map(user => {
        if (user.id == auth.id) this.fk_usuario_id.push(user.id);
      });

      if (this.contaEdit.id) {
        this.conta.descricao = this.contaEdit.descricao;
        this.title = 'Editar Conta';
        this.action = 'Alterar';
        this.url = `atualizar-conta/${this.contaEdit.id}`;
        this.mensagem = 'Conta Atualizada com exito!';

        this.fk_usuario_id = (this.contaEdit.fk_usuario_id.replace(/[['\]]/g, "").split(",")).map(c => parseInt(c));
      }
    },
    computed: {
      listaUsers() {
        let users = [];
        this.usuarios.forEach(user => {
          if ((this.fk_usuario_id).includes(user.id) == false)
            users.push(user);
        });
        return users;
      }
    },
    methods: {
      async getUsuarios() {
        let auth = JSON.parse(localStorage.getItem("auth"));
        await this.axios
          .get(`${this.api}/api/usuarios`, {
            headers: {
              token: auth.token,
            }
          })
          .then((response) => {
            this.usuarios = response.data;
          })
          .catch((err) => {
            console.log("" + err);
            this.$router.push("/");
          });
      },
      addUsuario(payload) {
        if (payload) {
          this.fk_usuario_id.push(payload);
          this.usuario = null;
        }
      },
      removeUsuario(payload) {
        if (payload) {
          this.fk_usuario_id.splice(payload, 1);
        }
      },
      async createConta() {
        if (!this.conta.descricao) {
          this.$toasted.show(`Preencha a Descrição`, {
            iconPack: "fontawesome",
            icon: "times",
            duration: 3000,
            className: "bg-danger",
            theme: "bubble",
          });
          return
        }

        let contas = String(`[${this.fk_usuario_id.map(user => `'${user}'`)}]`);
        this.conta.fk_usuario_id = contas;

        this.loading = true;
        let auth = JSON.parse(localStorage.getItem("auth"));
        await this.axios
          .post(`${this.api}/api/${this.url}`, this.conta, {
            headers: {
              token: auth.token,
            }
          })
          .then(() => {
            this.$toasted.show(`${this.mensagem}`, {
              iconPack: "fontawesome",
              icon: "check",
              duration: 3000,
              className: "bg-success",
              theme: "bubble",
            });
            this.loading = false;
            this.functions.changeVisible('TodasContas')
          })
          .catch((err) => {
            console.log("" + err);
            this.$router.push("/");
          });
        this.loading = false;
      }
    }
  }
</script>

<style scoped>
label {
  margin: 1rem 0 0 0;
}

.fa:not(.fa-plus) {
  color: dimgray;
  top: 5px;
  left: 5px;
  position: absolute;
  z-index: 9;
}

.fa.fa-times {
  left: auto;
  right: 5px;
  cursor: pointer;
}

input,
select {
  height: 25px;
  padding-left: 30px;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #333;
}

input:focus,
select:focus {
  border-color: #28a745;
  box-shadow: none;
}

input::placeholder,
.text-sm {
  font-size: 12px;
}

hr {
  margin: 1rem -15px 0 -15px;
  border-color: #888888aa;
}

.btn:not(.fa-plus) {
  min-width: 100px;
}
</style>