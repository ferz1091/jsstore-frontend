import { createRouter } from 'vue-router';
import { createWebHistory } from 'vue-router';

export const router = createRouter({
    routes: [
        {path: '/', component: () => import('../pages/Homepage.vue')},
        {path: '/shop', component: () => import('../pages/MainPage.vue')}
    ],
    history: createWebHistory()
});
