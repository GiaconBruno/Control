const routes = [
    {
        path: '/',
        component: () => import('./views/login/index.vue'),
        name: 'logIn',
    },
    {
        path: '/home',
        component: () => import('./views/components/Home.vue'),
        name: 'home',
    },
];

export default routes