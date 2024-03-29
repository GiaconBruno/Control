/* eslint-disable */
import axios from 'axios';
import access from './access.js';
const { methods: { dateToSend } } = access

const state = {
  access: {
    auth: {},
    dash: {},
    graphic: {},
    userEdit: {},
    contaEdit: {},
    contaTipo: '',
    formPagtos: {},
    contaParcela: null,
    parcelaEdit: {},
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
  SET_DASH: (state, payload) => {
    state.access.dash = { dash: payload, validate: Date.now() + (1000 * 60 * 30) };
    localStorage.setItem("access", Buffer.from(JSON.stringify(state), 'utf-8').toString('base64'));
  },
  SET_GRAPHIC: (state, payload) => {
    state.access.graphic = { graphic: payload, validate: Date.now() + (1000 * 60 * 30) };
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
  SET_CONTA_PARCELA: (state, payload) => {
    state.access.contaParcela = payload;
    localStorage.setItem("access", Buffer.from(JSON.stringify(state), 'utf-8').toString('base64'));
  },
  SET_EDIT_PARCELA: (state, payload) => {
    state.access.parcelaEdit = payload;
    localStorage.setItem("access", Buffer.from(JSON.stringify(state), 'utf-8').toString('base64'));
  },
  SET_CONTA_TIPO: (state, payload) => {
    state.access.contaTipo = payload;
    localStorage.setItem("access", Buffer.from(JSON.stringify(state), 'utf-8').toString('base64'));
  },
}

const actions = {
  //CONFIG
  status: () => {
    let promise = new Promise((resolve, reject) => {
      axios.get('/')
        .then(response => resolve(response))
        .catch(error => reject(error))
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
          // resolve(context.dispatch('updateAcessUser'));
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },

  //Dash
  getDashboard(context, payload) {
    if (context.state.access.dash && Date.now() < context.state.access.dash.validate && !payload.force)
      return context.state.access.dash.dash;
    let info = 'inicio&fim'
    if (payload.periodo[0]) info = info.replace('inicio', `inicio=${payload.periodo[0]}`)
    if (payload.periodo[1]) info = info.replace('fim', `fim=${payload.periodo[1]}`)
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/dashboard?${info}`)
        .then((response) => {
          context.commit('SET_DASH', response.data);
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          context.commit('LOGOUT');
          reject(error.response);
        })
    })
    return promise
  },
  getGraphic(context, payload) {
    if (context.state.access.graphic && Date.now() < context.state.access.graphic.validate && !payload)
      return context.state.access.graphic.graphic;
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/graphic`)
        .then((response) => {
          context.commit('SET_GRAPHIC', response.data);
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          context.commit('LOGOUT');
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
          console.log(error);
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
          console.log(error);
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
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  createUser(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.post(`/api/usuario`, payload)
        .then((response) => {
          resolve(context.dispatch('sigIn', payload))
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  updateAcessUser(context) {
    const payload = {
      acesso: dateToSend(new Date())
    }
    let promise = new Promise((resolve, reject) => {
      axios.post(`/api/atualizar-acesso/${context.state.access.auth.id}`, payload)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(localStorage.clear());
          console.log(error);
          reject(error);
        })
    })
    return promise
  },
  updateUser(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.post(`/api/atualizar-usuario/${payload.id}`, payload)
        .then((response) => {
          if (context.state.access.auth.id == payload.id) context.dispatch('sigIn', payload)
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  deleteUser(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.delete(`/api/deletar-usuario/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },

  //CONTAS
  getContasEntradas(context) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/contas-entradas/${context.state.access.auth.id}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(context.commit('LOGOUT'));
          // reject(localStorage.clear());
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  getContasSaidas(context) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/contas-saidas/${context.state.access.auth.id}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(context.commit('LOGOUT'));
          // reject(localStorage.clear());
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  getAllContas(context) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/contas-all`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(localStorage.clear());
          reject(context.commit('LOGOUT'));
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  getContasId(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/conta/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
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
          console.log(error);
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
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  deleteConta(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.delete(`/api/deletar-conta/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
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
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  getFormasPagto(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/formpagto`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  createParcela(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.post(`/api/${payload.conta}/parcelas`, payload.parcela)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  updateParcela(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.post(`/api/atualizar-parcela/${payload.id}`, payload)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  deleteParcela(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.delete(`/api/deletar-parcela/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },

  //MENSAGENS
  getNotifyCount(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/noti-count`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  getNotifyReceived(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/noti-recebidas`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  getNotifySend(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/noti-enviadas`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  createNotify(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.post(`/api/notificacao`, payload)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  updateStatusNotify(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.put(`/api/notificacao/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  deleteNotify(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.delete(`/api/notificacao/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },

  //SETTINGS
  statusContas(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/fix-status-contas`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  vincUsuariosConta(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/contas-fix-users`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },

  //Logs
  getLogsDash(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/logs-all`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  getLogs(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.get(`/api/logs/?${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  },
  deleteLogs(context, payload) {
    let promise = new Promise((resolve, reject) => {
      axios.delete(`/api/logs/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error.response);
        })
    })
    return promise
  }
}

export default {
  state,
  mutations,
  actions
}