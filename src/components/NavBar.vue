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
          <router-link :to="{ name: 'Products' }" class="cta-button" @click="closeMenu">Shop Now</router-link>
          <router-link :to="{ name: 'Technicians' }" class="cta-button" @click="closeMenu">Book a Technician</router-link>
          <router-link :to="{ name: 'Services' }" class="cta-button" @click="closeMenu">Explore Services</router-link>
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
    }
  }
};
</script>

<style scoped>
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
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.logo h2 {
  margin: 0;
  color: #ff6600;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a.router-link-active {
  font-weight: bold;
  color: #ff6600;
}

.nav-links a:hover {
  color: #ff6600;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* Search */
.nav-search {
  display: flex;
  align-items: center;
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
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.nav-search button:hover {
  background: #e55d00;
}

/* Cart Icon */
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
  font-size: 0.8rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 50%;
}

/* Hamburger (mobile) */
.hamburger {
  display: none;
  font-size: 22px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
}

/* Mobile view */
@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    background: #333;
    padding: 15px;
    position: absolute;
    top: 60px;
    left: 0;
  }

  .nav-links.active {
    display: flex;
  }

  .nav-actions {
    width: 100%;
    margin-top: 10px;
    justify-content: space-between;
  }

  .nav-search input {
    flex: 1;
    width: 70%;
  }

.cta-buttons { margin:20px; display:flex; gap:10px; flex-wrap:wrap; }
.cta-buttons button { background:#ff6600; color:white; border:none; padding:10px 18px; border-radius:8px; cursor:pointer; }
.cta-buttons button:hover { background:#cc5200; }
}
</style>