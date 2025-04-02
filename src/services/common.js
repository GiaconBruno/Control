import { toast } from 'vue3-toastify';

const common = {
  computed: {
    appVersion() {
      return __APP_VERSION__
    },
    access() {
      return this.$store.state.default;
    },
  },
  methods: {
    formatDate(data) {
      return (new Date(data).toLocaleString('pt-BR').replace(',', ''))
    },
    formatMoney(payload) {
      return parseFloat(payload).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },
    formatPhone(payload) {
      if (payload == undefined) return;
      payload = payload.replace(/\D/g, "");
      payload = payload.slice(0, 11);
      if (payload.length <= 2) return payload.replace(/(\d{0})(\d{1,})/g, "($1$2");
      else if (payload.length <= 6) return payload.replace(/(\d{2})(\d{0,})/g, "($1)$2");
      else if (payload.length <= 10) return payload.replace(/(\d{2})(\d{4})(\d\d{0,})/g, "($1) $2-$3");
      else if (payload.slice(0, 4) != '0800') return payload.replace(/(\d{2})(\d)(\d{4})(\d{4,})/g, "($1) $2 $3-$4");
      else return payload.replace(/(\d{4})(\d{3})(\d{4})/g, "$1 $2 $3");
    },
    formatEmail(payload) {
      if (payload == undefined) return;
      return payload.replace(/ /g, '').toLowerCase();
    },
    formatDocument(payload) {
      if (payload == undefined) return;
      payload = payload.replace(/\D/g, "");
      payload = payload.slice(0, 14);
      if (payload.length <= 9) return payload.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/g, "$1.$2.$3-$4");
      if (payload.length > 9) return payload.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
    },
    formatPrice(payload) {
      return String(payload.toFixed(2)).replace('.', ',');
    },
    validEmail(payload) {
      // Rules:
      const rules = payload.split('');
      const space = rules.findIndex(r => r == ' ');
      const posA = rules.findIndex(r => r == '@');
      let posDot = rules.reverse().findIndex(r => r == '.');
      posDot = (posDot != -1) ? (rules.length - 1) - posDot : posDot;
      if (!payload) return false;
      // Não pode ter Espaços
      if (space > 0) return false;
      // Ter o carcter '@'
      if (posA < 0) return false;
      // Ter algum caracter antes e depois do '@'
      if ((posA == 0) || (posA == (rules.length - 1))) return false;
      // Ter o caracter '.' depois do '@'
      if ((posDot < 0) || (posA > posDot)) return false;
      // Ter algum caracter antes e depois do '.'
      if ((posA == (posDot - 1)) || (posDot == (rules.length - 1))) return false;
      return true;
    },
    dateToSend(data) {
      return (new Date(data).toLocaleString('pt-BR').replace(',', '').split(' ').join('/') + 'T').split('/').reverse().join('-').split('T-').reverse().join(' ')
    },
    showDate(data) {
      return (new Date(data).toISOString().split('T').join('-') + 'T').split('-').reverse().join('/').split('T/').reverse().join(' ').slice(0, -5)
    },
    $toast(title, type, duration) {
      toast(title || 'Erro interno', {
        theme: "colored",
        type: type || 'error', // success, error, info, warning
        autoClose: duration || 3000,
        closeOnClick: false,
      });
    },
  }
}
export default common;