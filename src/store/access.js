import store from './index';

const access = {
  computed: {
    access() {
      return store.state.access;
    },
  },
  methods: {
    formatDate(data) {
      return (new Date(data).toLocaleString('pt-BR').split('T').join('-') + 'T')
        .replace(/\//g, '-').slice(0, -1)
    },
    formatMoney(payload) {
      return parseFloat(payload).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    },
    dateToSend(data) {
      return (new Date(data).toLocaleString('pt-BR').split(' ').join('/') + 'T')
        .split('/').reverse().join('-').split('T-').reverse().join(' ')
    },
    toast(title, icon) {
      this.$toasted.show(title || 'Erro interno', {
        iconPack: "fontawesome",
        icon,
        duration: 5000,
        className: `${(icon == 'times' || !title) ? 'bg-danger' : 'bg-success'}`,
        theme: "bubble",
      });
    },
  }
}
export default access;