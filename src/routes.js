const routes = [{
  path: '*',
  // component: () => import('./views/Login/Index.vue'),
  name: 'all',
  redirect: '/'
}, {
  path: '/',
  component: () => import('./views/Login/Index.vue'),
  name: 'logIn',
  children: [{
    path: '/',
    component: () => import('./views/Login/components/Login.vue'),
  }, {
    path: '/cadastro',
    component: () => import('./views/Home/components/Usuario.vue'),
  },]
},
{
  path: '/home',
  component: () => import('./views/Home/Home.vue'),
  name: 'home',
  children: [{
    path: '/contas',
    component: () => import('./views/Home/components/TodasContas.vue'),
  }, {
    path: '/parcelas',
    component: () => import('./views/Home/components/TodasParcelas.vue'),
  }, {
    path: '/usuarios',
    component: () => import('./views/Home/components/TodosUsuarios.vue'),
  }, {
    path: '/conta',
    component: () => import('./views/Home/components/Conta.vue'),
  }, {
    path: '/parcela/',
    component: () => import('./views/Home/components/Parcela.vue'),
  }, {
    path: '/usuario',
    component: () => import('./views/Home/components/Usuario.vue'),
  },]
},
];

export default routes