<template>
  <header class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo">
        <img
          src="/images/oclokLogo.png"
          alt="Oclok Logo"
        >
        <div class="brand">
        
        <span>Technology . Media . E-Commerce </span>
      </div>
      </div>

      <!-- Hamburger button (mobile) -->
      <button class="hamburger" @click="toggleMenu" :aria-expanded="isMenuOpen" aria-label="Toggle navigation menu">☰</button>

      <div v-if="isMenuOpen" class="mobile-overlay" @click="closeMenu"></div>

      <!-- Navigation Links -->
      <div class="cta-buttons">
        <nav :class="['nav-links', { active: isMenuOpen }]" role="navigation" aria-label="Main Navigation">
          <button class="drawer-close" @click="closeMenu" aria-label="Close navigation menu">×</button>
          <router-link :to="{ name: 'Home' }" @click="closeMenu">Home</router-link>
          <router-link :to="{ name: 'Products' }" @click="closeMenu">Store</router-link>
          <router-link :to="{ name: 'Media' }" @click="closeMenu">Media</router-link>
          <router-link :to="{ name: 'Technicians' }" @click="closeMenu">Technicians</router-link>
          <router-link :to="{ name: 'Robots' }" @click="closeMenu">Dynamics</router-link>
          <router-link :to="{ name: 'Cyber' }" @click="closeMenu">Cyber</router-link>
          <router-link :to="{ name: 'Discover' }" @click="closeMenu">Discover</router-link>
        </nav>
      </div>

      <!-- Cart -->
      <div class="nav-actions">
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
/* ===========================
   NAVBAR
=========================== */

.navbar{
    position:sticky;
    top:0;
    z-index:9999;

    backdrop-filter:blur(18px);

    background:var(--bg-dark);

    border-bottom:1px solid var(--border-dark);

    transition:.35s ease;
}

.navbar-container{

    max-width:1200px;

    margin:auto;

    padding:16px 24px;

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:30px;

}

/* LOGO */

.logo{

display:flex;

align-items:center;

gap:14px;

cursor:pointer;

transition:.3s;

}

.brand{
    display:flex;
    flex-direction:column;
}

.brand span{
    color:var(--text-muted-dark);
    font-size:.75rem;
    letter-spacing:.08em;
    text-transform:uppercase;
}

.logo:hover{

transform:scale(1.03);

}

.logo img{

width:52px;

height:52px;

object-fit:contain;

}

.logo h2{

margin:0;

font-size:1.7rem;

font-weight:800;

color:var(--color-primary);

}

/* NAVIGATION */

.cta-buttons{

flex:1;

display:flex;

justify-content:center;

}

.nav-links{

display:flex;

gap:26px;

align-items:center;

}

.nav-links a{

text-decoration:none;

color:var(--text-dark);

font-weight:600;

font-size:.96rem;

transition:.3s;

position:relative;

}

.nav-links a::after{

content:"";

position:absolute;

left:0;

bottom:-8px;

width:0;

height:2px;

background:var(--color-secondary);

transition:.3s;

}

.nav-links a:hover::after{

width:100%;

}

.nav-links a:hover{

color:#18d5c2;

}

.router-link-active{

color:#ff6b1a!important;

}

.router-link-active::after{

width:100%;

background:#ff6b1a;

}

/* CART */

.nav-actions{

display:flex;

align-items:center;

gap:20px;

}

.cart-wrap{

position:relative;

}

.cart-icon{

width:46px;

height:46px;

display:flex;

justify-content:center;

align-items:center;

border-radius:50%;

background:white;

font-size:1.3rem;

cursor:pointer;

transition:.3s;

box-shadow:0 10px 25px rgba(0,0,0,.15);

}

.cart-icon:hover{

background:#ff6b1a;

color:white;

transform:translateY(-3px);

}

.badge{

position:absolute;

top:-5px;

right:-5px;

background:#18d5c2;

color:white;

width:20px;

height:20px;

display:flex;

justify-content:center;

align-items:center;

border-radius:50%;

font-size:.72rem;

font-weight:bold;

}

.cart-toast{

position:absolute;

top:60px;

right:0;

background:#0f1720;

color:white;

padding:10px 14px;

border-radius:10px;

font-size:.82rem;

white-space:nowrap;

box-shadow:0 15px 35px rgba(0,0,0,.2);

}

/* Hamburger */

.hamburger{

display:none;

background:none;

border:none;

color:white;

font-size:30px;

cursor:pointer;

}

.mobile-overlay{
  position:fixed;
  inset:0;
  background:rgba(2, 6, 23, 0.6);
  backdrop-filter:blur(3px);
  z-index:9998;
}

.drawer-close{
  display:none;
}

/* Mobile */

@media(max-width:900px){

.navbar-container{

flex-wrap:wrap;

padding:14px 18px;

}

.hamburger{

display:block;

margin-left:auto;

}

.cta-buttons{

width:auto;

order:0;

}

.nav-links{
  position:fixed;
  top:0;
  right:0;
  height:100vh;
  width:min(84vw, 320px);
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  gap:18px;
  padding:24px 20px 28px;
  margin-top:0;
  background:linear-gradient(180deg, #171f2b 0%, #101722 100%);
  border-radius:0;
  border-left:1px solid rgba(255,255,255,0.08);
  box-shadow:-12px 0 35px rgba(0,0,0,0.28);
  transform:translateX(100%);
  opacity:0;
  pointer-events:none;
  transition:transform .3s ease, opacity .3s ease;
  z-index:9999;
}

.nav-links.active{
  display:flex;
  transform:translateX(0);
  opacity:1;
  pointer-events:auto;
}

.drawer-close{
  display:inline-flex;
  align-self:flex-end;
  justify-content:center;
  align-items:center;
  width:40px;
  height:40px;
  border:none;
  border-radius:999px;
  background:rgba(255,255,255,0.08);
  color:white;
  font-size:1.4rem;
  cursor:pointer;
}

.nav-links a{
  color:#f8fafc;
  font-size:1rem;
}

.nav-links a::after{
  display:none;
}

.nav-actions{

margin-left:auto;

}

}

@keyframes fadeDown{

from{

opacity:0;

transform:translateY(-15px);

}

to{

opacity:1;

transform:translateY(0);

}

}
</style>
