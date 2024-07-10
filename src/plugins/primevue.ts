import { App } from 'vue';
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

export default (app: App) => {
  app.use(PrimeVue);
  app.component('Button', Button);
  app.component('InputText', InputText);
};
