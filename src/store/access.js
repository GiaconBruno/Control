import store from './index';

const access = {
  computed: {
    access() {
      return store.state.access;
    },
  }
}
export default access;