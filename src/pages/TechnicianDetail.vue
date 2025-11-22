<template>
  <div class="technician-detail" v-if="technician" aria-live="polite">
    <!-- Sticky Top Row (Back + CTAs) -->
    <div class="top-row">
      <button class="back-btn" @click="goBack" aria-label="Back to technicians">
        ← Technicians
      </button>

      <div class="top-ctas">
        <button class="ghost-btn" @click="toggleSave" :aria-pressed="saved" :title="saved ? 'Saved' : 'Save'">
          <span v-if="saved">💾 Saved</span>
          <span v-else>💾 Save</span>
        </button>

        <button class="primary-btn" @click="openMessage" title="Message technician">Message</button>
        <button class="accent-btn" @click="hireTechnician" title="Hire technician">Hire</button>
      </div>
    </div>

    <!-- Hero Card -->
    <section class="hero-card" role="region" :aria-labelledby="'tech-name'">
      <div class="hero-left">
        <div class="avatar-wrap">
          <img
            :src="technician.image || placeholder"
            :alt="`${technician.name} profile photo`"
            class="avatar"
            @error="onImgErr"
          />
        </div>

        <div class="quick-stats" aria-hidden="true">
          <div class="stat">
            <div class="stat-value">{{ avgRating.toFixed(1) }}</div>
            <div class="stat-label">Avg rating</div>
          </div>
          <div class="divider" />
          <div class="stat">
            <div class="stat-value">{{ completedCount }}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="divider" />
          <div class="stat">
            <div class="stat-value" :class="{ online: technician.available }">
              <span v-if="technician.available">●</span>
              <span v-else>○</span>
            </div>
            <div class="stat-label">{{ technician.available ? 'Available' : 'Offline' }}</div>
          </div>
        </div>
      </div>

      <div class="hero-right">
        <h1 id="tech-name" class="name">{{ technician.name }}</h1>
        <div class="subtitle">
          <strong class="role">{{ technician.specialty }}</strong>
          <span class="sep">•</span>
          <span>{{ technician.experience }} yrs</span>
        </div>

        <div class="badges" role="status" aria-label="Technician badges">
          <span class="badge verified" v-if="technician.verified">✔ Verified</span>
          <span class="badge top-rated" v-if="completedCount > 10 && avgRating >= 4.5">★ Top rated</span>
          <span class="badge partner" v-if="technician.partnered">🤝 Partnered</span>
        </div>

        <p class="bio" v-if="technician.bio">{{ technician.bio }}</p>

        <div class="contact-row">
          <div class="contact-item" v-if="technician.contact.phone">
            <a :href="`tel:${technician.contact.phone}`" aria-label="Call technician">
              📞 {{ formatPhone(technician.contact.phone) }}
            </a>
          </div>
          <div class="contact-item" v-if="technician.contact.email">
            <a :href="`mailto:${technician.contact.email}`" aria-label="Email technician">✉️ {{ technician.contact.email }}</a>
          </div>
          <div class="contact-item" v-if="technician.location">
            📍 {{ technician.location }}
          </div>
        </div>

        <div class="socials" v-if="hasSocials">
          <a
            v-if="technician.contact.phone"
            :href="whatsappLink(technician.contact.phone)"
            target="_blank"
            rel="noopener noreferrer"
            class="social whatsapp"
            aria-label="Message on WhatsApp"
          >WhatsApp</a>

          <a
            v-for="(link, platform) in technician.socials"
            :key="platform"
            :href="link"
            target="_blank"
            rel="noopener noreferrer"
            class="social"
            :title="platform"
          >
            {{ platform }}
          </a>
        </div>
      </div>
    </section>

    <!-- Ratings Card -->
    <section class="ratings-card" role="region" aria-labelledby="ratings-title">
      <h2 id="ratings-title" class="section-title">Ratings</h2>

      <div class="ratings-grid">
        <div class="rating-row" v-for="(label, key) in ratingKeys" :key="key">
          <div class="rating-meta">
            <span class="rating-icon" aria-hidden="true">{{ ratingIcon(key) }}</span>
            <span class="rating-label">{{ label }}</span>
          </div>

          <div class="rating-bar">
            <div class="bar-track" :aria-hidden="true">
              <div class="bar-fill" :style="{ width: ratingPercent(technician.ratings[key]) }"></div>
            </div>
            <div class="rating-number" aria-label="rating number">{{ (technician.ratings[key] || 0).toFixed(1) }}/5</div>
          </div>
        </div>
      </div>

      <div class="ratings-footer">
        <div class="reviews-count">Based on <strong>{{ reviewCount }}</strong> reviews</div>
        <div class="last-updated">Last updated: {{ lastUpdatedText }}</div>
      </div>
    </section>

    <!-- Dashboard (Chart) -->
    <section class="dashboard-card" role="region" aria-label="Project overview">
      <h2 class="section-title">Project Overview</h2>
      <div class="chart-wrap">
        <canvas id="projectsChart" aria-hidden="true"></canvas>
      </div>
    </section>

    <!-- Projects with Tabs -->
    <section class="projects-card" role="region" aria-labelledby="projects-title">
      <h2 id="projects-title" class="section-title">Projects</h2>

      <nav class="tabs" role="tablist" aria-label="Project categories">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="tab"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
          :aria-selected="activeTab === tab"
          role="tab"
        >
          {{ tab }}
        </button>
      </nav>

      <div class="tab-panel">
        <template v-if="activeTab === 'Ongoing'">
          <div class="grid projects-grid">
            <article v-for="(p, i) in technician.projects.continuing" :key="`c-${i}`" class="project-card" :aria-label="p.title || p">
              <h3 class="proj-title">{{ p.title || p }}</h3>
              <p class="proj-meta">Last updated: {{ humanDate(p.updated) }}</p>
              <div class="proj-actions">
                <button class="mini-btn" @click="viewProject(p)">View</button>
                <button class="mini-btn secondary" @click="messageAboutProject(p)">Message</button>
              </div>
            </article>
            <div v-if="!technician.projects.continuing.length" class="empty">No ongoing projects</div>
          </div>
        </template>

        <template v-if="activeTab === 'Under Review'">
          <div class="mixed projects-grid">
            <div v-for="(p, i) in technician.projects.review" :key="`r-${i}`" class="project-box">
              <h4>{{ p.title || p }}</h4>
              <small>Submitted: {{ humanDate(p.updated) }}</small>
            </div>
            <div v-if="!technician.projects.review.length" class="empty">No projects under review</div>
          </div>
        </template>

        <template v-if="activeTab === 'Completed'">
          <ul class="completed-list">
            <li v-for="(p, i) in technician.projects.completed" :key="`done-${i}`">
              ✔ {{ p.title || p }} <span class="meta">— completed {{ humanDate(p.completedAt) }}</span>
            </li>
            <div v-if="!technician.projects.completed.length" class="empty">No completed projects yet</div>
          </ul>
        </template>
      </div>
    </section>

    <!-- Accountability Partner Card -->
    <aside class="partner-card" role="complementary" aria-label="Accountability partner">
      <h3 class="section-title">Accountability Partner</h3>
      <div class="partner-stats">
        <div class="partner-row">
          <span class="label">Response speed</span>
          <span class="value">{{ technician.accountability.responseSpeed || '—' }}</span>
        </div>
        <div class="partner-row">
          <span class="label">Monthly activity</span>
          <span class="value">{{ technician.accountability.monthlyActivity || '—' }}</span>
        </div>
        <div class="partner-row">
          <span class="label">Reliability</span>
          <span class="value">{{ (technician.accountability.reliability || 0).toFixed(1) }}</span>
        </div>
      </div>

      <div class="partner-actions">
        <button class="mini-btn" @click="submitMonthlyReport">Submit Monthly Report</button>
        <div v-if="technician.partnered" class="partner-badge">✔ Reviewed by O!clok</div>
      </div>
    </aside>

    <!-- Reviews Preview -->
    <section class="reviews-card" role="region" aria-labelledby="reviews-title" v-if="technician.reviews && technician.reviews.length">
      <h2 id="reviews-title" class="section-title">Recent Reviews</h2>
      <ul class="review-list">
        <li v-for="(r, i) in recentReviews" :key="`rev-${i}`" class="review-item">
          <div class="rev-head">
            <strong>{{ r.author || 'Customer' }}</strong>
            <span class="rev-rating">★ {{ r.rating.toFixed(1) }}</span>
          </div>
          <p class="rev-text">{{ r.text }}</p>
          <small class="rev-date">{{ humanDate(r.date) }}</small>
        </li>
      </ul>
      <div class="reviews-actions">
        <button class="mini-btn" @click="openAllReviews">See all reviews</button>
        <button class="mini-btn secondary" @click="writeReview">Write review</button>
      </div>
    </section>
  </div>

  <!-- Loading / Not Found -->
  <div v-else class="notfound">
    <p>Technician not found or loading…</p>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  name: "TechnicianDetail",
  data() {
    return {
      technician: null,
      avgRating: 0,
      reviewCount: 0,
      placeholder: "/images/avatar-placeholder.png",
      saved: false,
      tabs: ["Ongoing", "Under Review", "Completed"],
      activeTab: "Ongoing",
    };
  },
  computed: {
    ratingKeys() {
      // display order + nice labels
      return {
        app: "App rating",
        skills: "Skills rating",
        customer: "Customer rating",
      };
    },
    completedCount() {
      return (this.technician && this.technician.projects && this.technician.projects.completed)
        ? this.technician.projects.completed.length
        : 0;
    },
    hasSocials() {
      return this.technician && this.technician.socials && Object.keys(this.technician.socials).length;
    },
    lastUpdatedText() {
      // simple text — if technician has ratingsUpdated date, show it
      return (this.technician && this.technician.ratingsUpdated) ? this.humanDate(this.technician.ratingsUpdated) : "This month";
    },
    recentReviews() {
      return (this.technician && this.technician.reviews) ? this.technician.reviews.slice(0, 3) : [];
    }
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const id = parseInt(this.$route.params.id, 10);
    fetch("/technicians.json")
      .then((res) => res.json())
      .then((data) => {
        this.technician = data.find((t) => t.id === id) || null;
        if (this.technician) {
          this.normalizeProjectDates();
          this.computeAverageRating();
          this.reviewCount = (this.technician.reviews && this.technician.reviews.length) || 0;
          this.$nextTick(() => this.renderChart());
        }
      })
      .catch((err) => {
        console.error("Error loading technicians:", err);
        this.technician = null;
      });
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    hireTechnician() {
      // wire up modal/intent flow in your app
      this.$emit("hire", this.technician);
      alert(`Hiring intent sent for ${this.technician.name}`);
    },
    openMessage() {
      this.$emit("message", this.technician);
      // prefer your in-app chat modal
      alert(`Open chat with ${this.technician.name}`);
    },
    toggleSave() {
      this.saved = !this.saved;
    },
    onImgErr(e) {
      e.target.src = this.placeholder;
    },
    formatPhone(phone) {
      // minimal formatting for display
      if (!phone) return "";
      const s = phone.replace(/\D/g, "");
      if (s.length === 12 && s.startsWith("254")) {
        return `+${s.slice(0, 3)} ${s.slice(3, 6)} ${s.slice(6)}`;
      }
      return phone;
    },
    whatsappLink(phone) {
      if (!phone) return "#";
      const clean = phone.replace(/\D/g, "");
      // whatsapp web expects country code, try to handle local numbers gracefully
      return `https://wa.me/${clean}`;
    },
    ratingPercent(val) {
      return `${((val || 0) / 5) * 100}%`;
    },
    computeAverageRating() {
      const r = (this.technician && this.technician.ratings) ? this.technician.ratings : { app: 0, skills: 0, customer: 0 };
      const avg = (Number(r.app || 0) + Number(r.skills || 0) + Number(r.customer || 0)) / 3;
      this.avgRating = avg || 0;
    },
    ratingIcon(key) {
      switch (key) {
        case "app": return "🚀";
        case "skills": return "🔧";
        case "customer": return "🙂";
        default: return "★";
      }
    },
    humanDate(d) {
      if (!d) return "—";
      const date = new Date(d);
      if (isNaN(date)) return d;
      return date.toLocaleDateString();
    },
    normalizeProjectDates() {
      // ensure project items are objects with date fields for display
      const p = this.technician.projects || { continuing: [], review: [], completed: [] };
      ["continuing", "review", "completed"].forEach((k) => {
        this.technician.projects[k] = (p[k] || []).map((item) => {
          if (typeof item === "string") return { title: item, updated: null, completedAt: null };
          return item;
        });
      });
    },
    renderChart() {
      const ctx = document.getElementById("projectsChart");
      if (!ctx || !this.technician) return;
      const ongoing = this.technician.projects.continuing.length;
      const review = this.technician.projects.review.length;
      const completed = this.technician.projects.completed.length;

      // destroy previous chart safely
      if (this._projectsChart) {
        try { this._projectsChart.destroy(); } catch (e) { /* ignore */ }
      }

      this._projectsChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Ongoing", "Under Review", "Completed"],
          datasets: [{
            data: [ongoing, review, completed],
            backgroundColor: ["#ffb400", "#f39c12", "#4caf50"],
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom" } },
        },
      });
    },

    // small UX actions
    viewProject(p) {
      this.$emit("view-project", p);
      // open project detail modal or route
    },
    messageAboutProject(p) {
      this.openMessage();
    },
    submitMonthlyReport() {
      alert("Monthly report modal: implement in admin flow.");
    },
    openAllReviews() {
      this.$emit("open-reviews", this.technician.reviews);
    },
    writeReview() {
      this.$emit("write-review", this.technician.id);
    }
  },
  unmounted() {
    if (this._projectsChart) {
      try { this._projectsChart.destroy(); } catch (e) {}
    }
  }
};
</script>

