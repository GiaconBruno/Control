import store from './index';

const access = {
  computed: {
    access() {
      return store.state.access;
    },
  },
  methods: {
    formatDate(data) {
      return (new Date(data).toLocaleString('pt-BR'))
    },
    dateToSend(data) {
      return (new Date(data).toLocaleString('pt-BR').replace(',', '').split(' ').join('/') + 'T')
        .split('/').reverse().join('-').split('T-').reverse().join(' ')
    },
    showDate(data) {
      return (new Date(data).toISOString().split('T').join('-') + 'T')
        .split('-').reverse().join('/').split('T/').reverse().join(' ').slice(0, -5)
    },
    formatMoney(payload) {
      return parseFloat(payload).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    },
    toast(title, icon, duration) {
      this.$toasted.show(title || 'Erro interno', {
        iconPack: "fontawesome",
        icon,
        duration: duration || 5000,
        className: `${(icon == 'times' || !title) ? 'bg-danger' : 'bg-success'}`,
        theme: "bubble",
      });
    },
  }
}
export default access;