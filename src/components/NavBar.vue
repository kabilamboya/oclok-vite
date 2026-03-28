<template>
  <header class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo">
        <img
          src="/images/oclokLogo.png"
          alt="Oclok Logo"
          loading="lazy"
        />
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
          <router-link :to="{ name: 'Technicians' }" @click="closeMenu">Technicians</router-link>
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
        <div class="cart-wrap">
          <div class="cart-icon" :class="{ pulse: cartPulse }" @click="openCart">
            🛒
            <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
            <span
              v-if="showCartToast"
              class="cart-toast"
              role="status"
              aria-live="polite"
            >
              {{ cartToastMessage }}
            </span>
          </div>
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
      isMenuOpen: false,
      showCartToast: false,
      cartToastMessage: "",
      cartPulse: false,
      toastTimer: null
    };
  },
  mounted() {
    if (typeof window === "undefined") return;
    window.addEventListener("cart:notify", this.handleCartNotify);
  },
  beforeUnmount() {
    if (typeof window === "undefined") return;
    window.removeEventListener("cart:notify", this.handleCartNotify);
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
  },
  methods: {
    handleCartNotify(event) {
      const message = event?.detail?.message || "Added to cart";
      this.showToast(message);
    },
    showToast(message) {
      this.cartToastMessage = message;
      this.showCartToast = true;
      this.cartPulse = true;

      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        this.showCartToast = false;
        this.cartPulse = false;
      }, 2200);
    },
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
      this.$emit("open-cart");
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
  max-width: 1280px;
  margin: 0 auto;
}

/* =======================
   Logo — NOW PERFECTLY SIDE-BY-SIDE
======================= */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.logo:hover {
  transform: scale(1.03);
}
.logo img {
  height: 42px;
  width: auto;
}
.logo h2 {
  margin: 0;
  font-size: 1.55rem;
  font-weight: 700;
  color: #ff6600;
  white-space: nowrap;
  letter-spacing: -0.5px;
}

/* =======================
   Navigation + Actions (unchanged except small cleanups)
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
  transition: color 0.25s ease;
}
.nav-links a.router-link-active,
.nav-links a.router-link-exact-active {
  color: #6d28d9 !important;
  font-weight: 700;
}
.nav-links a:hover,
.nav-links a:focus {
  color: #6d28d9 !important;
}

/* Search & Cart */
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
.cart-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.cart-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
}
.cart-icon.pulse {
  animation: cartPulse 0.5s ease;
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
.cart-toast {
  position: absolute;
  bottom: calc(100% + 8px);
  right: -6px;
  background: #111827;
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  white-space: nowrap;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 1200;
  transform: translateX(10%);
}

/* Hamburger */
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
    flex-wrap: wrap;
    gap: 10px;
  }
  .nav-search {
    flex: 1 1 100%;
  }
  .nav-search input {
    width: 100%;
  }
  .logo img {
    height: 36px; /* slightly smaller on mobile */
  }
  .logo h2 {
    font-size: 1.4rem;
  }
}

@keyframes cartPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}
</style>
