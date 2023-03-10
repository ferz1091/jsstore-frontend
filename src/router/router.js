import { createRouter } from 'vue-router';
import { createWebHistory } from 'vue-router';

export const router = createRouter({
    routes: [
        {path: '/', component: () => import('../pages/Homepage.vue')},
        {
            path: '/shop/entry/:gender?', 
            component: () => import('../pages/MainPage.vue'),
            beforeEnter: (to, from, next) => {
                if (!to.params.gender || !['men', 'women'].some(key => key === to.params.gender)) {
                    next({path: '/'})
                }
                next();
            }
        },
        {
            path: '/shop/:gender/:category/:page?', 
            component: () => import('../pages/ProductsPage.vue'),
            beforeEnter: (to, from, next) => {
                if (!to.params.page || to.params.page < 1 || !Number(to.params.page)) {
                    next({path: `/shop/entry/${to.params.gender}`});
                }
                next();
            },
        },
        {path: '/:pathMatch(.*)*', redirect: '/'}
    ],
    history: createWebHistory()
});
