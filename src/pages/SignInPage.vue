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

input {
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
