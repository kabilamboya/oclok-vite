<template>
  <main class="admin-shell" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <aside class="admin-sidebar">
      <div class="brand-block">
        <div class="brand-mark">O!</div>
        <div v-if="!sidebarCollapsed"><strong>OCLOK</strong><small>ADMIN</small></div>
      </div>
      <button class="collapse-button" type="button" aria-label="Toggle sidebar" @click="sidebarCollapsed = !sidebarCollapsed">{{ sidebarCollapsed ? '>' : '<' }}</button>
      <RouterLink to="/" class="back-website" :title="sidebarCollapsed ? 'Back to website' : ''"><span>&larr;</span><b v-if="!sidebarCollapsed">Back to Website</b></RouterLink>
      <nav class="admin-nav" aria-label="Admin navigation">
        <p v-if="!sidebarCollapsed" class="nav-label">Overview</p>
        <button class="nav-item" :class="{ active: activeSection === 'overview' }" type="button" @click="activeSection = 'overview'"><span>▥</span><b v-if="!sidebarCollapsed">Overview</b></button>
        <p v-if="!sidebarCollapsed" class="nav-label">Operations</p>
        <button v-if="hasWorkshops" class="nav-item" type="button" @click="activeSection = 'workshop'"><span>▧</span><b v-if="!sidebarCollapsed">Workshop</b></button>
        <button v-if="hasRecords" class="nav-item" type="button" @click="activeSection = 'records'"><span>▤</span><b v-if="!sidebarCollapsed">Records</b></button>
        <button v-if="hasReports" class="nav-item" type="button" @click="activeSection = 'reports'"><span>◫</span><b v-if="!sidebarCollapsed">Reports</b></button>
        <button v-if="hasStock" class="nav-item" type="button" @click="activeSection = 'stock'"><span>▱</span><b v-if="!sidebarCollapsed">Stock</b></button>
        <p v-if="!sidebarCollapsed" class="nav-label">Analytics</p>
        <button class="nav-item" :class="{ active: activeSection === 'sales' }" type="button" @click="activeSection = 'sales'"><span>▱</span><b v-if="!sidebarCollapsed">Sales</b></button>
        <button class="nav-item" :class="{ active: activeSection === 'financials' }" type="button" @click="activeSection = 'financials'"><span>₵</span><b v-if="!sidebarCollapsed">Financials</b></button>
        <p v-if="!sidebarCollapsed" class="nav-label">Team</p>
        <button class="nav-item" :class="{ active: activeSection === 'users' }" type="button" @click="activeSection = 'users'"><span>♙</span><b v-if="!sidebarCollapsed">Team Access</b></button>
      </nav>
      <div v-if="!sidebarCollapsed" class="admin-profile-wrap">
        <div class="admin-profile">
          <div class="avatar">A</div>
          <div class="admin-profile-meta">
            <strong>admin</strong>
            <small>{{ currentRole }}</small>
          </div>
          <button class="profile-role-toggle" type="button" aria-label="Switch admin role" @click="roleMenuOpen = !roleMenuOpen">✎</button>
        </div>
        <div v-if="roleMenuOpen" class="role-menu" role="menu" aria-label="Admin role menu">
          <button v-for="role in roleOptions" :key="role" class="role-menu-item" type="button" :class="{ active: currentRole === role }" @click="setRole(role)">
            {{ role }}
          </button>
          <button class="role-menu-item signout-item" type="button" @click="signOutAdmin">Sign out</button>
        </div>
      </div>
    </aside>

    <section class="admin-content">
      <header class="topbar">
        <div class="topbar-main">
          <button class="mobile-menu" type="button" aria-label="Toggle sidebar" @click="sidebarCollapsed = !sidebarCollapsed">☰</button>
          <div class="page-title-block">
            <strong>Oclok Business Cockpit</strong>
            <div class="cockpit-header">
              <p> - {{ selectedYear }}</p>
            </div>
          </div>
          <div class="top-actions">
            <span class="status-pill">{{ currentRole }}</span>
          </div>
        </div>
        <div class="header-filters">
          <div class="filters">
            <button v-for="period in periods" :key="period" type="button" :class="{ selected: selectedPeriod === period }" @click="selectedPeriod = period">{{ period }}</button>
            <select v-model="selectedShop" aria-label="Select shop"><option>All Shops</option><option>Oclok Store</option><option>Oclok Cyber</option><option>Oclok Media</option></select>
          </div>
        </div>
      </header>

      <div v-if="activeSection !== 'users'" class="dashboard-body">
        <component :is="panelComponent" v-bind="panelProps" @save="saveFinancials"></component>
      </div>

      <section v-else class="user-management dashboard-body">
        <section class="intro-panel">
          <div>
            <h1>Team Access</h1>
            <p>{{ users.length }} registered technicians</p>
          </div>
          <button class="primary-action" type="button" @click="showNotice('All technicians are already registered from the technician directory.')">+ Add User</button>
        </section>

        <section class="user-summary-grid">
          <article class="user-summary">
            <span>Technicians</span>
            <strong>{{ technicianCount }}</strong>
            <small>Registered technician profiles</small>
          </article>
        </section>

        <section class="dashboard-card users-card">
          <div class="card-heading users-heading">
            <div>
              <p>User directory</p>
              <h2>Manage registered users</h2>
            </div>
            <div class="user-filters">
              <input v-model="userSearch" type="search" placeholder="Search users..." aria-label="Search users" />
              <select v-model="userStatusFilter" aria-label="Filter by status">
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div class="users-table-wrap">
            <table class="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Edit permission</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td>
                    <div class="user-cell">
                      <span class="user-initial">{{ user.initial }}</span>
                      <div>
                        <strong>{{ user.name }}</strong>
                        <small>{{ user.email }}</small>
                      </div>
                    </div>
                  </td>
                  <td><span class="role-badge">{{ user.role }}</span></td>
                  <td>{{ user.location }}</td>
                  <td><span class="status-badge" :class="user.status">{{ user.status }}</span></td>
                  <td>
                    <button class="permission-button" type="button" :class="{ granted: user.canEditDetails }" @click="toggleEditPermission(user)">
                      {{ user.canEditDetails ? 'Allowed' : 'Blocked' }}
                    </button>
                  </td>
                  <td class="user-actions">
                    <button class="table-action" type="button" :disabled="!user.canEditDetails" @click="openUserEditor(user)">Edit details</button>
                    <button class="table-action" type="button" @click="toggleUserStatus(user)">{{ user.status === 'active' ? 'Suspend' : 'Activate' }}</button>
                  </td>
                </tr>

                <tr v-if="filteredUsers.length === 0">
                  <td colspan="6" class="empty-users">No users match your filters.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div v-if="editingUser" class="editor-overlay" @click.self="closeUserEditor">
          <form class="profile-editor" @submit.prevent="saveUserDetails">
            <div class="editor-header">
              <div>
                <p>Edit permissioned profile</p>
                <h2>{{ editingUser.name }}</h2>
              </div>
              <button type="button" class="editor-close" aria-label="Close editor" @click="closeUserEditor">&times;</button>
            </div>

            <label>Name<input v-model="editForm.name" required /></label>
            <label>Specialty<input v-model="editForm.specialty" required /></label>
            <label>Bio<textarea v-model="editForm.bio" rows="4" required></textarea></label>

            <div class="editor-fields">
              <label>Email<input v-model="editForm.email" type="email" required /></label>
              <label>Phone<input v-model="editForm.phone" type="tel" /></label>
            </div>

            <label>Location<input v-model="editForm.location" required /></label>

            <div class="editor-actions">
              <button type="button" class="secondary-action" @click="closeUserEditor">Cancel</button>
              <button type="submit" class="primary-action">Save details</button>
            </div>
          </form>
        </div>

        <p v-if="notice" class="toast" role="status">{{ notice }}</p>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import electronicProducts from '../data/electronics.json';
