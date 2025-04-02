import { createStore } from 'vuex';

const store = createStore({
  modules: {},
});

const loadModules = async () => {
  const moduleFiles = import.meta.glob('./modules/*.js');
  for (const path in moduleFiles) {
    const moduleName = path.match(/\/([^/]+)\.js$/)[1];
    const module = await moduleFiles[path]();
    store.registerModule(moduleName, module.default);
  }
};

loadModules();

export default store;