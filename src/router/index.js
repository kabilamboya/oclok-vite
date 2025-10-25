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
import SearchResults from '../pages/SearchResults.vue'; // 👈 add this

import AccountPage from "../pages/AccountPage.vue";
import ContactSupplier from "../pages/ContactSupplier.vue";

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/services', name: 'Services', component: Services },
  { path: '/services/:id', name: 'ServiceDetail', component: ServiceDetail, props: true },
  { path: '/technicians', name: 'Technicians', component: Technicians },
  { path: '/technicians/:id', name: 'TechnicianDetail', component: TechnicianDetail, props: true },
  { path: '/products', name: 'Products', component: Products },
  { path: '/products/:id', name: 'ProductDetail', component: ProductDetail, props: true },

  { path: "/account", component: AccountPage },
  { path: "/contact-supplier", component: ContactSupplier },

  // 🔍 New Search Results page
  { path: '/search', name: 'Search', component: SearchResults },

  // Catch-all 404
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: () => import('../pages/NotFound.vue') 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
