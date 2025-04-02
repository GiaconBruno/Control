import axios from 'axios';
import { Buffer } from "buffer";
import common from '../../services/common';
const { methods: { dateToSend } } = common

const state = {
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

const mutations = {
  GET_ACCESS: (state) => {
    if (localStorage.getItem('access')) {
      // console.log(state);
      state = JSON.parse(Buffer.from(localStorage.getItem("access"), 'base64').toString('utf-8'));
      // console.log(state);
      axios.defaults.headers.common['token'] = state.auth.token;
    }
  },
  LOGOUT: (state) => {
    state = {};
  },
  SET_AUTH: (state, payload) => {
    state.auth = payload;
    localStorage.setItem("access", Buffer.from(JSON.stringify(state), 'utf-8').toString('base64'));
  },
  SET_DASH: (state, payload) => {
    state.dash = { dash: payload, validate: Date.now() + (1000 * 60 * 30) };
    localStorage.setItem("access", Buffer.from(JSON.stringify(state), 'utf-8').toString('base64'));
  },
  SET_GRAPHIC: (state, payload) => {
    state.graphic = { graphic: payload, validate: Date.now() + (1000 * 60 * 30) };
    localStorage.setItem("access", Buffer.from(JSON.stringify(state), 'utf-8').toString('base64'));
  },
  SET_EDIT_USER: (state, payload) => {
    state.userEdit = payload;
    localStorage.setItem("access", Buffer.from(JSON.stringify(state), 'utf-8').toString('base64'));
  },
  SET_EDIT_CONTA: (state, payload) => {
    state.contaEdit = payload;
    localStorage.setItem("access", Buffer.from(JSON.stringify(state), 'utf-8').toString('base64'));
  },
  SET_CONTA_PARCELA: (state, payload) => {
    state.contaParcela = payload;
    localStorage.setItem("access", Buffer.from(JSON.stringify(state), 'utf-8').toString('base64'));
  },
  SET_EDIT_PARCELA: (state, payload) => {
    state.parcelaEdit = payload;
    localStorage.setItem("access", Buffer.from(JSON.stringify(state), 'utf-8').toString('base64'));
  },
  SET_CONTA_TIPO: (state, payload) => {
    state.contaTipo = payload;
    localStorage.setItem("access", Buffer.from(JSON.stringify(state), 'utf-8').toString('base64'));
  },
}

const actions = {
  //CONFIG
  status: () => {
    return new Promise((resolve, reject) => {
      axios.get('/')
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  sigIn(context, payload) {
    const secret = {
      secret: Buffer.from(`${payload.usuario}:${payload.senha}`, 'utf-8').toString('base64')
    }
    return new Promise((resolve, reject) => {
      axios.post(`/autenticar`, secret)
        .then((response) => {
          context.commit('SET_AUTH', response.data);
          axios.defaults.headers.common['token'] = context.state.auth.token;
          // resolve(context.dispatch('updateAcessUser'));
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },

  //Dash
  getDashboard(context, payload) {
    if (context.state.dash && Date.now() < context.state.dash.validate && !payload.force)
      return context.state.dash.dash;
    let info = 'inicio&fim'
    if (payload.periodo[0]) info = info.replace('inicio', `inicio=${payload.periodo[0]}`)
    if (payload.periodo[1]) info = info.replace('fim', `fim=${payload.periodo[1]}`)
    return new Promise((resolve, reject) => {
      axios.get(`/api/dashboard?${info}`)
        .then((response) => {
          context.commit('SET_DASH', response.data);
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          context.commit('LOGOUT');
          reject(error.response);
        })
    })
  },
  getGraphic(context, payload) {
    if (context.state.graphic && Date.now() < context.state.graphic.validate && !payload)
      return context.state.graphic.graphic;
    return new Promise((resolve, reject) => {
      axios.get(`/api/graphic`)
        .then((response) => {
          context.commit('SET_GRAPHIC', response.data);
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          context.commit('LOGOUT');
          reject(error.response);
        })
    })
  },

  //USUARIOS
  getUsers() {
    return new Promise((resolve, reject) => {
      axios.get(`/api/usuarios/`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  getUserId(context, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/usuario/${payload}`)
        .then((response) => {
          context.commit('SET_EDIT_USER', response.data);
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  getUserContas(context, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/usuarios-conta`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  createUser(context, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/usuario`, payload)
        .then((response) => {
          resolve(context.dispatch('sigIn', payload))
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  updateAcessUser(context) {
    const payload = {
      acesso: dateToSend(new Date())
    }
    return new Promise((resolve, reject) => {
      axios.post(`/api/atualizar-acesso/${context.state.auth.id}`, payload)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(localStorage.clear());
          console.error(error);
          reject(error);
        })
    })
  },
  updateUser(context, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/atualizar-usuario/${payload.id}`, payload)
        .then((response) => {
          if (context.state.auth.id == payload.id) context.dispatch('sigIn', payload)
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  deleteUser(context, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/deletar-usuario/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },

  //CONTAS
  getContasEntradas(context) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/contas-entradas/${context.state.auth.id}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(context.commit('LOGOUT'));
          // reject(localStorage.clear());
          console.error(error);
          reject(error.response);
        })
    })
  },
  getContasSaidas(context) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/contas-saidas/${context.state.auth.id}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(context.commit('LOGOUT'));
          // reject(localStorage.clear());
          console.error(error);
          reject(error.response);
        })
    })
  },
  getAllContas(context) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/contas-all`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(localStorage.clear());
          reject(context.commit('LOGOUT'));
          console.error(error);
          reject(error.response);
        })
    })
  },
  getContasId(context, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/conta/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  createConta(context, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/contas`, payload)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  updateConta(context, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/atualizar-conta/${context.state.contaEdit.id}`, payload)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  deleteConta(context, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/deletar-conta/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },

  //PARCELAS
  getParcelas(context, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/${payload}/parcelas`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  getFormasPagto(context, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/formpagto`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  createParcela(context, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/${payload.conta}/parcelas`, payload.parcela)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  updateParcela(context, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/atualizar-parcela/${payload.id}`, payload)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  deleteParcela(context, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/deletar-parcela/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },

  //MENSAGENS
  getNotifyCount(context, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/noti-count`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  getNotifyReceived(context, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/noti-recebidas`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  getNotifySend(context, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/noti-enviadas`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  createNotify(context, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/notificacao`, payload)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  updateStatusNotify(context, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`/api/notificacao/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  deleteNotify(context, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/notificacao/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },

  //SETTINGS
  statusContas(context, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/fix-status-contas`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  vincUsuariosConta(context, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/contas-fix-users`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },

  //Logs
  getLogsDash(context, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/logs-all`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  getLogs(context, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/logs/?${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  },
  deleteLogs(context, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`/api/logs/${payload}`)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.error(error);
          reject(error.response);
        })
    })
  }
}

export default {
  state,
  mutations,
  actions
}