<style scoped>
/* Brand variables */
:root {
  --brand: #ffb400; /* O!clok yellow */
  --accent: #ff6600;
  --primary: #111827;
  --muted: #6b7280;
  --bg: #f7f7fb;
  --card: #ffffff;
  --radius: 14px;
}

/* Page layout */
.technician-detail {
  max-width: 1100px;
  margin: 28px auto;
  padding: 18px;
  color: var(--primary);
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

/* Top row */
.top-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  position: sticky;
  top: 12px;
  z-index: 40;
  background: transparent;
  padding-bottom: 14px;
}

.back-btn {
  background: var(--card);
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 14px rgba(16,24,40,0.04);
  cursor: pointer;
  font-weight: 600;
}
.top-ctas { display:flex; gap:8px; align-items:center; }

.primary-btn {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 9px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
}
.accent-btn {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 9px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 800;
  box-shadow: 0 6px 18px rgba(255,102,0,0.12);
}
.ghost-btn {
  background: transparent;
  border: 1px solid rgba(0,0,0,0.06);
  padding: 7px 11px;
  border-radius: 10px;
  cursor: pointer;
}

/* Hero card */
.hero-card {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 22px;
  background: var(--card);
  padding: 20px;
  border-radius: var(--radius);
  box-shadow: 0 8px 30px rgba(16,24,40,0.06);
  align-items: center;
  margin-bottom: 20px;
}

