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
      try {
        const stored = JSON.parse(localStorage.getItem("cart") || "[]");
        this.cartItems = Array.isArray(stored) ? stored : [];
      } catch (_error) {
        this.cartItems = [];
      }
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
      localStorage.removeItem("cart");
      this.cartItems = [];
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart:updated"));
        window.dispatchEvent(
          new CustomEvent("cart:notify", {
            detail: { message: `Order confirmed for ${this.customer.name}` },
          })
        );
      }

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
}

.checkout-items {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
  border-radius: 6px;
  border: 1px solid #ccc;
}

form button {
  background: #ff6600;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
