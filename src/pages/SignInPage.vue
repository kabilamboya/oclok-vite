<template>
  <div class="auth-page">
    <section class="auth-card">
      <div class="auth-copy">
        <p class="eyebrow">Welcome back</p>
        <h1>Sign in to your O!clok account</h1>
        <p>Access your saved services, reviews, and account details from one secure place.</p>

        <ul class="benefits-list">
          <li>Track recent services and requests</li>
          <li>Review ratings and customer feedback</li>
          <li>Manage your personal account details</li>
        </ul>
      </div>

      <div class="auth-panel">
        <form class="account-form" @submit.prevent="handleSignIn">
          <div class="form-group">
            <label for="signin-email">Username or Email</label>
            <input id="signin-email" v-model="form.email" type="text" required placeholder="admin" />
          </div>

          <div class="form-group">
            <label for="signin-password">Password</label>
            <input id="signin-password" v-model="form.password" type="password" required />
          </div>

          <button type="submit" class="primary-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
          </button>

          <button type="button" class="secondary-btn alt" @click="goToSignUp">
            Create account
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import { signInUser, getUserDashboardRoute } from '../services/auth.service';

export default {
  name: 'SignInPage',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      feedback: '',
      isSubmitting: false,
    };
  },
  methods: {
    async handleSignIn() {
      this.isSubmitting = true;
      const user = signInUser(this.form);

      if (!user) {
        this.feedback = 'We could not find that account. Please sign up or check your credentials.';
        this.isSubmitting = false;
        return;
      }

      this.form = { email: '', password: '' };
      this.feedback = '';

      this.$router.push(getUserDashboardRoute(user.account_type));
      this.isSubmitting = false;
    },
    goToSignUp() {
      this.$router.push('/signup');
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

input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font: inherit;
  background: #ffffff;
  color: #111111;
}

input:focus {
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
