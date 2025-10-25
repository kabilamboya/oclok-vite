<template>
  <div class="cart-overlay" v-if="isOpen">
    <div class="cart-modal">
      <h2>Your Cart</h2>
      <button class="close-btn" @click="$emit('close')">✕</button>

      <div v-if="cart.length === 0" class="empty">
        <p>Your cart is empty.</p>
      </div>

      <div v-else class="cart-items">
        <div class="cart-item" v-for="item in cart" :key="item.id">
          <img :src="item.image" alt="item.name" />
          <div class="details">
            <h3>{{ item.name }}</h3>
            <p>Ksh {{ item.price }} x {{ item.quantity }}</p>
            <div class="actions">
              <button @click="$emit('decrease', item.id)">−</button>
              <button @click="$emit('increase', item.id)">+</button>
              <button @click="$emit('remove', item.id)">Remove</button>
            </div>
          </div>
        </div>
        <div class="total">
          <p>Total: Ksh {{ total }}</p>
        </div>
        <button class="checkout-btn" @click="$emit('checkout')">Checkout</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['cart', 'isOpen'],
  computed: {
    total() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  }
}
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.cart-modal {
  background: #fff;
  width: 90%;
  max-width: 500px;
  padding: 25px;
  border-radius: 12px;
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.cart-item {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  align-items: center;
}

.cart-item img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.details h3 {
  margin: 0 0 5px 0;
}

.actions button {
  margin-right: 5px;
  padding: 4px 8px;
  cursor: pointer;
}

.total {
  font-weight: bold;
  margin-top: 15px;
}

.checkout-btn {
  margin-top: 15px;
  width: 100%;
  padding: 12px;
  background: #ff6600;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
