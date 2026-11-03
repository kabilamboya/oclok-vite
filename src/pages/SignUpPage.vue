<template>
  <div class="auth-page">
    <section class="auth-card">
      <div class="auth-copy">
        <p class="eyebrow">Create account</p>
        <h1>Join O!clok as a customer or service partner</h1>
        <p>Create a profile for standard website access or sign up as a technician or deliboi for edit access.</p>

        <ul class="benefits-list">
          <li>Novice customers access the website and services</li>
          <li>Technicians can update profile and task details</li>
          <li>Delibois can manage delivery and account updates</li>
        </ul>
      </div>

      <div class="auth-panel">
        <div v-if="feedback" class="feedback-banner">{{ feedback }}</div>

        <form class="account-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input id="name" v-model="form.name" type="text" required />
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input id="email" v-model="form.email" type="email" required />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" v-model="form.password" type="password" required />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" v-model="form.confirmPassword" type="password" required />
          </div>

          <div class="form-group">
            <label for="accountType">Register as</label>
            <select id="accountType" v-model="form.accountType" required>
              <option value="novice customer">Novice Customer</option>
              <option value="technician">Technician</option>
              <option value="deliboi">Deliboi</option>
            </select>
          </div>

          <button type="submit" class="primary-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating...' : 'Create Account' }}
          </button>

          <button type="button" class="secondary-btn alt" @click="goToSignIn">
            Already have an account? Sign in
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import { registerUser } from '../services/auth.service';

const emptyForm = () => ({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  accountType: 'novice customer'
});

export default {
  name: 'SignUpPage',
  data() {
    return {
      form: emptyForm(),
      feedback: '',
      isSubmitting: false,
    };
  },
  methods: {
    async handleSubmit() {
      if (this.form.password !== this.form.confirmPassword) {
        this.feedback = 'Passwords do not match.';
        return;
      }

      this.isSubmitting = true;
      const user = await registerUser(this.form);
      this.isSubmitting = false;

      if (!user) {
        this.feedback = 'Please complete your name and email.';
        return;
      }

      this.feedback = '';
      this.form = emptyForm();
      this.$router.push('/account');
    },
    goToSignIn() {
      this.$router.push('/signin');
    }
  }
};
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 90px);
  display: grid;
  place-items: center;
  padding: 40px 16px;
  background: #f8f8f8;
}

.auth-card {
  max-width: 980px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 24px;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
  padding: 32px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
}

.eyebrow {
  margin: 0 0 10px;
  color: #ff7a00;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.auth-copy h1 {
  margin: 0 0 12px;
  color: #1f2937;
  font-size: clamp(2rem, 4vw, 2.9rem);
}

.auth-copy p {
  margin: 0;
  line-height: 1.7;
  color: #4b5563;
}

.benefits-list {
  margin: 22px 0 0;
  padding-left: 18px;
  color: #4b5563;
  line-height: 2;
}

.benefits-list li::marker {
  color: #0f9d8a;
}

.auth-panel {
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: #f5f7f8;
  padding: 22px;
}

.account-form {
  display: grid;
  gap: 14px;
}

.form-group {
  display: grid;
  gap: 8px;
}

label {
  font-weight: 700;
  color: #111827;
}

input,
select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font: inherit;
  background: #ffffff;
  color: #111111;
}

input:focus,
select:focus {
  outline: none;
  border-color: #0f9d8a;
  box-shadow: 0 0 0 3px rgba(15, 157, 138, 0.12);
}

.feedback-banner {
  margin-bottom: 16px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fff3e8;
  border: 1px solid #ffd8b5;
  color: #8a4300;
  font-weight: 600;
}

.primary-btn,
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  border: none;
}

.primary-btn {
  background: #ff7a00;
  color: #ffffff;
}

.secondary-btn {
  background: #0f9d8a;
  color: #ffffff;
}

.secondary-btn.alt {
  background: #6d28d9;
  color: #ffffff;
}

@media (max-width: 820px) {
  .auth-card {
    grid-template-columns: 1fr;
  }
}
</style>
