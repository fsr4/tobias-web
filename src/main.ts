import { createApp } from 'vue';
import './assets/scss/style.scss';
import App from './App.vue';
import router from './router';
import i18n from '@/i18n';

createApp(App)
  .use(router)
  .use(i18n)
  .mount('#app');
