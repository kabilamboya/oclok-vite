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
        <button class="nav-item" :class="{ active: activeSection === 'dashboard' }" type="button" @click="activeSection = 'dashboard'"><span>▥</span><b v-if="!sidebarCollapsed">Dashboard</b></button>
        <p v-if="!sidebarCollapsed" class="nav-label">Operations</p>
        <button class="nav-item" type="button" @click="showNotice('Messages are ready for the next admin module.')"><span>□</span><b v-if="!sidebarCollapsed">Messages</b><i v-if="!sidebarCollapsed">{{ unreadMessages }}</i></button>
        <button class="nav-item" type="button" @click="showNotice('Workshop management is ready for connection.')"><span>▧</span><b v-if="!sidebarCollapsed">Workshop</b></button>
        <button class="nav-item" type="button" @click="showNotice('Records management is ready for connection.')"><span>▤</span><b v-if="!sidebarCollapsed">Records</b></button>
        <button class="nav-item" type="button" @click="showNotice('Reports will be connected to analytics data.')"><span>◫</span><b v-if="!sidebarCollapsed">Reports</b></button>
        <button class="nav-item" type="button" @click="showNotice('Stock management is ready for connection.')"><span>▱</span><b v-if="!sidebarCollapsed">Stock</b></button>
        <p v-if="!sidebarCollapsed" class="nav-label">Team</p>
        <button class="nav-item" :class="{ active: activeSection === 'users' }" type="button" @click="activeSection = 'users'"><span>♙</span><b v-if="!sidebarCollapsed">Team Access</b></button>
      </nav>
      <div v-if="!sidebarCollapsed" class="admin-profile"><div class="avatar">C</div><div><strong>Cornel Odera</strong><small>Manager</small></div><span>•••</span></div>
    </aside>

    <section class="admin-content">
      <header class="topbar"><button class="mobile-menu" type="button" aria-label="Toggle sidebar" @click="sidebarCollapsed = !sidebarCollapsed">☰</button><strong>Dashboard</strong><div class="top-actions"><span class="status-pill">CBD</span><button class="icon-button" type="button" aria-label="Notifications" @click="notificationsOpen = !notificationsOpen">♧<em>{{ unreadMessages }}</em></button><button class="signout" type="button" @click="showNotice('Sign out is not connected yet.')">Sign out</button></div></header>

      <div v-if="activeSection === 'dashboard'" class="dashboard-body">
        <section class="intro-panel"><div><h1>Oclok Business Cockpit</h1><p>YEAR TO DATE - 2026</p></div><div class="filters"><button v-for="period in periods" :key="period" type="button" :class="{ selected: selectedPeriod === period }" @click="selectedPeriod = period">{{ period }}</button><select v-model="selectedShop" aria-label="Select shop"><option>All Shops</option><option>Oclok Store</option><option>Oclok Cyber</option><option>Oclok Media</option></select></div></section>
        <div v-if="notificationsOpen" class="notification-panel"><strong>Notifications</strong><p>3 new orders require review.</p><p>Technician profile activity increased this week.</p></div>

        <section class="brief-grid"><article class="brief-card"><p>General remarks</p><h2>{{ selectedPeriod }} business summary</h2><span>{{ summaryText }}</span></article><article class="brief-card watchlist"><p>Watchlist</p><h2>Monitor stock, orders, and shop contribution.</h2><span>{{ productCount }} products across the current catalogue.</span></article></section>

        <section class="metric-grid"><article v-for="metric in metrics" :key="metric.label" class="metric-card"><div class="metric-heading"><span>{{ metric.label }}</span><b :class="metric.tone">{{ metric.icon }}</b></div><strong>{{ metric.value }}</strong><small>{{ metric.note }}</small></article></section>

        <section class="lower-grid"><article class="dashboard-card shop-performance"><div class="card-heading"><div><p>Shop performance</p><h2>Contribution by channel</h2></div><span>{{ selectedPeriod }}</span></div><div v-for="shop in shopPerformance" :key="shop.name" class="shop-row"><div><strong>{{ shop.name }}</strong><small>{{ shop.orders }} transactions</small></div><b>{{ shop.share }}%</b><div class="progress"><span :style="{ width: `${shop.share}%` }"></span></div></div></article><article class="dashboard-card"><div class="card-heading"><div><p>Revenue by category</p><h2>Category activity</h2></div><select aria-label="Filter categories"><option>All Categories</option><option>Smart Home</option><option>Services</option></select></div><div class="table-wrap"><table><thead><tr><th>Category</th><th>Revenue</th><th>Txns</th><th>Share</th></tr></thead><tbody><tr v-for="category in categories" :key="category.name"><td>{{ category.name }}</td><td>{{ category.revenue }}</td><td>{{ category.transactions }}</td><td>{{ category.share }}</td></tr></tbody></table></div></article></section>

        <section class="lower-grid"><article class="dashboard-card activity-card"><div class="card-heading"><div><p>Recent activity</p><h2>What needs attention</h2></div><button class="link-button" type="button" @click="showNotice('All activity view is coming next.')">View all</button></div><ul><li v-for="activity in activities" :key="activity.title"><span class="activity-icon">{{ activity.icon }}</span><div><strong>{{ activity.title }}</strong><small>{{ activity.meta }}</small></div><b>{{ activity.value }}</b></li></ul></article><article class="dashboard-card quick-actions"><div class="card-heading"><div><p>Quick actions</p><h2>Keep work moving</h2></div></div><button type="button" @click="showNotice('New record workflow selected.')">+ Add record <span>→</span></button><button type="button" @click="showNotice('Report export is ready for connection.')">↓ Export report <span>→</span></button><button type="button" @click="showNotice('Team access workflow selected.')">♙ Manage team <span>→</span></button></article></section>
      </div>
      <section v-else class="user-management dashboard-body">
        <section class="intro-panel"><div><h1>Team Access</h1><p>{{ users.length }} registered technicians</p></div><button class="primary-action" type="button" @click="showNotice('All technicians are already registered from the technician directory.')">+ Add User</button></section>
        <section class="user-summary-grid"><article class="user-summary"><span>Registered users</span><strong>{{ users.length }}</strong><small>All technician profiles</small></article><article class="user-summary"><span>Active users</span><strong>{{ activeUserCount }}</strong><small>Can access the platform</small></article><article class="user-summary"><span>Pending review</span><strong>{{ pendingUserCount }}</strong><small>Require admin attention</small></article></section>
        <section class="dashboard-card users-card"><div class="card-heading users-heading"><div><p>User directory</p><h2>Manage registered users</h2></div><div class="user-filters"><input v-model="userSearch" type="search" placeholder="Search users..." aria-label="Search users" /><select v-model="userStatusFilter" aria-label="Filter by status"><option value="all">All statuses</option><option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option></select></div></div><div class="users-table-wrap"><table class="users-table"><thead><tr><th>User</th><th>Role</th><th>Location</th><th>Status</th><th>Edit permission</th><th>Actions</th></tr></thead><tbody><tr v-for="user in filteredUsers" :key="user.id"><td><div class="user-cell"><span class="user-initial">{{ user.initial }}</span><div><strong>{{ user.name }}</strong><small>{{ user.email }}</small></div></div></td><td><span class="role-badge">{{ user.role }}</span></td><td>{{ user.location }}</td><td><span class="status-badge" :class="user.status">{{ user.status }}</span></td><td><button class="permission-button" type="button" :class="{ granted: user.canEditDetails }" @click="toggleEditPermission(user)">{{ user.canEditDetails ? 'Allowed' : 'Blocked' }}</button></td><td class="user-actions"><button class="table-action" type="button" :disabled="!user.canEditDetails" @click="openUserEditor(user)">Edit details</button><button class="table-action" type="button" @click="toggleUserStatus(user)">{{ user.status === 'active' ? 'Suspend' : 'Activate' }}</button></td></tr><tr v-if="filteredUsers.length === 0"><td colspan="6" class="empty-users">No users match your filters.</td></tr></tbody></table></div></section>
      </section>
      <div v-if="editingUser" class="editor-overlay" @click.self="closeUserEditor"><form class="profile-editor" @submit.prevent="saveUserDetails"><div class="editor-header"><div><p>Edit permissioned profile</p><h2>{{ editingUser.name }}</h2></div><button type="button" class="editor-close" aria-label="Close editor" @click="closeUserEditor">&times;</button></div><label>Name<input v-model="editForm.name" required /></label><label>Specialty<input v-model="editForm.specialty" required /></label><label>Bio<textarea v-model="editForm.bio" rows="4" required></textarea></label><div class="editor-fields"><label>Email<input v-model="editForm.email" type="email" required /></label><label>Phone<input v-model="editForm.phone" type="tel" /></label></div><label>Location<input v-model="editForm.location" required /></label><div class="editor-actions"><button type="button" class="secondary-action" @click="closeUserEditor">Cancel</button><button type="submit" class="primary-action">Save details</button></div></form></div>
      <p v-if="notice" class="toast" role="status">{{ notice }}</p>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';