import boutiqueProducts from '../data/boutique.json';
import technicians from '../data/technicians.json';
import media from '../data/media.json';
import services from '../data/services.json';
import mediaServices from '../data/mediaServices.json';
import places from '../data/places.json';
import AdminOverview from '../components/admin/AdminOverview.vue';
import AdminSales from '../components/admin/AdminSales.vue';
import AdminFinancials from '../components/admin/AdminFinancials.vue';
import { createId, readStore, writeStore } from '../lib/localStore';
import { saveProfileOverride } from '../services/userProfiles.service';
import { getRegisteredUser } from '../services/auth.service';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const STOCK_STORAGE_KEY = 'oclok_store_stock';
const normalizeCatalogIds = (...catalogs) => {
  const seen = new Set();
  const merged = [];

  catalogs.forEach((catalog) => {
    (Array.isArray(catalog) ? catalog : []).forEach((item) => {
      if (!item || typeof item !== 'object') return;

      let nextId = Number(item.id);
      if (!Number.isFinite(nextId) || seen.has(nextId)) {
        nextId = 1;
        while (seen.has(nextId)) {
          nextId += 1;
        }
      }

      seen.add(nextId);
      merged.push({ ...item, id: nextId });
    });
  });

  return merged;
};

const products = normalizeCatalogIds(electronicProducts, boutiqueProducts);
const sidebarCollapsed = ref(false);
const activeSection = ref('overview');
const selectedPeriod = ref('YTD');
const selectedShop = ref('All Shops');
const currentRole = ref('Operations');
const roleOptions = ['Operations', 'General Manager'];
const roleMenuOpen = ref(false);
const notice = ref('');
const userSearch = ref('');
const userStatusFilter = ref('all');
const editingUser = ref(null);
const editForm = ref({});
const periods = ['YTD', 'This Month', 'This Week', 'All Time'];
const selectedYear = ref(2026);
const stockCategories = ['Smart Home', 'Phones', 'Watches', 'Audio', 'Accessories', 'Security', 'Kitchen', 'Clothing', 'Footwear', 'Bags'];
const stockForm = ref({ name: '', category: 'Smart Home', price: 0, inStock: true, description: '', image: '' });
const stockEntries = ref((readStore(STOCK_STORAGE_KEY, products) || []).map((item) => ({
  ...item,
  id: item.id || createId('stock'),
  price: Number(item.price) || 0,
  inStock: item.inStock !== false,
  image: item.image || '/images/placeholder.jpg',
  description: item.description || item.name || 'Available product',
})));
const productCount = computed(() => Array.isArray(products) ? products.length : 0);
const technicianCount = technicians.length;
// Visibility flags for admin modules — computed from available data
const hasWorkshops = computed(() => false); // no workshops data yet
const hasRecords = computed(() => false); // no records data yet
const hasReports = computed(() => true); // reports use computed metrics
const hasStock = computed(() => Array.isArray(stockEntries.value) && stockEntries.value.length > 0);

const persistStock = () => {
  writeStore(STOCK_STORAGE_KEY, stockEntries.value);
  window.dispatchEvent(new CustomEvent('oclok-stock-updated', { detail: stockEntries.value }));
};

