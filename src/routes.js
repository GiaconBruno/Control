const routes = [{
  path: '*',
  component: () => import('./views/Login/Index.vue'),
  name: 'logIn',
}, {
  path: '/',
  component: () => import('./views/Login/Index.vue'),
  name: 'logIn',
},
{
  path: '/home',
  component: () => import('./views/Home/Home.vue'),
  name: 'home',
},
];

export default routes