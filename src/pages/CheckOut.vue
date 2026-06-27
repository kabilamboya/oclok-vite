<template>
  <div class="checkout-page">
    <h1>Checkout</h1>

    <div v-if="cartItems.length === 0">
      <p>Your cart is empty!</p>
      <button @click="$router.push('/products')">Back to Shop</button>
    </div>

    <div v-else>
      <div class="checkout-items" v-for="item in cartItems" :key="item.id">
        <div class="item-preview">
          <img :src="item.thumbnail || item.image" alt="Product Image" />
        </div>

        <div class="item-details">
          <h3>{{ item.title || item.name }}</h3>
          <p>
            Ksh {{ formatMoney(item.price) }} × {{ item.quantity || 0 }} =
            <strong>Ksh {{ formatMoney(lineTotal(item)) }}</strong>
          </p>

          <p v-if="item.file">PDF Document</p>
          <p v-if="item.isMockup">Custom Mockup</p>
        </div>
      </div>

      <p class="total">Total: Ksh {{ formatMoney(total) }}</p>

      <h2>Payment Details</h2>

      <form @submit.prevent="submitOrder">
        <input v-model="customer.name" type="text" placeholder="Your Name" required />
        <input v-model="customer.phone" type="tel" placeholder="Phone Number" required />
        <input v-model="customer.email" type="email" placeholder="Email" required />

        <button type="submit">Confirm Payment</button>
      </form>
    </div>
  </div>
</template>

<script>
import { readCart, persistCart } from "../services/cart.service";

export default {
  data() {
    return {
      customer: { name: "", phone: "", email: "" },
      cartItems: [],
    };
  },

  computed: {
    total() {
      return this.cartItems.reduce((sum, item) => {
        const price = Number(item?.price) || 0;
        const qty = Number(item?.quantity) || 0;
        return sum + price * qty;
      }, 0);
    },
  },

  methods: {
    syncCartFromStorage() {
      this.cartItems = readCart();
    },
    lineTotal(item) {
      const price = Number(item?.price) || 0;
      const qty = Number(item?.quantity) || 0;
      return price * qty;
    },
    formatMoney(value) {
      const numeric = Number(value) || 0;
      return numeric.toLocaleString();
    },
    submitOrder() {
      // Clear cart
      persistCart([], `Order confirmed for ${this.customer.name}`);
      this.cartItems = [];

      // Redirect user
      this.$router.push("/products");
    },
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
};
</script>

<style scoped>
.checkout-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  color: var(--text);
}

.checkout-items {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  background: var(--surface);
  padding: 12px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.item-preview img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.item-details h3 {
  margin: 0 0 6px 0;
}

.total {
  font-weight: bold;
  margin: 20px 0;
}

form input {
  display: block;
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

form button {
  background: var(--color-primary);
  color: var(--text-dark);
  border: none;
  padding: 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
}

@media (max-width: 768px) {
  .checkout-page {
    margin: 20px auto;
    padding: 16px;
  }

  .checkout-items {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-preview img {
    width: 100%;
    max-width: 200px;
    height: auto;
  }
}

@media (max-width: 480px) {
  .checkout-page {
    padding: 12px;
  }

  form button {
    width: 100%;
  }
}
</style>
