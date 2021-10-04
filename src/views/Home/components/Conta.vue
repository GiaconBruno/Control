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
              <div class="col-12 px-0">
                <select v-model="usuario" @change="addUsuario(usuario)" :class="{'text-sm': (usuario==null)}"
                  name="usuarios" id="usuario" class="form-control py-0">
                  <option :value="null" class="form-control">Selecione..</option>
                  <option v-for="user in (listaUsers)" :key="user.id" :value="user.id" class="form-control">
                    {{user.nome}} @{{user.usuario}}
                  </option>
                </select>
              </div>
              <!-- <div class="col-1 p-0">
                <i @click="addUsuario(usuario)" class="fa fa-plus btn btn-primary px-0 py-1 text-white w-100"></i>
              </div> -->
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
        <button @click="$router.go(-1)" class="btn btn-sm btn-danger">Cancelar</button>
        <button @click="(action=='Criar')?createConta():updateConta()" :disabled="loading"
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
    data() {
      return {
        loading: false,
        conta: {},
        fk_usuario_id: [],
        usuario: null,
        usuarios: [],
        title: 'Criar Conta',
        action: 'Criar',
      }
    },
    beforeMount() {
      this.loading = true
      this.$store.dispatch('getUserContas')
        .then(response => {
          this.usuarios = response
        })
        .catch((er) => console.log(er))
        .finally(() => this.loading = false)

      this.fk_usuario_id.push(this.access.auth.id);
      if (this.access.contaEdit && this.access.contaEdit.id) {
        this.conta.descricao = this.access.contaEdit.descricao;
        this.title = 'Editar Conta';
        this.action = 'Alterar';
        this.fk_usuario_id =
          (this.access.contaEdit.fk_usuario_id.replace(/[['\]]/g, "")
            .split(",")).map(c => parseInt(c));
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
      createConta() {
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
        this.loading = true;
        let contas = String(`[${this.fk_usuario_id.map(user => `'${user}'`)}]`);
        this.conta.fk_usuario_id = contas;
        this.conta.status = false;

        this.$store.dispatch('createConta', this.conta)
          .then(response => {
            this.$toasted.show(`${response.mensagem}`, {
              iconPack: "fontawesome",
              icon: "check",
              duration: 3000,
              className: "bg-success",
              theme: "bubble",
            })
            this.$router.go(-1)
          })
          .catch((er) => console.log(er))
          .finally(() => this.loading = false)
      },
      updateConta() {
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
        this.loading = true;
        let contas = String(`[${this.fk_usuario_id.map(user => `'${user}'`)}]`);
        this.conta.fk_usuario_id = contas;
        this.conta.status = false;

        this.$store.dispatch('updateConta', this.conta)
          .then(response => {
            this.$toasted.show(`${response.mensagem}`, {
              iconPack: "fontawesome",
              icon: "check",
              duration: 3000,
              className: "bg-success",
              theme: "bubble",
            })
            this.$router.go(-1)
          })
          .catch((er) => console.log(er))
          .finally(() => this.loading = false)
      },
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