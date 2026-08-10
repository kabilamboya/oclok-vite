<template>
  <div class="account-page">
    <section class="account-card">
      <div class="account-intro">
        <p class="eyebrow">{{ hasAccount ? 'Your account' : 'Create account' }}</p>
        <h1>{{ hasAccount ? `Welcome back, ${currentUser?.name || 'friend'}.` : 'Create your O!clok account' }}</h1>
        <p>
          {{ hasAccount
            ? 'Your details are saved for faster bookings, purchases, and updates across the site.'
            : 'Sign up once and unlock faster shopping, tailored service requests, and account access across the site.'
          }}
        </p>
      </div>

      <div v-if="feedback" class="feedback-banner">{{ feedback }}</div>

      <div v-if="hasAccount" class="account-summary">
        <div class="summary-card">
          <h2>Account details</h2>
          <p><strong>Name:</strong> {{ currentUser.name }}</p>
          <p><strong>Email:</strong> {{ currentUser.email }}</p>
          <p><strong>Registered:</strong> {{ formatDate(currentUser.registeredAt) }}</p>
        </div>

        <div class="account-actions">
          <router-link to="/products" class="primary-btn">Continue shopping</router-link>
          <button type="button" class="secondary-btn" @click="handleLogout">Sign out</button>
        </div>
      </div>

      <form v-else class="account-form" @submit.prevent="handleSubmit">
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
      </form>

      <div class="account-benefits">
        <h3>{{ hasAccount ? 'What you can do next' : 'Why create an account?' }}</h3>
        <ul>
          <li>Save your details for faster checkout and bookings.</li>
          <li>Receive tailored product and technician recommendations.</li>
          <li>Keep your account linked across store, media, and services.</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import { registerUser, getRegisteredUser, clearRegisteredUser } from "../services/auth.service";

const emptyForm = () => ({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  accountType: "novice customer",
});

export default {
  name: "CreateAccount",
  data() {
    return {
      form: emptyForm(),
      currentUser: null,
      feedback: "",
      isSubmitting: false,
    };
  },
  computed: {
    hasAccount() {
      return Boolean(this.currentUser);
    },
  },
  mounted() {
    this.currentUser = getRegisteredUser();
  },
  methods: {
    formatDate(value) {
      if (!value) return "Not available";
      try {
        return new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch (_error) {
        return value;
      }
    },
    async handleSubmit() {
      if (this.form.password !== this.form.confirmPassword) {
        this.feedback = "Passwords do not match.";
        return;
      }

      this.isSubmitting = true;
      const user = await registerUser(this.form);

      if (!user) {
        this.feedback = "Please complete your name and email.";
        this.isSubmitting = false;
        return;
      }

      this.currentUser = user;
      this.feedback = `Account created for ${user.name} as a ${user.account_type || this.form.accountType}.`;
      this.form = emptyForm();
      this.isSubmitting = false;
    },
    handleLogout() {
      clearRegisteredUser();
      this.currentUser = null;
      this.feedback = "You have signed out.";
    },
  },
};
</script>

<style scoped>
.account-page {
  min-height: 100vh;
  padding: 40px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
}

.account-card {
  max-width: 720px;
  margin: 0 auto;
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
}

.account-intro h1 {
  margin: 0 0 12px;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  color: #111827;
}

.account-intro p {
  margin: 0;
  color: #475569;
  line-height: 1.7;
}

.eyebrow {
  margin: 0 0 8px;
  color: #f97316;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.feedback-banner {
  margin-top: 20px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #ecfdf3;
  color: #166534;
  font-weight: 600;
}

.account-summary,
.account-form,
.account-benefits {
  margin-top: 24px;
}

.summary-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px;
  background: #f8fafc;
}

.summary-card h2,
.account-benefits h3 {
  margin: 0 0 12px;
  color: #111827;
}

.summary-card p {
  margin: 6px 0;
  color: #334155;
}

.account-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.primary-btn,
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
}

.primary-btn {
  background: #111827;
  color: #fff;
}

.secondary-btn {
  background: #f1f5f9;
  color: #0f172a;
}

.account-form {
  display: grid;
  gap: 14px;
}

.form-group {
  display: grid;
  gap: 6px;
}

label {
  font-weight: 700;
  color: #0f172a;
}

input,
select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font: inherit;
  background: #fff;
}


.account-benefits ul {
  margin: 0;
  padding-left: 18px;
  color: #475569;
  line-height: 1.8;
}

@media (max-width: 768px) {
  .account-card {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .account-page {
    padding: 20px 12px;
  }

  .account-card {
    padding: 20px;
  }
}
</style>
