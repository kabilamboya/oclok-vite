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
  background: var(--surface);
  padding: 30px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
h1 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--text);
}
.account-form .form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
.submit-btn {
  width: 100%;
  background: var(--color-primary);
  color: var(--text-dark);
  border: none;
  padding: 12px;
  border-radius: var(--radius-md);
  font-size: 1rem;
  cursor: pointer;
}
.submit-btn:hover {
  background: var(--color-primary-hover);
}

@media (max-width: 768px) {
  .form-page {
    margin: 24px auto;
    padding: 20px;
  }

  h1 {
    font-size: 1.6rem;
  }
}

@media (max-width: 480px) {
  .form-page {
    margin: 16px auto;
    padding: 16px;
  }

  input {
    padding: 9px;
  }
}
</style>
