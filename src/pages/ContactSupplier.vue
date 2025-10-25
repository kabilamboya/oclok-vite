<template>
  <div class="form-page">
    <h1>Contact Supplier</h1>
    <form class="contact-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Your Name</label>
        <input type="text" id="name" v-model="form.name" required />
      </div>

      <div class="form-group">
        <label for="email">Your Email</label>
        <input type="email" id="email" v-model="form.email" required />
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" rows="5" v-model="form.message" required></textarea>
      </div>

      <button type="submit" class="submit-btn">Send Message</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "ContactSupplier",
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: ""
      }
    };
  },
  methods: {
    handleSubmit() {
      alert(`Message sent by ${this.form.name} (${this.form.email}): ${this.form.message}`);
      this.$router.push("/products"); // redirect after sending
    }
  }
};
</script>

<style scoped>
.form-page {
  max-width: 500px;
  margin: 50px auto;
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #222;
}
.contact-form .form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.submit-btn {
  width: 100%;
  background: #ff6600;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}
.submit-btn:hover {
  background: #e65c00;
}
</style>