.avatar-wrap { display:flex; justify-content:center; }
.avatar {
  width: 144px;
  height: 144px;
  border-radius: 50%;
  object-fit: cover;
  border: 6px solid rgba(255,180,64,0.12);
  box-shadow: 0 8px 30px rgba(16,24,40,0.06);
}

.quick-stats {
  display:flex;
  justify-content:space-between;
  margin-top:12px;
  gap:8px;
  align-items:center;
}
.stat { text-align:center; min-width:66px; }
.stat-value { font-weight:800; font-size:1.15rem; }
.stat-label { color:var(--muted); font-size:0.85rem; }

/* Right area */
.name { font-size:1.8rem; margin:0; }
.subtitle { color:var(--muted); margin:8px 0; display:flex; gap:8px; align-items:center; }
.role { color:var(--primary); }
.sep { opacity:0.5; }

.badges { margin:10px 0; display:flex; gap:8px; flex-wrap:wrap; }
.badge {
  background: rgba(0,0,0,0.03);
  padding:6px 10px;
  border-radius:999px;
  font-weight:600;
  font-size:0.88rem;
}
.badge.verified { background: rgba(16,185,129,0.08); color:#065f46; }
.badge.top-rated { background: rgba(255,180,64,0.12); color: #6b3b00; }
.badge.partner { background: rgba(99,102,241,0.08); color:#3b3b98; }

.bio { margin: 10px 0 12px; color:var(--muted); line-height:1.5; }

.contact-row { display:flex; gap:14px; align-items:center; flex-wrap:wrap; color:var(--muted); }
.contact-item a { color:var(--primary); text-decoration:none; font-weight:600; }

/* Socials */
.socials { margin-top:10px; display:flex; gap:8px; flex-wrap:wrap; }
.social { padding:6px 9px; border-radius:8px; text-decoration:none; border:1px solid rgba(0,0,0,0.06); font-weight:600; }

/* Ratings card */
.ratings-card { background:var(--card); padding:18px; margin:18px 0; border-radius:var(--radius); box-shadow: 0 6px 20px rgba(16,24,40,0.04); }
.section-title { margin:0 0 12px 0; font-size:1.05rem; font-weight:800; }
.ratings-grid { display:flex; flex-direction:column; gap:12px; }
.rating-row { display:flex; gap:12px; align-items:center; }
.rating-meta { width:160px; display:flex; gap:10px; align-items:center; color:var(--muted); font-weight:700; }
.rating-icon { font-size:1.2rem; width:28px; display:inline-block; text-align:center; }
.rating-bar { display:flex; align-items:center; gap:12px; flex:1; }
.bar-track { background:#f0f0f0; height:10px; border-radius:999px; flex:1; overflow:hidden; }
.bar-fill { height:100%; background:linear-gradient(90deg,var(--brand),var(--accent)); border-radius:999px; transition:width .6s ease; }
.rating-number { width:72px; text-align:right; font-weight:700; }

/* Ratings footer */
.ratings-footer { display:flex; justify-content:space-between; color:var(--muted); margin-top:12px; font-size:0.9rem; }

/* Dashboard Chart */
.dashboard-card { background:var(--card); padding:18px; border-radius:var(--radius); margin-bottom:18px; box-shadow: 0 6px 20px rgba(16,24,40,0.04); }
.chart-wrap { height:180px; position:relative; }

/* Projects area */
.projects-card { background:var(--card); padding:18px; border-radius:var(--radius); margin-bottom:18px; box-shadow: 0 6px 20px rgba(16,24,40,0.04); }
.tabs { display:flex; gap:8px; margin-bottom:12px; }
.tab { background:transparent; border:none; padding:8px 12px; border-radius:999px; cursor:pointer; font-weight:700; color:var(--muted); }
.tab.active { background:rgba(0,0,0,0.04); color:var(--primary); }

.projects-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap:12px; }
.project-card { padding:12px; background:#fbfbfd; border:1px solid rgba(0,0,0,0.03); border-radius:12px; }
.project-box { padding:12px; border-radius:10px; background: #fff; border:1px solid rgba(0,0,0,0.03); }
.completed-list { list-style:none; padding:0; margin:0; }
.completed-list li { padding:8px 0; border-bottom:1px dashed rgba(0,0,0,0.03); color:var(--muted); }

/* Partner card */
.partner-card { background:var(--card); padding:16px; border-radius:var(--radius); box-shadow: 0 6px 20px rgba(16,24,40,0.04); margin:18px 0; }
.partner-stats { display:flex; flex-direction:column; gap:8px; margin-bottom:12px; }
.partner-row { display:flex; justify-content:space-between; color:var(--muted); }
.partner-actions { display:flex; gap:8px; align-items:center; }
.partner-badge { background: rgba(96,165,250,0.12); padding:8px 12px; border-radius:999px; color:#075985; font-weight:700; }

/* Reviews */
.reviews-card { background:var(--card); padding:18px; border-radius:var(--radius); margin-bottom:18px; box-shadow: 0 6px 20px rgba(16,24,40,0.04); }
.review-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:12px; }
.review-item { border-left:4px solid rgba(0,0,0,0.04); padding:12px; background:#fff; border-radius:8px; }
.rev-head { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:6px; }
.rev-text { color:var(--muted); margin:0 0 6px 0; }
.rev-date { color:#9ca3af; font-size:0.85rem; }

/* Small buttons */
.mini-btn { border:1px solid rgba(0,0,0,0.06); background:transparent; padding:6px 10px; border-radius:8px; cursor:pointer; }
.mini-btn.secondary { background:#fafafa; }

.empty { color:var(--muted); padding:14px; }

/* Responsive */
@media (max-width: 900px) {
  .hero-card { grid-template-columns: 140px 1fr; gap:12px; }
  .avatar { width: 110px; height: 110px; }
}

@media (max-width: 640px) {
  .technician-detail { padding:12px; }
  .hero-card { grid-template-columns: 1fr; text-align:center; gap:10px; }
  .hero-left { display:flex; flex-direction:column; align-items:center; }
  .quick-stats { margin-top: 10px; }
  .contact-row { justify-content:center; }
  .top-row { flex-direction:column; align-items:stretch; gap:10px; position: static; }
  .top-ctas { justify-content: center; }
}
</style>
