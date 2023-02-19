import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router/router';
import 'vuetify/dist/vuetify.min.css';
import themes from '../theme';

const app = createApp(App);


app.use(router).use(themes).mount('#app');
