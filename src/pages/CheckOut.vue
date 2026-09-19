<template>
  <div class="checkout-page">
    <h1>Checkout</h1>

    <div v-if="cartItems.length === 0">
      <p>Your cart is empty!</p>
      <div class="checkout-account-cta">
        <p>Need an account to save your order details and track future purchases?</p>
        <button type="button" @click="$router.push('/signup')">Create Account</button>
      </div>
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

      <div class="checkout-account-cta">
        <p>Save your checkout details and manage future purchases with an O!clok account.</p>
        <button type="button" @click="$router.push('/signup')">Create Account</button>
      </div>

      <h2>Payment Details</h2>

      <form @submit.prevent="submitOrder">
        <input v-model="customer.name" type="text" placeholder="Your Name" required />
        <input v-model="customer.phone" type="tel" placeholder="Phone Number" required />
        <input v-model="customer.email" type="email" placeholder="Email" required />

        <div class="payment-methods" aria-label="Payment method selector">
          <label class="payment-option">
            <input v-model="paymentMethod" type="radio" name="paymentMethod" value="card" />
            <span>Card</span>
          </label>
          <label class="payment-option">
            <input v-model="paymentMethod" type="radio" name="paymentMethod" value="mpesa" />
            <span>Mpesa</span>
          </label>
          <label class="payment-option">
            <input v-model="paymentMethod" type="radio" name="paymentMethod" value="bank" />
            <span>Bank Transfer</span>
          </label>
        </div>

        <div v-if="paymentMethod === 'mpesa'" class="mpesa-field">
          <label for="mpesaNumber">Mpesa Number</label>
          <input
            id="mpesaNumber"
            v-model="customer.mpesaNumber"
            type="tel"
            placeholder="e.g. 0712345678"
            :required="paymentMethod === 'mpesa'"
          />
          <small>Enter the number you will use to approve the MPesa payment prompt.</small>
        </div>

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
      customer: { name: "", phone: "", email: "", mpesaNumber: "" },
      paymentMethod: "card",
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
    isValidMpesaNumber(number) {
      const normalized = String(number).trim();
      return /^(\+?254|0)?[17]\d{8}$/.test(normalized);
    },
    submitOrder() {
      if (this.paymentMethod === "mpesa") {
        if (!this.customer.mpesaNumber || !this.isValidMpesaNumber(this.customer.mpesaNumber)) {
          alert("Please provide a valid MPesa number before confirming payment.");
          return;
        }
      }

      persistCart([], `Order confirmed for ${this.customer.name}`);
      this.cartItems = [];
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

.payment-methods {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0;
}

.payment-option {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-alt);
  cursor: pointer;
}

.payment-option input {
  width: auto;
  margin: 0;
}

.mpesa-field {
  margin-bottom: 16px;
}

.mpesa-field label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.mpesa-field small {
  display: block;
  margin-top: -8px;
  color: var(--text-muted, #8a8a8a);
}

.checkout-account-cta {
  margin: 18px 0 24px;
  padding: 16px 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-alt);
}

.checkout-account-cta p {
  margin: 0 0 12px;
  color: var(--text);
}

form button,
.checkout-account-cta button {
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
