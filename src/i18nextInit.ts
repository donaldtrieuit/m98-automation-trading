import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './assets/locales/en/translation.json';

const fallbackLng = ['en'];

const resources = {
	en: {
		translation: translationEN,
	},
};

i18n.use(initReactI18next).init({
	resources,
	fallbackLng,
	lng: 'en',
	debug: false,
	interpolation: {
		escapeValue: false,
	},
});

i18n.changeLanguage(localStorage.getItem('language') || 'en');

export default i18n;
