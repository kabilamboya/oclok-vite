<template>
  <div class="checkout-page">
    <h1>Checkout</h1>
    <div v-if="cart.length === 0">
      <p>Your cart is empty!</p>
      <button @click="$router.push('/products')">Back to Shop</button>
    </div>
    <div v-else>
      <div class="checkout-items" v-for="item in cart" :key="item.id">
        <p>{{ item.name }} x {{ item.quantity }} = Ksh {{ item.price * item.quantity }}</p>
      </div>
      <p class="total">Total: Ksh {{ total }}</p>

      <h2>Payment Details</h2>
      <form @submit.prevent="submitOrder">
        <input type="text" v-model="customer.name" placeholder="Your Name" required />
        <input type="tel" v-model="customer.phone" placeholder="Phone Number" required />
        <input type="email" v-model="customer.email" placeholder="Email" required />
        <button type="submit">Confirm Payment</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ['cart'],
  data() {
    return {
      customer: { name: '', phone: '', email: '' }
    };
  },
  computed: {
    total() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  },
  methods: {
    submitOrder() {
      alert(`Order confirmed for ${this.customer.name}! Total: Ksh ${this.total}`);
      this.$router.push('/products');
    }
  }
};
</script>

<style scoped>
.checkout-page {
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
}

.checkout-items p {
  margin-bottom: 10px;
}

.total {
  font-weight: bold;
  margin: 15px 0;
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
