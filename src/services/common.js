import axios from 'axios';
import services from './auth';

let api = process.env.VUE_APP_BASE_URL;
let auth = {};

export default {
  //Login
  status() {
    return axios.get(api)
      .then((response) => {
        return response;
      }).catch((err) => {
        console.log("" + err);
        return false;
      });
  },
  sigIn(payload) {
    return axios.post(`${api}/autenticar`, {
      usuario: payload.usuario,
      senha: payload.senha,
    }).then((response) => {
      localStorage.setItem("auth", JSON.stringify(response.data));
      return response.data;
    }).catch((err) => {
      console.log("" + err);
      return false;
    })
  },
  token() {
    auth = services.auth();
    if (!auth) return;
    return axios.get(`${api}/api/usuario/${auth.id}`)
      .then((response) => {
        return response.data;
      }).catch((err) => {
        console.log("" + err);
        return false;
      });
  },
  //USUARIOS
  getUsuarios(payload) {
    auth = services.auth();
    return axios.get(`${api}/api/usuarios`, {
      headers: {
        token: auth.token,
      }
    }).then((response) => {
      if (payload == 'todos') return response.data;
      else {
        let usuario;
        response.data.forEach(user => {
          if (auth.id == user.id) usuario = user;
        });
        return usuario;
      }
    }).catch((err) => {
      console.log("" + err);
      return false
    });
  },
  createUsuario(payload, url) {
    auth = {
      token: 'noToken'
    };
    auth = services.auth();
    return axios.post(`${api}/api/${url}`, payload, {
      headers: {
        token: auth.token,
      }
    }).then(async (response) => {
      return response;
    }).catch((err) => {
      console.log("" + err);
      return false;
    });
  },
  deletarUsuario(payload) {
    auth = services.auth();
    return axios.delete(`${api}/api/deletar-usuario/${payload}`, {
      headers: {
        token: auth.token,
      }
    }).then((response) => {
      return response.data;
    })
      .catch((err) => {
        console.log("" + err);
        return false;
      });
  },
  //CONTAS
  getContas(payload) {
    auth = services.auth();
    if (!payload) payload = auth.id;
    return axios.get(`${api}/api/contas/${payload}`, {
      headers: {
        token: auth.token,
      }
    }).then((response) => {
      return response.data;
    }).catch((err) => {
      console.log("" + err);
      return false;
    });
  },
  createConta(payload, url) {
    auth = services.auth();
    return axios.post(`${api}/api/${url}`, payload, {
      headers: {
        token: auth.token,
      }
    }).then((response) => {
      return response.data;
    }).catch((err) => {
      console.log("" + err);
      return false;
    });
  },
  deletarConta(payload) {
    auth = services.auth();
    return axios.delete(`${api}/api/deletar-conta/${payload}`, {
      headers: {
        token: auth.token,
      }
    }).then((response) => {
      return response.data;
    }).catch((err) => {
      console.log("" + err);
      return false;
    });
  },
  //PARCELAS
  getParcelas(payload) {
    auth = services.auth();
    return axios.get(`${api}/api/${payload}/parcelas`, {
      headers: {
        token: auth.token,
      }
    }).then((response) => {
      return response.data;
    }).catch((err) => {
      console.log("" + err);
    });
  },
  createParcela(payload, url) {
    auth = services.auth()
    return axios.post(`${api}/api/${url}`, payload, {
      headers: {
        token: auth.token,
      }
    }).then((response) => {
      return response.data;
    }).catch((err) => {
      console.log("" + err);
      return false;
    });
  },
  deletarParcela(payload) {
    auth = services.auth();
    return axios.delete(`${api}/api/deletar-parcela/${payload}`, {
      headers: {
        token: auth.token,
      }
    }).then((response) => {
      return (response.data);
    }).catch((err) => {
      console.log("" + err);
      return false
    });
  },
  getFormasPagto() {
    auth = services.auth();
    return axios.get(`${api}/api/formpagto`, {
      headers: {
        token: auth.token,
      }
    }).then((response) => {
      return response.data;
    }).catch((err) => {
      console.log("" + err);
      return false;
    });
  }
}