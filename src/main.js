import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles.css';
import '@fortawesome/fontawesome-free/css/all.css';

// Create app instance
const app = createApp(App);

// Use router
app.use(router);

// Global error handler
app.config.errorHandler = (err) => {
  console.error('APP ERROR:', err);
};

// Mount app
app.mount('#app');
