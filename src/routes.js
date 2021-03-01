const routes = [
    {
        path: '/',
        component: () => import('./views/login/index.vue'),
        name: 'logIn',
    },
    {
        path: '/home',
        component: () => import('./views/default/Home.vue'),
        name: 'home',
    },
    {
        path: '/about',
        component: () => import('./views/default/About.vue'),
        name: 'about',
    },
];

export default routes