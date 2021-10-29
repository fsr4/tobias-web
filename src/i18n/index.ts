import { createI18n } from 'vue-i18n';
import localeGerman from '@/assets/locales/de.json';

const i18n = createI18n({
  legacy: false,
  locale: 'de',
  fallbackLocale: 'en',
  messages: {
    de: localeGerman
  }
});

export default i18n;
