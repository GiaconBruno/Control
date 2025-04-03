import axios from 'axios';
import { Buffer } from "buffer";
import { toast } from 'vue3-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(error);
    if (typeof error.response == 'undefined') {
      return Promise.reject(error);
    }
    toast((error.response) ? error.response.data.mensagem : error, {
      theme: "colored",
      type: ([404, 500].includes(error.status)) ? 'error' : 'warning',
      autoClose: 3000,
      closeOnClick: false,
    });
    if (error.status == 404) {
      router.push('/');
    }
    return Promise.reject(error);
  }
);

export default api;