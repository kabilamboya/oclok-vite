<template>
  <div class="account-page">
    <section class="account-card">
      <div class="account-intro">
        <p class="eyebrow">{{ isSignedIn ? 'Your profile' : 'Account access' }}</p>
        <h1>{{ isSignedIn ? `Welcome back, ${currentUser?.name || 'friend'}.` : 'Sign in to view your account' }}</h1>
        <p>
          {{ isSignedIn
            ? 'Review your service history, ratings, and technician task progress from one secure dashboard.'
            : 'Create an account or sign in to access your saved services, reviews, and profile details.'
          }}
        </p>
      </div>

      <div v-if="feedback" class="feedback-banner">{{ feedback }}</div>

      <div v-if="!isSignedIn" class="sign-in-cta-panel">
        <p>Use the dedicated sign-in and sign-up pages to access your account.</p>
        <div class="account-actions">
          <button type="button" class="primary-btn" @click="goToSignIn">Sign In</button>
          <button type="button" class="secondary-btn" @click="goToSignUp">Create Account</button>
        </div>
      </div>

      <div v-else class="profile-layout">
        <div class="profile-header">
          <div>
            <p class="mini-label">Account type</p>
            <h2>{{ currentUser.account_type || 'customer' }}</h2>
            <p class="access-note">{{ canEditDetails ? 'Edit access enabled' : 'Standard website access' }}</p>
          </div>
          <button type="button" class="secondary-btn" @click="handleLogout">Sign out</button>
        </div>

        <template v-if="isTechnician">
          <div class="summary-grid">
            <article class="summary-card accent-tech">
              <p>Open jobs</p>
              <strong>{{ technicianJobs.filter((job) => job.status !== 'Completed').length }}</strong>
              <small>Active client work</small>
            </article>
            <article class="summary-card accent">
              <p>Tasks complete</p>
              <strong>{{ completedTasks }}</strong>
              <small>HR completion tracking</small>
            </article>
            <article class="summary-card accent-alt">
              <p>Average rating</p>
              <strong>4.8★</strong>
              <small>Client satisfaction</small>
            </article>
          </div>

          <div class="profile-panels">
            <article class="data-panel">
              <h3>Assigned client jobs</h3>
              <table>
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Client</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="job in technicianJobs" :key="job.id">
                    <td>{{ job.title }}</td>
                    <td>{{ job.client }}</td>
                    <td><span class="status-badge" :class="job.status.toLowerCase()">{{ job.status }}</span></td>
                  </tr>
                </tbody>
              </table>
            </article>

            <article class="data-panel">
              <h3>Professional notes</h3>
              <ul class="review-list">
                <li v-for="note in technicianNotes" :key="note.id">
                  <div class="review-head">
                    <strong>{{ note.title }}</strong>
                    <span>{{ note.priority }}</span>
                  </div>
                  <p>{{ note.message }}</p>
                </li>
              </ul>
            </article>
          </div>

          <article class="data-panel hr-panel">
            <div class="panel-header">
              <h3>HR task completion tracker</h3>
              <span>{{ completedTasks }}/{{ technicianTasks.length }} complete</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Owner</th>
                  <th>Progress</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in technicianTasks" :key="task.id">
                  <td>{{ task.title }}</td>
                  <td>{{ task.owner }}</td>
                  <td>
                    <div class="progress-bar"><span :style="{ width: `${task.progress}%` }"></span></div>
                  </td>
                  <td><span class="status-badge" :class="task.status.toLowerCase()">{{ task.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </article>
        </template>

        <template v-else-if="isDeliboi">
          <div class="summary-grid">
            <article class="summary-card accent">
              <p>Pending drops</p>
              <strong>{{ deliveryQueue.filter((drop) => drop.status !== 'Delivered').length }}</strong>
              <small>Active deliveries</small>
            </article>
            <article class="summary-card accent-alt">
              <p>Today’s route</p>
              <strong>{{ deliveryQueue.length }}</strong>
              <small>Assigned stops</small>
            </article>
            <article class="summary-card accent-tech">
              <p>On-time rate</p>
              <strong>96%</strong>
              <small>Service quality</small>
            </article>
          </div>

          <div class="profile-panels">
            <article class="data-panel">
              <h3>Delivery queue</h3>
              <table>
                <thead>
                  <tr>
                    <th>Pickup</th>
                    <th>Destination</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="drop in deliveryQueue" :key="drop.id">
                    <td>{{ drop.origin }}</td>
                    <td>{{ drop.destination }}</td>
                    <td><span class="status-badge" :class="drop.status.toLowerCase()">{{ drop.status }}</span></td>
                  </tr>
                </tbody>
              </table>
            </article>

            <article class="data-panel">
              <h3>Route notes</h3>
              <ul class="review-list">
                <li v-for="note in deliboiNotes" :key="note.id">
                  <div class="review-head">
                    <strong>{{ note.route }}</strong>
                    <span>{{ note.time }}</span>
                  </div>
                  <p>{{ note.message }}</p>
                </li>
              </ul>
            </article>
          </div>
        </template>

        <template v-else>
          <div class="summary-grid">
            <article class="summary-card accent">
              <p>Services requested</p>
              <strong>{{ serviceHistory.length }}</strong>
              <small>Historical requests</small>
            </article>
            <article class="summary-card accent-alt">
              <p>Reviews left</p>
              <strong>{{ reviewHistory.length }}</strong>
              <small>Ratings & feedback</small>
            </article>
          </div>

          <div class="profile-panels">
            <article class="data-panel">
              <h3>Service history</h3>
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="service in serviceHistory" :key="service.id">
                    <td>{{ service.name }}</td>
                    <td>{{ service.date }}</td>
                    <td><span class="status-badge" :class="service.status.toLowerCase()">{{ service.status }}</span></td>
                  </tr>
                </tbody>
              </table>
            </article>

            <article class="data-panel">
              <h3>Reviews</h3>
              <ul class="review-list">
                <li v-for="review in reviewHistory" :key="review.id">
                  <div class="review-head">
                    <strong>{{ review.service }}</strong>
                    <span>{{ review.rating }}★</span>
                  </div>
                  <p>{{ review.comment }}</p>
                </li>
              </ul>
            </article>
          </div>
        </template>

        <div class="account-benefits">
          <h3>What you can do next</h3>
          <ul>
            <li v-if="isTechnician">Monitor your active jobs, maintain service quality, and track completion status.</li>
            <li v-else-if="isDeliboi">Review your delivery queue, keep routes efficient, and update dispatch status in real time.</li>
            <li v-else>Track your recent service requests and job outcomes.</li>
            <li>Review platform feedback and continue working from your dashboard.</li>
          </ul>
        </div>

        <div class="account-actions">
          <router-link to="/products" class="primary-btn">Continue shopping</router-link>
          <button type="button" class="secondary-btn" @click="handleLogout">Sign out</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getRegisteredUser, clearRegisteredUser } from "../services/auth.service";

export default {
  name: "AccountPage",
  data() {
    return {
      currentUser: null,
      feedback: "",
      serviceHistory: [
        { id: 1, name: "Smart home setup", date: "May 10, 2026", status: "Completed" },
        { id: 2, name: "Product consultation", date: "Jun 22, 2026", status: "In progress" },
        { id: 3, name: "Cyber support", date: "Aug 04, 2026", status: "Completed" },
      ],
      reviewHistory: [
        { id: 1, service: "Smart home setup", rating: 5, comment: "Fast, professional, and very organized." },
        { id: 2, service: "Product consultation", rating: 4, comment: "Helpful recommendations and clear communication." },
      ],
      technicianTasks: [
        { id: 1, title: "Site inspection", owner: "Kabila Mboya", progress: 100, status: "Completed" },
        { id: 2, title: "Client walkthrough", owner: "Kabila Mboya", progress: 75, status: "In progress" },
        { id: 3, title: "Quality handoff", owner: "Kabila Mboya", progress: 45, status: "Pending" },
      ],
      technicianJobs: [
        { id: 1, title: "Smart home install", client: "Njeri M.", status: "In Progress" },
        { id: 2, title: "CCTV checkup", client: "Akinyi K.", status: "Scheduled" },
        { id: 3, title: "Solar maintenance", client: "Otieno D.", status: "Completed" },
      ],
      technicianNotes: [
        { id: 1, title: "Site prep", priority: "High", message: "Confirm equipment list and current power setup before arrival." },
        { id: 2, title: "Customer follow-up", priority: "Medium", message: "Send a short progress update after the next service checkpoint." },
      ],
      deliveryQueue: [
        { id: 1, origin: "Kisumu CBD", destination: "Mamboleo", status: "In Transit" },
        { id: 2, origin: "Ahero", destination: "Kibos", status: "Scheduled" },
        { id: 3, origin: "Nyalenda", destination: "Kisumu Central", status: "Delivered" },
      ],
      deliboiNotes: [
        { id: 1, route: "Central loop", time: "09:00", message: "Avoid peak traffic near the market after 9:30am." },
        { id: 2, route: "East route", time: "12:40", message: "Check rider availability before dispatching the next order bundle." },
      ],
    };
  },
  computed: {
    isSignedIn() {
      return Boolean(this.currentUser);
    },
    isTechnician() {
      return this.currentUser?.account_type === "technician";
    },
    isDeliboi() {
      return this.currentUser?.account_type === "deliboi";
    },
    canEditDetails() {
      return ["deliboi", "technician"].includes(this.currentUser?.account_type || "");
    },
    completedTasks() {
      return this.technicianTasks.filter((task) => task.status === "Completed").length;
    },
  },
  mounted() {
    this.currentUser = getRegisteredUser();
  },
  methods: {
    goToSignIn() {
      this.$router.push("/signin");
    },
    goToSignUp() {
      this.$router.push("/signup");
    },
    handleLogout() {
      clearRegisteredUser();
      this.currentUser = null;
      this.feedback = "You have signed out.";
      this.$router.push("/signin");
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
  max-width: 980px;
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

.mini-label {
  margin: 0 0 4px;
  font-size: 0.7rem;
  color: #64748b;
  letter-spacing: 0.14em;
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

.auth-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.auth-panel,
.data-panel,
.summary-card {
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #f8fafc;
}

.panel-toggle {
  display:flex;
  gap:8px;
  margin-bottom:16px;
}

.toggle-btn {
  flex:1;
  padding:9px 12px;
  border:1px solid #cbd5e1;
  border-radius:999px;
  background:#fff;
  color:#0f172a;
  font-weight:700;
  cursor:pointer;
}

.toggle-btn.active {
  background:#111827;
  border-color:#111827;
  color:#fff;
}

.role-note,
.access-note {
  display: block;
  margin-top: 8px;
  color: #475569;
  font-size: 0.78rem;
  line-height: 1.5;
}

.welcome-highlight {
  margin-bottom: 18px;
  padding: 18px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: linear-gradient(135deg, #fff7ed, #eff6ff);
}

.welcome-highlight h2 {
  margin: 0 0 12px;
  color: #111827;
}

.highlight-list {
  margin: 0;
  padding-left: 18px;
  color: #475569;
  line-height: 1.8;
}

.primary-outline-btn {
  width: 100%;
  margin-top: 6px;
  border: 1px solid #111827;
  border-radius: 12px;
  background: transparent;
  color: #111827;
  font-weight: 700;
  padding: 10px 16px;
  cursor: pointer;
}

.account-benefits h3 {
  margin: 0 0 16px;
  color: #111827;
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

.profile-layout {
  margin-top: 24px;
  display: grid;
  gap: 22px;
}

.profile-header,
.panel-header,
.review-head,
.account-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.profile-header h2 {
  margin: 0;
  color: #111827;
  text-transform: capitalize;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.summary-card {
  padding: 18px;
}

.summary-card p,
.summary-card small {
  display: block;
  margin: 0;
  color: #475569;
}

.summary-card strong {
  display: block;
  margin: 10px 0 6px;
  font-size: clamp(1.4rem, 3vw, 2rem);
  color: #111827;
}

.accent { background: linear-gradient(135deg, #fff7ed, #fff); }
.accent-alt { background: linear-gradient(135deg, #eff6ff, #fff); }
.accent-tech { background: linear-gradient(135deg, #ecfeff, #fff); }

.profile-panels {
  display: grid;
  grid-template-columns: 1.3fr 0.9fr;
  gap: 18px;
}

.data-panel {
  padding: 18px;
}

.data-panel table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.data-panel th,
.data-panel td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e2e8f0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: capitalize;
}

.status-badge.completed,
.status-badge.active,
.status-badge.in\ progress {
  background: #dcfce7;
  color: #166534;
}

.status-badge.pending,
.status-badge.review {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.in-progress {
  background: #dbeafe;
  color: #1d4ed8;
}

.review-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.review-list li {
  padding: 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.review-list p {
  margin: 8px 0 0;
  color: #475569;
  line-height: 1.6;
}

.review-head span {
  color: #f59e0b;
  font-weight: 700;
}

.progress-bar {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #111827, #f97316);
  border-radius: inherit;
}

.panel-header span {
  color: #475569;
  font-size: 0.8rem;
}

.account-benefits ul {
  margin: 0;
  padding-left: 18px;
  color: #475569;
  line-height: 1.8;
}

@media (max-width: 820px) {
  .auth-layout,
  .profile-panels,
  .summary-grid {
    grid-template-columns: 1fr;
  }

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

  .profile-header,
  .panel-header,
  .account-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