const syncStoreCatalog = () => {
  const savedStock = readStore(STOCK_STORAGE_KEY, products);
  const nextStock = Array.isArray(savedStock) && savedStock.length ? savedStock : products;
  stockEntries.value = nextStock.map((item) => ({
    ...item,
    id: item.id || createId('stock'),
    price: Number(item.price) || 0,
    inStock: item.inStock !== false,
    image: item.image || '/images/placeholder.jpg',
    description: item.description || item.name || 'Available product',
  }));
  writeStore(STOCK_STORAGE_KEY, stockEntries.value);
};
const normalizeRole = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized.includes('deliboi')) return 'Deliboi';
  if (normalized.includes('technician')) return 'Technician';
  return 'Novice Customer';
};
const normalizeStatus = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (['active', 'approved', 'verified'].includes(normalized)) return 'active';
  if (['pending', 'review'].includes(normalized)) return 'pending';
  return 'suspended';
};
const defaultUsers = technicians.map((technician) => ({
  id: technician.id,
  name: technician.name,
  email: technician.contact?.email || 'No email provided',
  role: 'Technician',
  specialty: technician.specialty || 'Technician',
  bio: technician.bio || '',
  phone: technician.contact?.phone || '',
  location: technician.location || 'Location not provided',
  status: 'active',
  canEditDetails: true,
  lastActivity: 'Recently registered',
  initial: (technician.name || 'U').charAt(0).toUpperCase(),
}));
const storedUsers = readStore('oclok_admin_users', defaultUsers);
const users = ref((Array.isArray(storedUsers) ? storedUsers : defaultUsers).map((user) => {
  const source = technicians.find((technician) => technician.id === user.id) || {};
  return {
    ...user,
    role: normalizeRole(user.role || user.accountType || user.account_type),
    specialty: user.specialty || source.specialty || 'Technician',
    bio: user.bio || source.bio || '',
    phone: user.phone || source.contact?.phone || '',
    status: normalizeStatus(user.status),
    canEditDetails: user.canEditDetails !== false,
    initial: user.initial || (user.name || 'U').charAt(0).toUpperCase(),
  };
}));
const activeUserCount = computed(() => users.value.filter((user) => user.status === 'active').length);
const pendingUserCount = computed(() => users.value.filter((user) => user.status === 'pending').length);
const filteredUsers = computed(() => users.value.filter((user) => {
  const search = userSearch.value.trim().toLowerCase();
  const matchesSearch = !search || `${user.name} ${user.email} ${user.location}`.toLowerCase().includes(search);
  const matchesStatus = userStatusFilter.value === 'all' || user.status === userStatusFilter.value;
  return matchesSearch && matchesStatus;
}));
const recentOrders = computed(() => []);
const storeCount = computed(() => Array.isArray(products) ? products.length : 0);
const mediaCount = computed(() => Array.isArray(media) ? media.length : 0);
const servicesCount = computed(() => {
  const base = Array.isArray(services) ? services.length : 0;
  const mediaSvc = Array.isArray(mediaServices) ? mediaServices.length : 0;
  return base + mediaSvc;
});
const cyberCount = computed(() => (Array.isArray(services) ? services.filter((s) => String(s.title || s.category || '').toLowerCase().includes('cyber') || String(s.category || '').toLowerCase().includes('security')).length : 0));
const discoverCount = computed(() => Array.isArray(places) ? places.length : 0);

const metrics = computed(() => [
  { label: 'Store products', value: storeCount.value, note: 'Products in store', icon: '▱', tone: 'yellow' },
  { label: 'Services', value: servicesCount.value, note: 'Catalogued services', icon: '⚙', tone: 'blue' },
  { label: 'Media items', value: mediaCount.value, note: 'Media & content pieces', icon: '▣', tone: 'purple' },
  { label: 'Technicians', value: technicianCount, note: 'Registered technicians', icon: '♙', tone: 'teal' },
  { label: 'Cyber services', value: cyberCount.value, note: 'Cyber & security offerings', icon: '🛡', tone: 'red' },
  { label: 'Discover items', value: discoverCount.value, note: 'Discoverable places/resources', icon: '🔎', tone: 'green' },
]);
// Sales: simple per-category revenue model (values in KES thousands)
const STORE_UNIT_K = 25; // KES x1000 per product (approx)
const MEDIA_UNIT_K = 10; // per media item
const SERVICE_UNIT_K = 15; // per service

const storeRevenueK = computed(() => Math.round(storeCount.value * STORE_UNIT_K));
const mediaRevenueK = computed(() => Math.round(mediaCount.value * MEDIA_UNIT_K));
const servicesRevenueK = computed(() => Math.round(servicesCount.value * SERVICE_UNIT_K));
const totalRevenueK = computed(() => storeRevenueK.value + mediaRevenueK.value + servicesRevenueK.value);

const salesChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const salesSeries = computed(() => {
  // simple synthetic series based on totalRevenueK for charting
  const base = Array.from({ length: salesChartLabels.length }, (_, i) => Math.round((totalRevenueK.value / salesChartLabels.length) * (0.7 + i * 0.06)));
  return base;
});

