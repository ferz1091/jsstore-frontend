import { createRouter } from 'vue-router';
import { createWebHistory } from 'vue-router';

export const router = createRouter({
    routes: [
        { path: '/', component: () => import('../pages/Homepage.vue') },
        {
            path: '/shop/entry/:gender?',
            component: () => import('../pages/MainPage.vue'),
            beforeEnter: (to, from, next) => {
                if (!to.params.gender || !['men', 'women'].some(key => key === to.params.gender)) {
                    next({ path: '/' })
                } else {
                    next();
                }
            }
        },
        {
            path: '/shop/:gender/:category/:page?',
            component: () => import('../pages/ProductsPage.vue'),
            beforeEnter: (to, from, next) => {
                if (!to.params.page || to.params.page < 1 || !Number(to.params.page)) {
                    next({ path: `/shop/entry/${to.params.gender}` });
                } else {
                    next();
                }
            },
        },
        {
            path: '/shop/sale/:page?',
            component: () => import('../pages/Salepage.vue'),
            beforeEnter: (to, from, next) => {
                if (!to.params.page || to.params.page < 1 || !Number(to.params.page)) {
                    next({ path: '/shop/sale/1' });
                } else {
                    next();
                }
            }
        },
        {
            path: '/product/:gender/:itemId',
            component: () => import('../pages/ProductItemPage.vue'),
            beforeEnter: (to, from, next) => {
                if (!to.params.gender || !['men', 'women'].some(key => key === to.params.gender)) {
                    next({ path: '/' })
                } else {
                    next();
                }
            }
        },
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../components/NotFound.vue') },
        { path: '/account/profile', component: () => import('../pages/AccountPages/UserProfile.vue') },
        { path: '/account/favorites', component: () => import('../pages/AccountPages/UserFavorites.vue') },
        { path: '/account/security', component: () => import('../pages/AccountPages/UserSecurity.vue') },
        { path: '/account/orders', component: () => import('../pages/AccountPages/UserOrders.vue') },
        { path: '/account/recovery', component: () => import('../pages/AccountPages/UserPasswordRecovery.vue') },
        { path: '/order', component: () => import('../pages/OrderPage.vue') },
        { path: '/panel/add', component: () => import('../pages/AdminPages/AddProductPage.vue') },
        { path: '/authback', component: () => import('../pages/AuthBack.vue') },
    ],
    history: createWebHistory()
});
