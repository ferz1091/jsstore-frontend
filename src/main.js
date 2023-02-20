import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router/router';
import 'vuetify/dist/vuetify.min.css';
import themes from '../theme';
import components from '@/components/UI';

const app = createApp(App);

components.forEach((component) => {
    app.component(component.name, component);
})

app.use(router).use(themes).mount('#app');