import products from '../data/products.json';
import technicians from '../data/technicians.json';
import { readStore, writeStore } from '../lib/localStore';
import { saveProfileOverride } from '../services/userProfiles.service';

const sidebarCollapsed = ref(false);
const activeSection = ref('dashboard');
const notificationsOpen = ref(false);
const selectedPeriod = ref('YTD');
const selectedShop = ref('All Shops');
const notice = ref('');
const userSearch = ref('');
const userStatusFilter = ref('all');
const editingUser = ref(null);
const editForm = ref({});
const periods = ['YTD', 'This Month', 'This Week', 'All Time'];
const productCount = products.length;
const technicianCount = technicians.length;
const unreadMessages = 3;
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
    specialty: user.specialty || source.specialty || 'Technician',
    bio: user.bio || source.bio || '',
    phone: user.phone || source.contact?.phone || '',
    canEditDetails: user.canEditDetails !== false,
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
const metrics = computed(() => [
  { label: 'Revenue collected', value: 'KES 248K', note: 'KES paid to date', icon: '$', tone: 'green' },
  { label: 'Total invoiced', value: 'KES 412K', note: `${productCount} product lines tracked`, icon: '▣', tone: 'blue' },
  { label: 'Outstanding credit', value: 'KES 64K', note: 'Balances requiring review', icon: '!', tone: 'red' },
  { label: 'Operating costs', value: 'KES 88K', note: 'Direct + overhead', icon: '□', tone: 'orange' },
  { label: 'Operating profit', value: 'KES 160K', note: 'After all overheads', icon: '◉', tone: 'neutral' },
  { label: 'Transactions', value: '1,284', note: 'Total sales count', icon: '⌁', tone: 'purple' },
  { label: 'Technicians', value: technicianCount, note: 'Profiles in network', icon: '♙', tone: 'teal' },
  { label: 'Active products', value: productCount, note: 'Current catalogue', icon: '▱', tone: 'yellow' },
]);
const shopPerformance = [
  { name: 'Oclok Store', orders: 642, share: 78 },
  { name: 'Oclok Cyber', orders: 388, share: 56 },
  { name: 'Oclok Media', orders: 254, share: 34 },
];
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
const summaryText = computed(() => selectedShop.value === 'All Shops' ? 'Loading business performance summary...' : `${selectedShop.value} performance is ready for review.`);
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
const showNotice = (message) => { notice.value = message; window.clearTimeout(showNotice.timer); showNotice.timer = window.setTimeout(() => { notice.value = ''; }, 2800); };
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap');
.admin-shell { --ink:#202523; --muted:#717975; --paper:#f7f8f5; --card:#fff; --line:#e0e4df; --red:#df1f26; --green:#29b66f; min-height:100vh; display:flex; background:var(--paper); color:var(--ink); font-family:'Manrope', Arial, sans-serif; }
.admin-sidebar { width:220px; flex:0 0 220px; position:relative; background:#fff; border-right:1px solid var(--line); transition:width .25s, flex-basis .25s; padding:1.4rem 0; display:flex; flex-direction:column; }
.sidebar-collapsed .admin-sidebar { width:76px; flex-basis:76px; }.brand-block { display:flex; align-items:center; gap:.7rem; padding:0 1.25rem 1.6rem; border-bottom:1px solid var(--line); }.brand-mark { width:30px; height:30px; display:grid; place-items:center; background:var(--red); color:#fff; font-weight:800; font-size:1rem; }.brand-block strong { display:block; letter-spacing:.12em; font-size:.82rem; }.brand-block small,.admin-profile small { display:block; color:var(--muted); font:500 .6rem 'DM Mono'; letter-spacing:.14em; margin-top:.18rem; }.collapse-button { position:absolute; right:-13px; top:1.25rem; width:26px; height:26px; border:1px solid var(--line); border-radius:50%; background:#fff; color:var(--ink); cursor:pointer; }.admin-nav { padding:1.1rem .8rem; }.nav-label { padding:0 .65rem; margin:.9rem 0 .5rem; color:#9aa29c; font:500 .62rem 'DM Mono'; letter-spacing:.14em; text-transform:uppercase; }.nav-item { width:100%; display:flex; align-items:center; gap:.75rem; padding:.75rem .7rem; border:0; border-left:2px solid transparent; background:transparent; color:var(--muted); text-align:left; cursor:pointer; font:500 .78rem 'Manrope'; }.nav-item span { width:22px; text-align:center; font-size:1rem; }.nav-item b { font-weight:600; }.nav-item i { margin-left:auto; font-style:normal; color:var(--red); }.nav-item.active { background:#fff0f0; border-left-color:var(--red); color:var(--red); }.admin-profile { display:flex; align-items:center; gap:.55rem; margin:auto .9rem 0; padding:.7rem; border:1px solid var(--line); background:#f8f8f5; font-size:.7rem; }.admin-profile .avatar { width:29px; height:29px; display:grid; place-items:center; border-radius:50%; background:#ffd8d8; color:var(--red); font-weight:800; }.admin-profile span { margin-left:auto; color:var(--muted); }
.back-website { display:flex; align-items:center; gap:.65rem; margin:1rem .8rem 0; padding:.7rem .65rem; color:var(--ink); text-decoration:none; font-size:.75rem; font-weight:700; border-bottom:1px solid var(--line); }.back-website span { width:22px; text-align:center; font-size:1rem; }.back-website:hover { color:var(--red); }
.admin-content { min-width:0; flex:1; }.topbar { height:64px; display:flex; align-items:center; justify-content:center; position:relative; background:#fff; border-bottom:1px solid var(--line); font-size:.9rem; }.top-actions { position:absolute; right:1.5rem; display:flex; align-items:center; gap:1rem; }.status-pill { border:1px solid #b5e4dc; background:#effbf8; color:#219482; border-radius:999px; padding:.38rem .85rem; font:500 .68rem 'DM Mono'; }.icon-button,.signout { border:1px solid var(--line); background:#fff; color:var(--ink); border-radius:7px; padding:.5rem .75rem; cursor:pointer; position:relative; }.icon-button em { position:absolute; right:-5px; top:-6px; width:15px; height:15px; display:grid; place-items:center; border-radius:50%; background:var(--red); color:#fff; font:500 .55rem Arial; }.signout { font-size:.72rem; }.mobile-menu { display:none; }
.dashboard-body { max-width:1050px; margin:0 auto; padding:1.6rem; }.intro-panel,.brief-card,.dashboard-card,.metric-card { background:var(--card); border:1px solid var(--line); border-radius:var(--radius-md); box-shadow:0 3px 10px rgba(28,37,32,.05); }.intro-panel { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1.25rem 1.5rem; }.intro-panel h1 { margin:0 0 .35rem; font-size:1.3rem; letter-spacing:-.03em; }.intro-panel p,.brief-card>p,.card-heading p { margin:0; color:var(--muted); font:500 .65rem 'DM Mono'; letter-spacing:.1em; text-transform:uppercase; }.filters { display:flex; align-items:center; gap:.5rem; flex-wrap:wrap; }.filters button,.filters select,.card-heading select { border:1px solid var(--line); border-radius:999px; background:#fff; color:var(--muted); padding:.55rem .8rem; font:500 .7rem 'Manrope'; cursor:pointer; }.filters button.selected { background:var(--red); border-color:var(--red); color:#fff; }.filters select,.card-heading select { border-radius:7px; color:var(--ink); }.notification-panel { position:absolute; z-index:3; right:2rem; top:72px; width:250px; padding:1rem; background:#fff; border:1px solid var(--line); box-shadow:0 10px 25px rgba(0,0,0,.12); font-size:.75rem; }.notification-panel p { color:var(--muted); }
.primary-action { border:0; border-radius:7px; background:var(--red); color:#fff; padding:.7rem 1rem; font:700 .75rem 'Manrope'; cursor:pointer; }.user-summary-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.8rem; margin-top:1rem; }.user-summary { display:flex; flex-direction:column; gap:.35rem; padding:1rem 1.15rem; background:var(--card); border:1px solid var(--line); border-radius:var(--radius-md); box-shadow:0 3px 10px rgba(28,37,32,.05); }.user-summary span,.user-summary small { color:var(--muted); font-size:.7rem; }.user-summary strong { font-size:1.5rem; }.users-card { margin-top:1rem; }.users-heading { align-items:center; }.user-filters { display:flex; gap:.5rem; }.user-filters input,.user-filters select { border:1px solid var(--line); border-radius:7px; background:#fff; color:var(--ink); padding:.6rem .7rem; font:500 .72rem 'Manrope'; }.users-table-wrap { overflow-x:auto; }.users-table { min-width:760px; }.user-cell { display:flex; align-items:center; gap:.65rem; }.user-initial { width:30px; height:30px; display:grid; place-items:center; border-radius:50%; background:#ffe1e1; color:var(--red); font-weight:800; }.user-cell strong,.user-cell small { display:block; }.user-cell strong { color:var(--ink); font-size:.75rem; }.user-cell small { margin-top:.2rem; color:var(--muted); font-size:.65rem; }.role-badge,.status-badge { display:inline-block; padding:.32rem .55rem; border-radius:999px; font-size:.65rem; }.role-badge { background:#edf4f1; color:#427167; }.status-badge { text-transform:capitalize; }.status-badge.active { background:#d9f7e7; color:#1d9e5e; }.status-badge.pending { background:#fff0d5; color:#bd7b00; }.status-badge.suspended { background:#ffe1e1; color:var(--red); }.table-action { border:1px solid var(--line); border-radius:6px; background:#fff; color:var(--red); padding:.4rem .55rem; font-size:.65rem; cursor:pointer; }.empty-users { padding:2rem; text-align:center; color:var(--muted); }
.brief-grid { display:grid; grid-template-columns:1.4fr 1fr; gap:1rem; margin-top:1rem; }.brief-card { padding:1.15rem 1.4rem; border-left:3px solid var(--red); }.brief-card h2 { margin:.7rem 0 .4rem; font-size:.95rem; font-weight:600; }.brief-card span { color:var(--muted); font-size:.78rem; }.metric-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:.8rem; margin-top:1rem; }.metric-card { padding:1rem; min-height:105px; border-top:3px solid var(--red); }.metric-heading { display:flex; justify-content:space-between; gap:.5rem; color:var(--muted); font:500 .62rem 'DM Mono'; text-transform:uppercase; }.metric-heading b { width:25px; height:25px; display:grid; place-items:center; border-radius:7px; font:700 .85rem Arial; }.metric-heading .green { background:#d9f7e7; color:#1d9e5e; }.metric-heading .blue { background:#e0f0ff; color:#2587cb; }.metric-heading .red { background:#ffe1e1; color:var(--red); }.metric-heading .orange { background:#fff0d5; color:#e99716; }.metric-heading .purple { background:#f0e2f8; color:#a756c4; }.metric-heading .teal { background:#dbf6f1; color:#168f80; }.metric-heading .yellow { background:#fff4d2; color:#d99c00; }.metric-heading .neutral { background:#f0f1ef; color:#68726d; }.metric-card>strong { display:block; margin:1rem 0 .6rem; font-size:1.05rem; }.metric-card small { color:var(--muted); font-size:.65rem; }.lower-grid { display:grid; grid-template-columns:1fr 1.2fr; gap:1rem; margin-top:1rem; }.dashboard-card { padding:1.15rem 1.25rem; }.card-heading { display:flex; align-items:start; justify-content:space-between; gap:1rem; margin-bottom:1.2rem; }.card-heading h2 { margin:.45rem 0 0; font-size:1rem; }.card-heading>span { color:var(--muted); font:500 .65rem 'DM Mono'; }.shop-row { display:grid; grid-template-columns:1fr auto; gap:.2rem .75rem; margin-bottom:1.15rem; }.shop-row strong { display:block; font-size:.8rem; }.shop-row small { color:var(--muted); font-size:.65rem; }.shop-row>b { grid-column:2; grid-row:1 / span 2; align-self:center; font-size:.8rem; }.progress { grid-column:1 / span 2; height:7px; margin-top:.3rem; background:#e9ebe8; border-radius:99px; overflow:hidden; }.progress span { display:block; height:100%; background:var(--red); border-radius:99px; }.table-wrap { overflow:auto; } table { width:100%; border-collapse:collapse; font-size:.7rem; } th { background:#f2f3ef; color:#68716c; font:500 .62rem 'DM Mono'; text-transform:uppercase; text-align:left; padding:.7rem; } td { padding:.75rem; border-bottom:1px solid var(--line); color:var(--muted); } td:first-child { color:var(--ink); font-weight:600; }.activity-card ul { list-style:none; padding:0; margin:0; }.activity-card li { display:flex; align-items:center; gap:.7rem; padding:.75rem 0; border-bottom:1px solid var(--line); }.activity-icon { width:28px; height:28px; display:grid; place-items:center; border-radius:7px; background:#ffe8e8; color:var(--red); }.activity-card li div { min-width:0; flex:1; }.activity-card li strong,.activity-card li small { display:block; }.activity-card li strong { font-size:.75rem; }.activity-card li small { color:var(--muted); font-size:.65rem; margin-top:.2rem; }.activity-card li>b { font-size:.7rem; color:var(--red); }.link-button { border:0; background:none; color:var(--red); cursor:pointer; font-size:.7rem; font-weight:700; }.quick-actions button { width:100%; display:flex; justify-content:space-between; margin-bottom:.55rem; padding:.75rem .8rem; border:1px solid var(--line); border-radius:7px; background:#fff; color:var(--ink); font-size:.75rem; cursor:pointer; }.quick-actions button span { color:var(--red); }.toast { position:fixed; right:1.5rem; bottom:1.5rem; z-index:5; background:var(--ink); color:#fff; padding:.8rem 1rem; border-radius:7px; font-size:.75rem; box-shadow:0 8px 20px rgba(0,0,0,.2); }
@media (max-width:900px) { .metric-grid { grid-template-columns:repeat(3,1fr); }.intro-panel { align-items:flex-start; flex-direction:column; }.filters { width:100%; }.filters select { margin-left:auto; }.brief-grid,.lower-grid { grid-template-columns:1fr; } }
@media (max-width:650px) { .admin-sidebar { width:76px; flex-basis:76px; }.admin-sidebar .brand-block { padding-inline:1.25rem; }.admin-sidebar .collapse-button { display:none; }.admin-sidebar .nav-label,.admin-sidebar .nav-item b,.admin-sidebar .nav-item i,.admin-sidebar .admin-profile { display:none; }.admin-nav { padding-inline:.8rem; }.nav-item { justify-content:center; }.topbar { justify-content:flex-start; padding-left:1rem; gap:.75rem; }.mobile-menu { display:block; border:1px solid var(--line); background:#fff; border-radius:7px; padding:.4rem .55rem; }.top-actions { right:.8rem; gap:.35rem; }.status-pill,.icon-button { display:none; }.signout { padding:.45rem .55rem; }.dashboard-body { padding:.9rem; }.metric-grid { grid-template-columns:repeat(2,1fr); }.metric-card { min-height:95px; }.brief-grid { margin-top:.75rem; }.intro-panel { padding:1rem; }.filters button { padding:.5rem .65rem; }.filters select { width:100%; margin-left:0; }.toast { right:.8rem; bottom:.8rem; left:.8rem; text-align:center; } }
</style>
