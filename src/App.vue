<template>
  <div id="app">
    <!-- NavBar with Cart Button -->
    <NavBar v-if="showShell" :cartCount="cart.length" @open-cart="cartOpen = true" />

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
    <FloatingChatbot v-if="showShell" />
    
    <Footer v-if="showShell" />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import CartModal from "./components/CartModal.vue";
import FloatingChatbot from "./components/FloatingChatbot.vue";
import Footer from "./components/Footer.vue";
import {
  addProductToCart,
  decreaseCartItemQuantity,
  increaseCartItemQuantity,
  notifyCartUpdate,
  persistCart,
  readCart,
  removeCartItem,
} from "./services/cart.service";

export default {
  name: "App",
  components: { NavBar , CartModal , FloatingChatbot, Footer },
  data() {
    return {
      cart: [],
      cartOpen: false
    };
  },
  computed: {
    showShell() {
      return this.$route.name !== "NotFound";
    }
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
      this.cart = readCart();
    },
    notifyCart(message) {
      notifyCartUpdate(message);
    },
    // Add item to cart
    addToCart(product) {
      this.cart = addProductToCart(this.cart, product);
      persistCart(this.cart, `${product?.name || "Item"} added to cart`);
      this.notifyCart(`${product?.name || "Item"} added to cart`);
    },
    // Increase quantity
    increaseQty(id) {
      this.cart = increaseCartItemQuantity(this.cart, id);
      persistCart(this.cart);
      this.notifyCart();
    },
    // Decrease quantity
    decreaseQty(id) {
      this.cart = decreaseCartItemQuantity(this.cart, id);
      persistCart(this.cart);
      this.notifyCart();
    },
    // Remove from cart
    removeFromCart(id) {
      this.cart = removeCartItem(this.cart, id);
      persistCart(this.cart);
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
