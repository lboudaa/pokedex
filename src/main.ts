import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import PrimeVue from './plugins/primevue';
import './style.css'

const app = createApp(App);
app.use(router);
app.use(createPinia());
PrimeVue(app);

app.mount('#app');
