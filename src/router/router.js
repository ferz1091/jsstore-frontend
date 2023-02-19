import { createRouter } from 'vue-router';
import { createWebHistory } from 'vue-router';

export const router = createRouter({
    routes: [
        {path: '/', component: () => import('../pages/Homepage.vue')}
    ],
    history: createWebHistory()
});
