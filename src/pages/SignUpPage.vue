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
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
}

.auth-card {
  max-width: 980px;
  width: 100%;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
  padding: 32px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
}

.eyebrow {
  margin: 0 0 10px;
  color: #f97316;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.auth-copy h1 {
  margin: 0 0 12px;
  color: #111827;
  font-size: clamp(2rem, 4vw, 2.9rem);
}

.auth-copy p {
  margin: 0;
  line-height: 1.7;
  color: #475569;
}

.benefits-list {
  margin: 22px 0 0;
  padding-left: 18px;
  color: #475569;
  line-height: 2;
}

.auth-panel {
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #f8fafc;
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
  color: #0f172a;
}

input,
select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font: inherit;
  background: #fff;
}

.feedback-banner {
  margin-bottom: 16px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fef2f2;
  color: #991b1b;
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
  background: #111827;
  color: #fff;
}

.secondary-btn {
  background: #f1f5f9;
  color: #0f172a;
}

.secondary-btn.alt {
  background: transparent;
  border: 1px solid #111827;
}

@media (max-width: 820px) {
  .auth-card {
    grid-template-columns: 1fr;
  }
}
</style>
