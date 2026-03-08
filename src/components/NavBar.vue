<template>
  <header class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo">
        <h2>O!clok</h2>
      </div>

      <!-- Hamburger button (mobile) -->
      <button class="hamburger" @click="toggleMenu">☰</button>

      <!-- Navigation Links -->
      <div class="cta-buttons">
        <nav :class="['nav-links', { active: isMenuOpen }]" role="navigation" aria-label="Main Navigation">
          <router-link :to="{ name: 'Home' }" @click="closeMenu">Home</router-link>
          <router-link :to="{ name: 'Products' }" @click="closeMenu">Store</router-link>
          <router-link :to="{ name: 'Media' }" @click="closeMenu">Media</router-link>
          <router-link :to="{ name: 'Technicians' }" @click="closeMenu">Doctor</router-link>
          <router-link :to="{ name: 'Robots' }" @click="closeMenu">Dynamics</router-link>
          <router-link :to="{ name: 'Cyber' }" @click="closeMenu">Cyber</router-link>
          <router-link :to="{ name: 'Discover' }" @click="closeMenu">Discover</router-link>
        </nav>
      </div>

      <!-- Search & Cart -->
      <div class="nav-actions">
        <!-- Search -->
        <div class="nav-search">
          <input
            type="text"
            placeholder="Search..."
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch">🔍</button>
        </div>

        <!-- Cart Icon -->
        <div class="cart-icon" @click="openCart">
          🛒
          <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
        </div>

      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    cartCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      searchQuery: "",
      isMenuOpen: false
    };
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          name: "Search",
          query: { q: this.searchQuery }
        });
        this.searchQuery = "";
      }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    openCart() {
    this.$router.push({ name: "Cart" });
  }
  }
};
</script>

<style scoped>
/* =======================
   Navbar Base
======================= */
.navbar {
  background: #222;
  color: #fff;
  padding: 15px 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* =======================
   Logo
======================= */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 10px;
  background-image: url('/images/oclokBg.jpg');
  background-repeat: repeat-x;
  background-size: auto 100%;
  animation: moveBackground 15s linear infinite;
  cursor: pointer;
}

.logo img {
  height: 40px;
}

.logo h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #ff6600;
  white-space: nowrap;
}

/* =======================
   Navigation
======================= */
.cta-buttons {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.nav-links a {
  text-decoration: none;
  color: #fff !important;
  font-weight: 500;
  background: transparent !important;
  border: none !important;
  transition: color 0.25s ease, font-weight 0.25s ease;
}

.nav-links a.router-link-active,
.nav-links a.router-link-exact-active {
  color: #6d28d9 !important;
  font-weight: 700;
  background: transparent !important;
}

.nav-links a:hover {
  color: #6d28d9 !important;
}

.nav-links a:focus,
.nav-links a:focus-visible {
  color: #6d28d9 !important;
  font-weight: 700;
  background: transparent !important;
  outline: none;
}

/* =======================
   Actions (Search & Cart)
======================= */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-search {
  display: flex;
  gap: 5px;
}

.nav-search input {
  padding: 6px 10px;
  border-radius: 5px;
  border: none;
}

.nav-search button {
  padding: 6px 10px;
  background: #ff6600;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
}

.cart-icon {
  position: relative;
  font-size: 1.5rem;
  cursor: pointer;
}

.cart-icon .badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background: #ff6600;
  color: #fff;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 50%;
}

/* =======================
   Hamburger
======================= */
.hamburger {
  display: none;
  font-size: 22px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
}

/* =======================
   Mobile View
======================= */
@media (max-width: 768px) {
  .navbar-container {
    flex-wrap: wrap;
  }

  .hamburger {
    display: block;
  }

  .cta-buttons {
    width: 100%;
    order: 3;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    width: 100%;
    background: #333;
    padding: 15px;
    border-radius: 10px;
  }

  .nav-links.active {
    display: flex;
  }

  .nav-actions {
    width: 100%;
    order: 2;
    justify-content: space-between;
  }
}

/* =======================
   Animation
======================= */
@keyframes moveBackground {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 300px 0;
  }
}
</style>
