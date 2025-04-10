const routes = [{
  path: '*',
  // component: () => import('./views/Login/Index.vue'),
  name: 'all',
  redirect: '/'
}, {
  path: '/',
  component: () => import('./views/Home/Index.vue'),
  // name: 'logIn',
  children: [{
    path: '/',
    component: () => import('./views/Home/Login.vue'),
  }, {
    path: '/cadastro',
    component: () => import('./views/Usuarios/Usuario.vue'),
  }]
},
{
  path: '/home',
  component: () => import('./views/Home/Home.vue'),
  name: 'home',
  children: [{
    path: '/dashboard',
    component: () => import('./views/components/Dashboard.vue'),
  }, {
    path: '/entradas',
    component: () => import('./views/Contas/TodasContas.vue'),
  }, {
    path: '/saidas',
    component: () => import('./views/Contas/TodasContas.vue'),
  }, {
    path: '/todas-contas',
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
  }, {
    path: '/settings',
    component: () => import('./views/settings/Parametros.vue'),
  }, {
    path: '/logs',
    component: () => import('./views/settings/Logs.vue'),
  }, {
    path: '/mensagens',
    component: () => import('./views/Mensagens/Mensagens.vue'),
  },]
},
];

export default routes