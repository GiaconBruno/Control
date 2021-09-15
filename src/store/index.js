import axios from 'axios';

const state = {
  auth: [],
}

const mutations = {
  SET_AUTH: (state, payload) => {
    state.auth = payload;
  },
}

const actions = {
  //CONFIG
  status: () => {
    let promise = new Promise((resolve, reject) => {
      axios.get()
        .then(response => resolve(response))
        .catch(error => reject(error.response))
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
          localStorage.setItem("auth", JSON.stringify(response.data));
          context.commit('SET_AUTH', response.data);
          axios.defaults.headers.common['token'] = state.auth.token;
          context.dispatch('updateUser');
          resolve(response.data);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },
  token(context) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/usuario/${context.state.auth.id}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log("" + error);
          reject(error.response);
        })
    })
    return promise
  },

  //USUARIOS
  updateUser(context) {
    const payload = {
      acesso: Date.now()
    }
    let promise = new Promise((resolve, reject) => {
      axios.post(`/api/atualizar-usuario/${context.state.auth.id}`, payload)
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
  // getContas(payload) {
  //   auth = services.auth();
  //   if (!payload) payload = auth.id;
  //   return axios.get(`${api}/api/contas/${payload}`)
  //   .then((response) => {
  //     return response.data;
  //   }).catch((err) => {
  //     console.log("" + err);
  //     return false;
  //   });
  // },
  getContas(context) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/contas/${context.state.auth.id}`)
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


this.$store.dispatch('status')
  .then(response => {})
  .catch(() => {
  })
  .finally(() => this.loading = false)
  */