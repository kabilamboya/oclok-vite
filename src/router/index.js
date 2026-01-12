// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// Pages using dynamic imports
const Home = () => import('../pages/Home.vue');
const Media = () => import('../pages/Media.vue');
const Technicians = () => import('../pages/Technicians.vue');
const DoctorProfile = () => import('../pages/DoctorProfile.vue');
const Hellen = () => import('../pages/Hellen.vue');
const Products = () => import('../pages/Store.vue');
const ProductDetail = () => import('../pages/ProductDetail.vue');
const AccountPage = () => import('../pages/AccountPage.vue');
const Cyber = () => import('../pages/Cyber.vue');
const Discover = () => import('../pages/Discover.vue');
const DiscoverDetails = () => import('../pages/DiscoverDetails.vue');
const SearchResults = () => import('../pages/SearchResults.vue');
const CheckOut = () => import('../pages/CheckOut.vue');
const NotFound = () => import('../pages/NotFound.vue');

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/media', name: 'Media', component: Media },

  // Technicians
  { path: '/technicians', name: 'Technicians', component: Technicians },
  { path: '/technicians/hellen', name: 'Hellen', component: Hellen },
  { path: '/technicians/:slug', name: 'DoctorProfile', component: DoctorProfile, props: true },

  // Products
  { path: '/products', name: 'Products', component: Products },
  { path: '/products/:id', name: 'ProductDetail', component: ProductDetail, props: true },

  // Account
  { path: '/account', name: 'AccountPage', component: AccountPage },

  // Cyber page with nested routes
  {
    path: '/cyber',
    name: 'Cyber',
    component: Cyber,
    children: [
      { path: '', redirect: 'creator' } // default route
    ]
  },

  { path: '/discover', name: 'Discover', component: Discover },
  { path: '/discover/:slug', name: 'DiscoverDetails', component: DiscoverDetails, props: true },

  // Search
  { path: '/search', name: 'Search', component: SearchResults },

  // Checkout
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckOut,
    props: () => ({ cart: JSON.parse(localStorage.getItem('cart')) || [] })
  },

  // 404 - Must be last
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
