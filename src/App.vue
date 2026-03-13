<template>
  <div id="app">
    <!-- NavBar with Cart Button -->
    <NavBar :cartCount="cart.length" @open-cart="cartOpen = true" />

    <!-- Router pages render here -->
    <router-view :cart="cart" @add-to-cart="addToCart" />

    <!-- Cart Modal -->
    <CartModal
      :cart="cart"
      :isOpen="cartOpen"
      @close="cartOpen = false"
      @increase="increaseQty"
      @decrease="decreaseQty"
      @remove="removeFromCart"
      @checkout="goToCheckout"
    />
    <FloatingChatbot/>
    
    <Footer />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import CartModal from "./components/CartModal.vue";
import FloatingChatbot from "./components/FloatingChatbot.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: { NavBar , CartModal , FloatingChatbot, Footer },
  data() {
    return {
      cart: [],
      cartOpen: false
    };
  },
  mounted() {
    this.syncCartFromStorage();
    if (typeof window !== "undefined") {
      window.addEventListener("cart:updated", this.syncCartFromStorage);
    }
  },
  beforeUnmount() {
    if (typeof window !== "undefined") {
      window.removeEventListener("cart:updated", this.syncCartFromStorage);
    }
  },
  methods: {
    syncCartFromStorage() {
      if (typeof window === "undefined") return;
      try {
        const stored = JSON.parse(localStorage.getItem("cart") || "[]");
        this.cart = Array.isArray(stored) ? stored : [];
      } catch (_error) {
        this.cart = [];
      }
    },
    notifyCart(message) {
      if (typeof window === "undefined") return;
      window.dispatchEvent(new CustomEvent("cart:updated"));
      if (message) {
        window.dispatchEvent(new CustomEvent("cart:notify", { detail: { message } }));
      }
    },
    // Add item to cart
    addToCart(product) {
      const existing = this.cart.find(p => p.id === product.id);
      if (existing) existing.quantity++;
      else this.cart.push({ ...product, quantity: 1 });
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(this.cart));
      }
      this.notifyCart(`${product?.name || "Item"} added to cart`);
    },
    // Increase quantity
    increaseQty(id) {
      const item = this.cart.find(p => p.id === id);
      if (item) item.quantity++;
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(this.cart));
      }
      this.notifyCart();
    },
    // Decrease quantity
    decreaseQty(id) {
      const item = this.cart.find(p => p.id === id);
      if (item && item.quantity > 1) item.quantity--;
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(this.cart));
      }
      this.notifyCart();
    },
    // Remove from cart
    removeFromCart(id) {
      this.cart = this.cart.filter(p => p.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(this.cart));
      }
      this.notifyCart();
    },
    // Go to checkout page
    goToCheckout() {
      this.cartOpen = false;
      this.$router.push({ name: "Checkout" });
    }
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f5f5f5;
}
.chat-window {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 320px;
  height: 400px;
  background: var(--primary-color, #242424); /* fallback to dark grey */
  color: white;
  border: 2px solid var(--primary-color, #ffcc00);
  
  /* sharp + rounded diagonals */
  border-radius: 0 20px 0 20px;

  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  overflow: hidden;
  z-index: 9999;
}
.chat-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--primary-color, #ffcc00);
  color: white;
  border: none;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  cursor: pointer;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: background 0.3s ease;
}
.chat-toggle:hover {
  background: #e6b800; /* slightly darker shade */
}
</style>
