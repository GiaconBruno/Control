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
    component: () => import('./views/Usuarios/Usuario.vue'),
  },]
},
{
  path: '/home',
  component: () => import('./views/Home/Home.vue'),
  name: 'home',
  children: [{
    path: '/contas',
    component: () => import('./views/Contas/TodasContas.vue'),
  }, {
    path: '/parcelas',
    component: () => import('./views/Parcelas/TodasParcelas.vue'),
  }, {
    path: '/usuarios',
    component: () => import('./views/Usuarios/TodosUsuarios.vue'),
  }, {
    path: '/conta',
    component: () => import('./views/Contas/Conta.vue'),
  }, {
    path: '/parcela/',
    component: () => import('./views/Parcelas/Parcela.vue'),
  }, {
    path: '/usuario',
    component: () => import('./views/Usuarios/Usuario.vue'),
  },]
},
];

export default routes