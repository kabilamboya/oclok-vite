// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// Import pages
import Home from '../pages/Home.vue';
import Media from '../pages/Media.vue';
import Technicians from '../pages/Technicians.vue';
import DoctorProfile from '../pages/DoctorProfile.vue';
import Products from '../pages/Store.vue';
import Cyber from '../pages/Cyber.vue';
import ProductDetail from '../pages/ProductDetail.vue';
import SearchResults from '../pages/SearchResults.vue';
import AccountPage from '../pages/AccountPage.vue';
import NotFound from '../pages/NotFound.vue';

import Hellen from '../pages/Hellen.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },

  // Media
  { path: '/media', name: 'Media', component: Media },

  // Technicians
  { path: '/technicians', name: 'Technicians', component: Technicians },
  { path: '/technicians/:slug', name: 'DoctorProfile', component: DoctorProfile, props: true },
  { path: '/technicians/hellen', name: 'Hellen', component: Hellen },

  // Products
  { path: '/products', name: 'Products', component: Products },
  { path: '/products/:id', name: 'ProductDetail', component: ProductDetail, props: true },

  // Accounts + Checkout
  { path: '/account', name: 'AccountPage', component: AccountPage },

  // Search
  { path: '/search', name: 'Search', component: SearchResults },

  // Cyber
  { path: '/cyber', name: 'Cyber', component: Cyber },

  // Design Gallery
  {
    path: '/gallery',
    name: 'DesignGallery',
    component: () => import('../pages/DesignGallery.vue')
  },

  {
  path: "/checkout",
  name: "Checkout",
  component: () => import("../pages/CheckOut.vue"),
  props: route => ({ cart: JSON.parse(localStorage.getItem("cart")) || [] })
},

  // 404 — Keep last
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0 };
  }
});

export default router;
