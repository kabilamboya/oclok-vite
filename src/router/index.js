import { createRouter, createWebHistory } from "vue-router";

const Home = () => import('../pages/Home.vue');
const Media = () => import('../pages/Media.vue');
const Technicians = () => import('../pages/Technicians.vue');
const DoctorProfile = () => import('../pages/DoctorProfile.vue');
const KabilaMboya = () => import('../pages/KabilaMboya.vue');
const Hellen = () => import('../pages/Hellen.vue');
const Products = () => import('../pages/Store.vue');
const ProductDetail = () => import('../pages/ProductDetail.vue');
const AccountPage = () => import('../pages/AccountPage.vue');
const Cyber = () => import('../pages/Cyber.vue');
const CyberHome = () => import('../pages/Creator/CyberHome.vue');
const Writer = () => import('../pages/Creator/Writer.vue');
const Mockups = () => import('../pages/Creator/Mockups.vue');
const Gallery = () => import('../pages/Creator/Gallery.vue');
const Prompts = () => import('../pages/Creator/Prompts.vue');
const Discover = () => import('../pages/Discover.vue');
const DiscoverDetails = () => import('../pages/DiscoverDetails.vue');
const Robots = () => import('../pages/Robots.vue');
const SearchResults = () => import('../pages/SearchResults.vue');
const CheckOut = () => import('../pages/CheckOut.vue');
const NotFound = () => import('../pages/NotFound.vue');

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/media', name: 'Media', component: Media },
  { path: '/technicians', name: 'Technicians', component: Technicians },
  { path: '/technicians/kabila-mboya', name: 'KabilaMboya', component: KabilaMboya },
  { path: '/technicians/hellen', name: 'Hellen', component: Hellen },
  { path: '/technicians/:slug', name: 'DoctorProfile', component: DoctorProfile, props: true },
  { path: '/products', name: 'Products', component: Products },
  { path: '/products/:id', name: 'ProductDetail', component: ProductDetail, props: true },
  { path: '/account', name: 'AccountPage', component: AccountPage },

  // Cyber routes with children
  {
    path: '/cyber',
    name: 'Cyber',
    component: Cyber,
    children: [
      { path: '', name: 'CyberHome', component: CyberHome },
      // { path: 'creator', name: 'Creator', component: Mockups },  Consolidated 2D design studio
      { path: 'writer', name: 'Writer', component: Writer },
      { path: 'mockups', name: 'Mockups', component: Mockups },
      { path: 'gallery', name: 'Gallery', component: Gallery },
      { path: 'prompts', name: 'Prompts', component: Prompts }
    ]
  },

  { path: '/discover', name: 'Discover', component: Discover },
  { path: '/discover/:slug', name: 'DiscoverDetails', component: DiscoverDetails, props: true },
  { path: '/robots', name: 'Robots', component: Robots },
  { path: '/search', name: 'Search', component: SearchResults },
  { path: '/checkout', name: 'Checkout', component: CheckOut },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Export router at the end
export default router;