// Stock chart: lightweight line-graph of recent stock value totals
const stockChartLabels = ['W1', 'W2', 'W3', 'W4'];
const stockSeries = computed(() => {
  const totals = stockChartLabels.map(() => stockEntries.value.reduce((s, i) => s + (Number(i.price) || 0), 0));
  return totals;
});
const stockChartPoints = computed(() => {
  const points = stockSeries.value;
  const width = 440;
  const height = 120;
  const padding = 12;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const spread = max - min || 1;
  return points.map((point, index) => ({
    index,
    x: padding + (index * (width - padding * 2)) / Math.max(points.length - 1, 1),
    y: height - padding - ((point - min) / spread) * (height - padding * 2),
  }));
});
const stockLinePath = computed(() => stockChartPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '));
const salesChartPoints = computed(() => {
  const points = salesSeries.value;
  const width = 440;
  const height = 180;
  const padding = 16;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const spread = max - min || 1;
  return points.map((point, index) => ({
    index,
    x: padding + (index * (width - padding * 2)) / Math.max(points.length - 1, 1),
    y: height - padding - ((point - min) / spread) * (height - padding * 2),
  }));
});
const salesLinePath = computed(() => salesChartPoints.value.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' '));
const salesAreaPath = computed(() => {
  const points = salesChartPoints.value;
  if (!points.length) return '';
  const line = salesLinePath.value;
  const lastX = points[points.length - 1].x;
  const firstX = points[0].x;
  const bottomY = 180 - 16;
  return `${line} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
});
const salesSummary = computed(() => {
  const total = totalRevenueK.value;
  const growth = 0; // placeholder: growth by year requires historical data
  const orders = Math.max(24, Math.round(total / 10));
  return {
    total: `KES ${total}K`,
    growth: `${growth >= 0 ? '+' : ''}${growth}%`,
    orders: `${orders}`,
  };
});

// Financials: input capital, gross revenue, gross profit/loss persisted in local storage
const FINANCIAL_KEY = 'oclok_admin_financials';
const storedFinancials = readStore(FINANCIAL_KEY, { capital: 0, revenue: 0 });
const financials = ref({ capital: Number(storedFinancials.capital) || 0, revenue: Number(storedFinancials.revenue) || 0 });
const grossProfit = computed(() => {
  const profit = Number(financials.value.revenue) - Number(financials.value.capital);
  return profit;
});
const grossProfitLabel = computed(() => (grossProfit.value >= 0 ? `Profit KES ${grossProfit.value}` : `Loss KES ${Math.abs(grossProfit.value)}`));
const saveFinancials = () => {
  writeStore(FINANCIAL_KEY, financials.value);
  showNotice('Financials saved');
};
const salesChannels = computed(() => {
  const store = { name: 'Oclok Store', revenueK: storeRevenueK.value, orders: Math.round(storeRevenueK.value / 10) };
  const cyber = { name: 'Oclok Cyber', revenueK: servicesRevenueK.value, orders: Math.round(servicesRevenueK.value / 10) };
  const mediaCh = { name: 'Oclok Media', revenueK: mediaRevenueK.value, orders: Math.round(mediaRevenueK.value / 10) };
  const base = [store, cyber, mediaCh];
  const total = base.reduce((s, c) => s + c.revenueK, 0) || 1;
  return base.map((channel) => ({
    ...channel,
    revenue: `KES ${channel.revenueK}K`,
    share: `${Math.round((channel.revenueK / total) * 100)}%`,
  }));
});
const shopPerformance = computed(() => salesChannels.value.map((c) => ({ name: c.name, orders: c.orders, share: Number(c.share.replace('%', '')) })));
const processStatusOrder = ['On track', 'Review', 'Delayed', 'Complete'];
const processRows = ref([
  { name: 'Inbound order intake', owner: 'Operations desk', due: 'Today', progress: 84, status: 'On track' },
  { name: 'Quality control', owner: 'Warehouse lead', due: 'Tomorrow', progress: 66, status: 'Review' },
  { name: 'Customer follow-up', owner: 'Sales desk', due: '2 days', progress: 52, status: 'Delayed' },
  { name: 'Finance reconciliation', owner: 'Accounts', due: 'Friday', progress: 93, status: 'Complete' },
]);
const cycleProcessStatus = (process) => {
  const currentIndex = processStatusOrder.indexOf(process.status);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % processStatusOrder.length;
  process.status = processStatusOrder[nextIndex];
  process.progress = process.status === 'Complete' ? 100 : process.status === 'Delayed' ? 42 : process.status === 'Review' ? 68 : 84;
  showNotice(`${process.name} moved to ${process.status}.`);
};
const categories = [
  { name: 'Smart Home', revenue: 'KES 128K', transactions: 486, share: '52%' },
  { name: 'Cyber Services', revenue: 'KES 74K', transactions: 294, share: '30%' },
  { name: 'Media & Content', revenue: 'KES 46K', transactions: 216, share: '18%' },
];
const activities = [
  { icon: '▣', title: 'New order received', meta: 'Smart Home / 12 minutes ago', value: 'KES 50K' },
  { icon: '♙', title: 'Technician profile updated', meta: 'Kabila Mboya / 1 hour ago', value: 'Review' },
  { icon: '!', title: 'Invoice requires follow-up', meta: 'Oclok Cyber / Yesterday', value: 'KES 18K' },
];
const summaryText = computed(() => selectedShop.value === 'All Shops' ? 'All business channels are tracking above target for the current period.' : `${selectedShop.value} performance is ready for review.`);
const syncFromSupabase = async () => {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const usersResponse = await supabase.from('users').select('*').order('created_at', { ascending: false });

    if (!usersResponse.error && Array.isArray(usersResponse.data)) {
      const nextUsers = usersResponse.data.map((entry) => ({
        id: entry.id,
        name: entry.name || 'Unnamed user',
        email: entry.email || 'No email provided',
        role: normalizeRole(entry.account_type || entry.accountType || 'novice customer'),
        specialty: entry.specialty || 'Account',
        bio: entry.bio || '',
        phone: entry.phone || '',
        location: entry.location || 'Location not provided',
        status: normalizeStatus(entry.status || 'active'),
        canEditDetails: true,
        lastActivity: 'Synced from Supabase',
        initial: (entry.name || 'U').charAt(0).toUpperCase(),
      }));
      const mergedUsers = [...nextUsers, ...users.value.filter((currentUser) => !nextUsers.some((candidate) => candidate.email === currentUser.email))];
      users.value = mergedUsers;
      writeStore('oclok_admin_users', users.value);
    }

    // Orders sync removed from admin dashboard to avoid redundant tracking here
  } catch (error) {
    console.error('Unable to sync admin dashboard data:', error);
  }
};
const toggleEditPermission = (user) => {
  user.canEditDetails = !user.canEditDetails;
  writeStore('oclok_admin_users', users.value);
  showNotice(`${user.name} can ${user.canEditDetails ? 'now' : 'no longer'} edit profile details.`);
};
const openUserEditor = (user) => {
  if (!user.canEditDetails) return;
  editingUser.value = user;
  editForm.value = {
    name: user.name,
    specialty: user.specialty,
    bio: user.bio,
    email: user.email,
    phone: user.phone,
    location: user.location,
  };
};
const closeUserEditor = () => {
  editingUser.value = null;
  editForm.value = {};
};
const saveUserDetails = () => {
  if (!editingUser.value) return;
  const user = editingUser.value;
  Object.assign(user, editForm.value, { initial: editForm.value.name.charAt(0).toUpperCase(), lastActivity: 'Updated just now' });
  saveProfileOverride(user.id, {
    name: editForm.value.name,
    specialty: editForm.value.specialty,
    bio: editForm.value.bio,
    location: editForm.value.location,
    contact: { email: editForm.value.email, phone: editForm.value.phone },
  });
  writeStore('oclok_admin_users', users.value);
  closeUserEditor();
  showNotice(`${user.name}'s profile details were saved.`);
};
const toggleUserStatus = (user) => {
  user.status = user.status === 'active' ? 'suspended' : 'active';
  user.lastActivity = 'Updated just now';
  writeStore('oclok_admin_users', users.value);
  showNotice(`${user.name} is now ${user.status}.`);
};
const addStockItem = () => {
  const trimmedName = stockForm.value.name.trim();
  if (!trimmedName) return;

  const nextItem = {
    id: createId('stock'),
    name: trimmedName,
    category: stockForm.value.category,
    price: Number(stockForm.value.price) || 0,
    inStock: stockForm.value.inStock !== false,
    description: stockForm.value.description.trim() || `${trimmedName} is now available in the catalogue.`,
    image: stockForm.value.image || '/images/placeholder.jpg',
  };

  stockEntries.value.unshift(nextItem);
  persistStock();
  stockForm.value = { name: '', category: 'Smart Home', price: 0, inStock: true, description: '', image: '' };
  showNotice(`${trimmedName} was added to stock.`);
};

const updateStockPrice = (item, value) => {
  item.price = Number(value) || 0;
  persistStock();
};

const toggleStockStatus = (item) => {
  item.inStock = !item.inStock;
  persistStock();
  showNotice(`${item.name} marked ${item.inStock ? 'in stock' : 'out of stock'}.`);
};

const removeStockItem = (itemId) => {
  const item = stockEntries.value.find((entry) => entry.id === itemId);
  stockEntries.value = stockEntries.value.filter((entry) => entry.id !== itemId);
  persistStock();
  if (item) showNotice(`${item.name} was removed from stock.`);
};

const setRole = (role) => {
  if (!roleOptions.includes(role)) return;
  currentRole.value = role;
  roleMenuOpen.value = false;
  showNotice(`${role} role selected.`);
};

const signOutAdmin = () => {
  roleMenuOpen.value = false;
  showNotice('Signed out of admin role.');
};

const showNotice = (message) => { notice.value = message; window.clearTimeout(showNotice.timer); showNotice.timer = window.setTimeout(() => { notice.value = ''; }, 2800); };

onMounted(() => {
  const registeredUser = getRegisteredUser();
  if (registeredUser && !users.value.some((user) => user.email === registeredUser.email || user.name === registeredUser.name)) {
    users.value.unshift({
      id: `account-${Date.now()}`,
      name: registeredUser.name,
      email: registeredUser.email,
      role: normalizeRole(registeredUser.account_type || registeredUser.accountType),
      specialty: 'Registered account',
      bio: 'Signed up through the new account flow.',
      phone: registeredUser.phone || '',
      location: 'Location pending',
      status: 'active',
      canEditDetails: false,
      lastActivity: 'Just registered',
      initial: (registeredUser.name || 'U').charAt(0).toUpperCase(),
    });
    writeStore('oclok_admin_users', users.value);
  }

  // Orders are no longer loaded into the admin dashboard to avoid redundant tracking

  syncStoreCatalog();
  syncFromSupabase();
});

const panelComponent = computed(() => {
  switch (activeSection.value) {
    case 'overview': return AdminOverview;
    case 'stock': return AdminSales;
    case 'sales': return AdminSales;
    case 'financials': return AdminFinancials;
    default: return AdminOverview;
  }
});

const panelProps = computed(() => {
  if (activeSection.value === 'overview') return { selectedPeriod: selectedPeriod.value, summaryText: summaryText.value, productCount: productCount.value, metrics: metrics.value };
  if (activeSection.value === 'sales') return { selectedPeriod: selectedPeriod.value, selectedShop: selectedShop.value, salesSummary: salesSummary.value, salesChartPoints: salesChartPoints.value, salesAreaPath: salesAreaPath.value, salesLinePath: salesLinePath.value, salesChartLabels: salesChartLabels, salesChannels: salesChannels.value };
  if (activeSection.value === 'financials') return { selectedYear: selectedYear.value, financials: financials.value, grossProfitLabel: grossProfitLabel.value };
  if (activeSection.value === 'stock') return { selectedPeriod: selectedPeriod.value, selectedShop: selectedShop.value, salesSummary: salesSummary.value, salesChartPoints: salesChartPoints.value, salesAreaPath: salesAreaPath.value, salesLinePath: salesLinePath.value, salesChartLabels: salesChartLabels, salesChannels: salesChannels.value, stockEntries: stockEntries.value, stockChartLabels: stockChartLabels, stockLinePath: stockLinePath.value };
  return {};
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap');
.admin-shell { --ink: var(--text); --muted: var(--text-muted); --paper: var(--bg); --card: var(--surface); --line: var(--border); --red: var(--color-primary); --green: var(--color-secondary); --purple: var(--color-accent); min-height:100vh; display:flex; background:var(--paper); color:var(--ink); font-family:'Manrope', Arial, sans-serif; }
.admin-sidebar { width:220px; flex:0 0 220px; position:relative; background:#fff; border-right:1px solid var(--line); transition:width .25s, flex-basis .25s; padding:1.4rem 0; display:flex; flex-direction:column; }
.sidebar-collapsed .admin-sidebar { width:76px; flex-basis:76px; }.brand-block { display:flex; align-items:center; gap:.7rem; padding:0 1.25rem 1.6rem; border-bottom:1px solid var(--line); }.brand-mark { width:30px; height:30px; display:grid; place-items:center; background:var(--red); color:#fff; font-weight:800; font-size:1rem; }.brand-block strong { display:block; letter-spacing:.12em; font-size:.82rem; }.brand-block small,.admin-profile small { display:block; color:var(--muted); font:500 .6rem 'DM Mono'; letter-spacing:.14em; margin-top:.18rem; }.collapse-button { position:absolute; right:-13px; top:1.25rem; width:26px; height:26px; border:1px solid var(--line); border-radius:50%; background:#fff; color:var(--ink); cursor:pointer; }.admin-nav { padding:1.1rem .8rem; }.nav-label { padding:0 .65rem; margin:.9rem 0 .5rem; color:#9aa29c; font:500 .62rem 'DM Mono'; letter-spacing:.14em; text-transform:uppercase; }.nav-item { width:100%; display:flex; align-items:center; gap:.75rem; padding:.75rem .7rem; border:0; border-left:2px solid transparent; background:transparent; color:var(--muted); text-align:left; cursor:pointer; font:500 .78rem 'Manrope'; }.nav-item span { width:22px; text-align:center; font-size:1rem; }.nav-item b { font-weight:600; }.nav-item i { margin-left:auto; font-style:normal; color:var(--red); }.nav-item.active { background:#fff0f0; border-left-color:var(--red); color:var(--red); }.admin-profile-wrap { margin:auto .9rem 0; display:flex; flex-direction:column; gap:.5rem; }.admin-profile { display:flex; align-items:center; gap:.55rem; padding:.7rem; border:1px solid var(--line); background:#f8f8f5; font-size:.7rem; position:relative; }.admin-profile .avatar { width:29px; height:29px; display:grid; place-items:center; border-radius:50%; background:#ffd8d8; color:var(--red); font-weight:800; }.admin-profile-meta { flex:1; min-width:0; }.admin-profile-meta strong,.admin-profile-meta small { display:block; }.profile-role-toggle { width:28px; height:28px; border:1px solid var(--line); border-radius:8px; background:#fff; color:var(--ink); cursor:pointer; font-size:.82rem; }.role-menu { display:flex; flex-direction:column; gap:.35rem; padding:.45rem; border:1px solid var(--line); background:#fff; border-radius:10px; box-shadow:0 10px 24px rgba(15,23,42,.08); }.role-menu-item { width:100%; border:1px solid transparent; background:#f7f7f7; color:var(--ink); padding:.6rem .7rem; border-radius:8px; text-align:left; font:600 .72rem 'Manrope'; cursor:pointer; }.role-menu-item.active { border-color:var(--red); background:rgba(255,122,0,.08); color:var(--red); }.role-menu-item.signout-item { background:transparent; border-color:var(--line); color:var(--muted); } .admin-profile span { margin-left:auto; color:var(--muted); }
.back-website { display:flex; align-items:center; gap:.65rem; margin:1rem .8rem 0; padding:.7rem .65rem; color:var(--ink); text-decoration:none; font-size:.75rem; font-weight:700; border-bottom:1px solid var(--line); }.back-website span { width:22px; text-align:center; font-size:1rem; }.back-website:hover { color:var(--red); }
.admin-content { min-width:0; flex:1; }.topbar { background:#fff; border-bottom:1px solid var(--line); font-size:.9rem; display:flex; flex-direction:column; }.topbar-main { min-height:64px; display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:0 1.4rem; position:relative; }.page-title-block { flex:1; display:flex; align-items:center; gap:1rem; min-width:0; }.page-title-block > strong { font-size:.8rem; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }.cockpit-header { display:flex; flex-direction:column; gap:.2rem; }.cockpit-header h1 { margin:0; font-size:1.25rem; letter-spacing:-.03em; }.cockpit-header p,.brief-card>p,.card-heading p { margin:0; color:var(--muted); font:500 .65rem 'DM Mono'; letter-spacing:.1em; text-transform:uppercase; }.header-filters { padding:0 1.4rem 1rem; }.top-actions { display:flex; align-items:center; gap:1rem; }.status-pill { border:1px solid #b5e4dc; background:#effbf8; color:#219482; border-radius:999px; padding:.38rem .85rem; font:500 .68rem 'DM Mono'; }.signout { border:1px solid var(--line); background:#fff; color:var(--ink); border-radius:7px; padding:.5rem .75rem; cursor:pointer; font-size:.72rem; }.mobile-menu { display:none; }
.dashboard-body { max-width:1050px; margin:0 auto; padding:1.6rem; }.intro-panel,.brief-card,.dashboard-card,.metric-card { background:var(--card); border:1px solid var(--line); border-radius:var(--radius-md); box-shadow:0 3px 10px rgba(28,37,32,.05); }.filters { display:flex; align-items:center; gap:.5rem; flex-wrap:wrap; }.filters button,.filters select,.card-heading select { border:1px solid var(--line); border-radius:999px; background:#fff; color:var(--muted); padding:.55rem .8rem; font:500 .7rem 'Manrope'; cursor:pointer; }.filters button.selected { background:var(--red); border-color:var(--red); color:#fff; }.filters select,.card-heading select { border-radius:7px; color:var(--ink); }
.primary-action { border:0; border-radius:7px; background:var(--red); color:#fff; padding:.7rem 1rem; font:700 .75rem 'Manrope'; cursor:pointer; }.user-summary-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.8rem; margin-top:1rem; }.user-summary { display:flex; flex-direction:column; gap:.35rem; padding:1rem 1.15rem; background:var(--card); border:1px solid var(--line); border-radius:var(--radius-md); box-shadow:0 3px 10px rgba(28,37,32,.05); }.user-summary span,.user-summary small { color:var(--muted); font-size:.7rem; }.user-summary strong { font-size:1.5rem; }.users-card { margin-top:1rem; }.users-heading { align-items:center; }.user-filters { display:flex; gap:.5rem; }.user-filters input,.user-filters select { border:1px solid var(--line); border-radius:7px; background:#fff; color:var(--ink); padding:.6rem .7rem; font:500 .72rem 'Manrope'; }.users-table-wrap { overflow-x:auto; }.users-table { min-width:760px; }.user-cell { display:flex; align-items:center; gap:.65rem; }.user-initial { width:30px; height:30px; display:grid; place-items:center; border-radius:50%; background:#ffe1e1; color:var(--red); font-weight:800; }.user-cell strong,.user-cell small { display:block; }.user-cell strong { color:var(--ink); font-size:.75rem; }.user-cell small { margin-top:.2rem; color:var(--muted); font-size:.65rem; }.role-badge,.status-badge { display:inline-block; padding:.32rem .55rem; border-radius:999px; font-size:.65rem; }.role-badge { background:#edf4f1; color:#427167; }.status-badge { text-transform:capitalize; }.status-badge.active { background:#d9f7e7; color:#1d9e5e; }.status-badge.pending { background:#fff0d5; color:#bd7b00; }.status-badge.suspended { background:#ffe1e1; color:var(--red); }.table-action { border:1px solid var(--line); border-radius:6px; background:#fff; color:var(--red); padding:.4rem .55rem; font-size:.65rem; cursor:pointer; }.empty-users { padding:2rem; text-align:center; color:var(--muted); }
.brief-grid { display:grid; grid-template-columns:1.4fr 1fr; gap:1rem; margin-top:1rem; }.brief-card { padding:1.15rem 1.4rem; border-left:3px solid var(--red); }.brief-card h2 { margin:.7rem 0 .4rem; font-size:.95rem; font-weight:600; }.brief-card span { color:var(--muted); font-size:.78rem; }.metric-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:.8rem; margin-top:1rem; }.metric-card { padding:1rem; min-height:105px; border-top:3px solid var(--red); }.metric-heading { display:flex; justify-content:space-between; gap:.5rem; color:var(--muted); font:500 .62rem 'DM Mono'; text-transform:uppercase; }.metric-heading b { width:25px; height:25px; display:grid; place-items:center; border-radius:7px; font:700 .85rem Arial; }.metric-heading .green { background:#d9f7e7; color:#1d9e5e; }.metric-heading .blue { background:#e0f0ff; color:#2587cb; }.metric-heading .red { background:#ffe1e1; color:var(--red); }.metric-heading .orange { background:#fff0d5; color:#e99716; }.metric-heading .purple { background:#f0e2f8; color:#a756c4; }.metric-heading .teal { background:#dbf6f1; color:#168f80; }.metric-heading .yellow { background:#fff4d2; color:#d99c00; }.metric-heading .neutral { background:#f0f1ef; color:#68726d; }.metric-card>strong { display:block; margin:1rem 0 .6rem; font-size:1.05rem; }.metric-card small { color:var(--muted); font-size:.65rem; }.lower-grid { display:grid; grid-template-columns:1fr 1.2fr; gap:1rem; margin-top:1rem; }.dashboard-card { padding:1.15rem 1.25rem; }.card-heading { display:flex; align-items:start; justify-content:space-between; gap:1rem; margin-bottom:1.2rem; }.card-heading h2 { margin:.45rem 0 0; font-size:1rem; }.card-heading>span { color:var(--muted); font:500 .65rem 'DM Mono'; }.shop-row { display:grid; grid-template-columns:1fr auto; gap:.2rem .75rem; margin-bottom:1.15rem; }.shop-row strong { display:block; font-size:.8rem; }.shop-row small { color:var(--muted); font-size:.65rem; }.shop-row>b { grid-column:2; grid-row:1 / span 2; align-self:center; font-size:.8rem; }.progress { grid-column:1 / span 2; height:7px; margin-top:.3rem; background:#e9ebe8; border-radius:99px; overflow:hidden; }.progress span { display:block; height:100%; background:var(--red); border-radius:99px; }.table-wrap { overflow:auto; } table { width:100%; border-collapse:collapse; font-size:.7rem; } th { background:#f2f3ef; color:#68716c; font:500 .62rem 'DM Mono'; text-transform:uppercase; text-align:left; padding:.7rem; } td { padding:.75rem; border-bottom:1px solid var(--line); color:var(--muted); } td:first-child { color:var(--ink); font-weight:600; }.activity-card ul { list-style:none; padding:0; margin:0; }.activity-card li { display:flex; align-items:center; gap:.7rem; padding:.75rem 0; border-bottom:1px solid var(--line); }.activity-icon { width:28px; height:28px; display:grid; place-items:center; border-radius:7px; background:#ffe8e8; color:var(--red); }.activity-card li div { min-width:0; flex:1; }.activity-card li strong,.activity-card li small { display:block; }.activity-card li strong { font-size:.75rem; }.activity-card li small { color:var(--muted); font-size:.65rem; margin-top:.2rem; }.activity-card li>b { font-size:.7rem; color:var(--red); }.link-button { border:0; background:none; color:var(--red); cursor:pointer; font-size:.7rem; font-weight:700; }.quick-actions button { width:100%; display:flex; justify-content:space-between; margin-bottom:.55rem; padding:.75rem .8rem; border:1px solid var(--line); border-radius:7px; background:#fff; color:var(--ink); font-size:.75rem; cursor:pointer; }.quick-actions button span { color:var(--red); }.toast { position:fixed; right:1.5rem; bottom:1.5rem; z-index:5; background:var(--ink); color:#fff; padding:.8rem 1rem; border-radius:7px; font-size:.75rem; box-shadow:0 8px 20px rgba(0,0,0,.2); }
@media (max-width:900px) { .metric-grid { grid-template-columns:repeat(3,1fr); }.intro-panel { align-items:flex-start; flex-direction:column; }.filters { width:100%; }.filters select { margin-left:auto; }.brief-grid,.lower-grid { grid-template-columns:1fr; } }
.request-list { display:grid; gap:.7rem; }
.request-item { display:flex; align-items:center; justify-content:space-between; gap:.7rem; padding:.75rem .8rem; border:1px solid var(--line); border-radius:10px; background:#fbfcfa; }
.request-item strong { display:block; font-size:.78rem; }
.request-item small { display:block; color:var(--muted); margin-top:.2rem; font-size:.62rem; }
.request-item b { font-size:.7rem; color:var(--red); }
.stock-card { margin-top:1rem; }
.stock-layout { display:grid; grid-template-columns:320px 1fr; gap:1rem; }
.stock-form { display:grid; gap:.85rem; padding:1rem; border:1px solid var(--line); border-radius:14px; background:#fafcfb; }
.stock-form h3 { margin:0; font-size:.95rem; }
.stock-form-row { display:grid; grid-template-columns:1fr 1fr; gap:.7rem; }
.stock-form label { display:grid; gap:.4rem; color:var(--muted); font:500 .65rem 'DM Mono'; text-transform:uppercase; }
.stock-form input,.stock-form textarea,.stock-form select,.stock-table input { width:100%; box-sizing:border-box; border:1px solid var(--line); border-radius:8px; padding:.65rem .7rem; font:500 .75rem 'Manrope'; background:#fff; color:var(--ink); }
.stock-form textarea { resize:vertical; min-height:70px; }
.stock-submit { width:100%; margin-top:.2rem; }
.stock-table-wrap { overflow:auto; }
.stock-table { width:100%; min-width:560px; border-collapse:collapse; }
.stock-table th,.stock-table td { text-align:left; padding:.8rem .6rem; border-bottom:1px solid var(--line); font-size:.72rem; }
.stock-table th { color:var(--muted); font:500 .62rem 'DM Mono'; letter-spacing:.1em; text-transform:uppercase; }
.stock-table strong { display:block; font-size:.78rem; }
.stock-toggle { border:0; border-radius:999px; padding:.42rem .7rem; font:700 .62rem 'Manrope'; cursor:pointer; background:#d9f7e7; color:#1d9e5e; }
.stock-toggle.out { background:#ffe1e1; color:var(--red); }
.table-action.danger { color:var(--red); }
@media (max-width:650px) { .admin-sidebar { width:76px; flex-basis:76px; }.admin-sidebar .brand-block { padding-inline:1.25rem; }.admin-sidebar .collapse-button { display:none; }.admin-sidebar .nav-label,.admin-sidebar .nav-item b,.admin-sidebar .nav-item i,.admin-sidebar .admin-profile { display:none; }.admin-nav { padding-inline:.8rem; }.nav-item { justify-content:center; }.topbar { justify-content:flex-start; padding-left:1rem; gap:.75rem; }.mobile-menu { display:block; border:1px solid var(--line); background:#fff; border-radius:7px; padding:.4rem .55rem; }.top-actions { right:.8rem; gap:.35rem; }.status-pill,.icon-button { display:none; }.signout { padding:.45rem .55rem; }.dashboard-body { padding:.9rem; }.metric-grid { grid-template-columns:repeat(2,1fr); }.metric-card { min-height:95px; }.brief-grid { margin-top:.75rem; }.intro-panel { padding:1rem; }.filters button { padding:.5rem .65rem; }.filters select { width:100%; margin-left:0; }.stock-layout { grid-template-columns:1fr; }.toast { right:.8rem; bottom:.8rem; left:.8rem; text-align:center; } }
</style>
