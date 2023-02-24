import 'maz-ui/css/main.css'
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router/router';
import 'vuetify/dist/vuetify.min.css';
import themes from '../theme';
import components from '@/components/UI';
import store from './init/store';

const app = createApp(App);

components.forEach((component) => {
    app.component(component.name, component);
})

app.use(router).use(store).use(themes).mount('#app');
