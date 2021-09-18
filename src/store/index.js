import axios from 'axios';

const state = {
  access: {
    auth: {},
    userEdit: {},
    contaEdit: {},
  }
}

const mutations = {
  GET_ACCESS: (state) => {
    if (localStorage.getItem('access')) {
      state.access = JSON.parse(Buffer.from(localStorage.getItem("access"), 'base64').toString('utf-8')).access;
      axios.defaults.headers.common['token'] = state.access.auth.token;
    }
  },
  LOGOUT: (state) => {
    state.access = {};
  },
  SET_AUTH: (state, payload) => {
    state.access.auth = payload;
    localStorage.setItem("access", Buffer.from(JSON.stringify(state), 'utf-8').toString('base64'));
  },
  SET_EDIT_USER: (state, payload) => {
    state.access.userEdit = payload;
    localStorage.setItem("access", Buffer.from(JSON.stringify(state), 'utf-8').toString('base64'));
  },
  SET_EDIT_CONTA: (state, payload) => {
    state.access.contaEdit = payload;
    localStorage.setItem("access", Buffer.from(JSON.stringify(state), 'utf-8').toString('base64'));
  },
}

const actions = {
  //CONFIG
  status: () => {
    let promise = new Promise((resolve, reject) => {
      axios.get()
        .then(response => resolve(response))
        .catch(error => reject(error.response.statusText))
    })
    return promise
  },
  sigIn(context, payload) {
    const secret = {
      secret: Buffer.from(`${payload.usuario}:${payload.senha}`, 'utf-8').toString('base64')
    }
    let promise = new Promise((resolve, reject) => {
      axios.post(`/autenticar`, secret)
        .then((response) => {
          context.commit('SET_AUTH', response.data);
          axios.defaults.headers.common['token'] = context.state.access.auth.token;
          context.dispatch('updateAcessUser');
          resolve(response.data);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },

  //USUARIOS
  getUsers() {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/usuarios/`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },
  getUserId(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/usuario/${payload}`)
        .then((response) => {
          context.commit('SET_EDIT_USER', response.data);
          resolve(response.data);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },
  getUserContas(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/usuarios-conta`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },
  createUser(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.post(`/api/usuario`, payload)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },
  updateAcessUser(context) {
    const payload = {
      acesso: Date.now()
    }
    let promise = new Promise((resolve, reject) => {
      axios.post(`/api/atualizar-usuario/${context.state.access.auth.id}`, payload)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },
  updateUser(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.post(`/api/atualizar-usuario/${payload.id}`, payload)
        .then((response) => {
          resolve(response);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },
  deletarUser(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.delete(`/api/deletar-usuario/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },

  //CONTAS
  getContas(context) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/contas/${context.state.access.auth.id}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },
  getContasId(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/contas/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },
  createConta(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.post(`/api/contas`, payload)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },
  updateConta(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.post(`/api/atualizar-conta/${context.state.access.contaEdit.id}`, payload)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },
  deletarConta(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.delete(`/api/deletar-conta/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },

  //PARCELAS
  getParcelas(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/${payload}/parcelas`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },
}

export default {
  state,
  mutations,
  actions
}

/*
exemple(context, payload) {
  let promise = new Promise((resolve, reject) => {
    axios.post(`/api/`, payload, context)
      .then((response) => {
        resolve(response.data);
      }).catch((error) => {
        console.log("" + error);
        reject(error.response);
      })
  })
  return promise
},


this.$store.dispatch('getset')
  .then(response => {})
  .catch(() => {
  })
  .finally(() => this.loading = false)
  */