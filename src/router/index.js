// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// Import pages
import Home from '../pages/Home.vue';
import Services from '../pages/Services.vue';
import ServiceDetail from '../pages/ServiceDetail.vue';
import Technicians from '../pages/Technicians.vue';
import TechnicianDetail from '../pages/TechnicianDetail.vue';
import Products from '../pages/Products.vue';
import ProductDetail from '../pages/ProductDetail.vue';
import SearchResults from '../pages/SearchResults.vue';
import AccountPage from '../pages/AccountPage.vue';
import ContactSupplier from '../pages/ContactSupplier.vue';
import NotFound from '../pages/NotFound.vue'; // optional import (lazy-load below works too)

// Define routes
const routes = [
  { path: '/', name: 'Home', component: Home },

  { path: '/services', name: 'Services', component: Services },
  { path: '/services/:id', name: 'ServiceDetail', component: ServiceDetail, props: true },

  { path: '/technicians', name: 'Technicians', component: Technicians },
  { path: '/technicians/:id', name: 'TechnicianDetail', component: TechnicianDetail, props: true },

  { path: '/products', name: 'Products', component: Products },
  { path: '/products/:id', name: 'ProductDetail', component: ProductDetail, props: true },

  { path: '/account', name: 'AccountPage', component: AccountPage },
  { path: '/contact-supplier', name: 'ContactSupplier', component: ContactSupplier },

  // 🔍 Search results page
  { path: '/search', name: 'Search', component: SearchResults },

  // 🧭 Catch-all 404 route (lazy-loaded)
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Smooth scroll to top when navigating
    return { top: 0, behavior: 'smooth' };
  }
});

export default router;
