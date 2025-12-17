<template>
  <div class="checkout-page">
    <h1>Checkout</h1>

    <div v-if="cart.length === 0">
      <p>Your cart is empty!</p>
      <button @click="$router.push('/products')">Back to Shop</button>
    </div>

    <div v-else>
      <div class="checkout-items" v-for="item in cart" :key="item.id">
        <div class="item-preview">
          <img :src="item.thumbnail || item.image" alt="Product Image" />
        </div>

        <div class="item-details">
          <h3>{{ item.title || item.name }}</h3>
          <p>
            Ksh {{ item.price }} × {{ item.quantity }} =
            <strong>Ksh {{ item.price * item.quantity }}</strong>
          </p>

          <p v-if="item.file">PDF Document</p>
          <p v-if="item.isMockup">Custom Mockup</p>
        </div>
      </div>

      <p class="total">Total: Ksh {{ total }}</p>

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
  props: ["cart"],

  data() {
    return {
      customer: { name: "", phone: "", email: "" },
    };
  },

  computed: {
    total() {
      return this.cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
  },

  methods: {
    submitOrder() {
      alert(`Order confirmed for ${this.customer.name}! Total: Ksh ${this.total}`);

      // Clear cart
      localStorage.removeItem("cart");

      // Redirect user
      this.$router.push("/products");
    },
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