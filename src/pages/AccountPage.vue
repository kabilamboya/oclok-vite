<template>
  <div class="form-page">
    <h1>Create Account</h1>
    <form class="account-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input type="text" id="name" v-model="form.name" required />
      </div>

      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" v-model="form.email" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="form.password" required />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" v-model="form.confirmPassword" required />
      </div>

      <button type="submit" class="submit-btn">Create Account</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "CreateAccount",
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      }
    };
  },
  methods: {
    handleSubmit() {
      if (this.form.password !== this.form.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      alert(`Account created for ${this.form.name} (${this.form.email})`);
      this.$router.push("/products"); // redirect after creation
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
.account-form .form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input {
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
