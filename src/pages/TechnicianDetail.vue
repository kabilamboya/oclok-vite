<template>
  <div class="detail-page" v-if="technician">
    <!-- Back Button -->
    <button class="back-btn" @click="goBack">
      ⬅ Back to Technicians
    </button>

    <!-- Profile Header -->
    <div class="profile-header">
      <img :src="technician.image" :alt="technician.name" class="profile-pic" />
      <div class="info">
        <h1>{{ technician.name }}</h1>
        <h3>{{ technician.specialty }} ({{ technician.experience }} yrs experience)</h3>
        <p class="bio">{{ technician.bio }}</p>

        <!-- Contact Info -->
        <div class="contact">
          <p><strong>📞</strong> {{ technician.contact.phone }}</p>
          <p><strong>✉️</strong> {{ technician.contact.email }}</p>
          <p><strong>📍</strong> {{ technician.location }}</p>
        </div>

        <!-- Social & WhatsApp -->
        <div class="socials">
          <a 
            v-if="technician.contact.phone" 
            :href="`https://wa.me/${technician.contact.phone}`" 
            target="_blank" 
            class="social-btn whatsapp"
            title="Message on WhatsApp"
          >
            <i class="fab fa-whatsapp"></i>
          </a>

          <a v-for="(link, platform) in technician.socials" 
             :key="platform" 
             :href="link" 
             target="_blank" 
             class="social-btn"
             :title="platform"
          >
            <i :class="platformIcon(platform)"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Ratings Section -->
    <div class="ratings-section" v-if="technician.ratings">
      <h2>⭐ Technician Ratings</h2>

      <div class="rating-breakdown">
        <div class="rating-item">
          <label>App Rating</label>
          <div class="progress">
            <div class="bar" :style="{ width: ratingPercent(technician.ratings.app) }"></div>
          </div>
          <span>{{ technician.ratings.app.toFixed(1) }}/5</span>
        </div>

        <div class="rating-item">
          <label>Skills Rating</label>
          <div class="progress">
            <div class="bar" :style="{ width: ratingPercent(technician.ratings.skills) }"></div>
          </div>
          <span>{{ technician.ratings.skills.toFixed(1) }}/5</span>
        </div>

        <div class="rating-item">
          <label>Customer Rating</label>
          <div class="progress">
            <div class="bar" :style="{ width: ratingPercent(technician.ratings.customer) }"></div>
          </div>
          <span>{{ technician.ratings.customer.toFixed(1) }}/5</span>
        </div>
      </div>

      <!-- Average Star Display -->
      <div class="overall-rating">
        <h3>Overall Rating</h3>
        <div class="stars">
          <span 
            v-for="i in 5" 
            :key="i" 
            class="star" 
            :class="{ filled: i <= Math.round(avgRating) }"
          >★</span>
          <small>{{ avgRating.toFixed(1) }}/5</small>
        </div>
      </div>
    </div>

    <!-- Dashboard -->
    <div class="dashboard" v-if="technician.projects">
      <h2>📊 Project Overview</h2>
      <canvas id="projectsChart"></canvas>
    </div>

    <!-- Projects Sections -->
    <div class="projects">
      <!-- Ongoing -->
      <div class="project-category" v-if="technician.projects.continuing.length">
        <h2>Ongoing Projects</h2>
        <div class="grid">
          <div 
            v-for="(proj, idx) in technician.projects.continuing" 
            :key="`c-${idx}`" 
            class="project-card"
          >
            <h3>{{ proj }}</h3>
          </div>
        </div>
      </div>

      <!-- Under Review -->
      <div class="project-category" v-if="technician.projects.review.length">
        <h2>Projects Under Review</h2>
        <div class="mixed-layout">
          <div 
            v-for="(proj, idx) in technician.projects.review" 
            :key="`r-${idx}`" 
            class="project-box"
          >
            <span>{{ proj }}</span>
          </div>
        </div>
      </div>

      <!-- Completed -->
      <div class="project-category" v-if="technician.projects.completed.length">
        <h2>Completed Projects</h2>
        <ul class="completed-list">
          <li 
            v-for="(proj, idx) in technician.projects.completed" 
            :key="`done-${idx}`"
          >
            ✔ {{ proj }}
          </li>
        </ul>
      </div>
    </div>
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
    };
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const id = parseInt(this.$route.params.id);
    fetch("/technicians.json")
      .then((res) => res.json())
      .then((data) => {
        this.technician = data.find((t) => t.id === id);
        if (this.technician) {
          this.computeAverageRating();
          this.$nextTick(() => {
            this.renderChart();
          });
        }
      })
      .catch((err) => console.error("Error loading technician details:", err));
  },
  methods: {
    goBack() {
      this.$router.push("/technicians");
    },
    ratingPercent(val) {
      return `${(val / 5) * 100}%`;
    },
    computeAverageRating() {
      const r = this.technician.ratings;
      const avg = (r.app + r.skills + r.customer) / 3;
      this.avgRating = avg;
    },
    renderChart() {
      const ctx = document.getElementById("projectsChart");
      if (!ctx) return;

      const data = {
        labels: ["Ongoing", "Under Review", "Completed"],
        datasets: [
          {
            data: [
              this.technician.projects.continuing.length,
              this.technician.projects.review.length,
              this.technician.projects.completed.length,
            ],
            backgroundColor: ["#ff9800", "#f44336", "#4caf50"],
          },
        ],
      };

      new Chart(ctx, {
        type: "doughnut",
        data,
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
          },
        },
      });
    },
    platformIcon(platform) {
      switch (platform.toLowerCase()) {
        case "linkedin": return "fab fa-linkedin";
        case "facebook": return "fab fa-facebook-f";
        case "x": return "fab fa-x";
        case "tiktok": return "fab fa-tiktok";
        default: return "fas fa-globe";
      }
    }
  },
};
</script>

<style scoped>
.detail-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

/* Back Button */
.back-btn {
  background: #ff6600;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background 0.2s ease;
}
.back-btn:hover {
  background: #e65c00;
}

/* Profile Header */
.profile-header {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.profile-pic {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.info {
  flex: 1;
}

.contact p {
  margin: 4px 0;
}

/* Social Buttons as Circular Icons */
.socials {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.social-btn {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #ff6600;
  color: #fff;
  text-decoration: none;
  font-size: 1.2rem;
  transition: background 0.2s ease, transform 0.2s ease;
}
.social-btn:hover {
  background: #e65c00;
  transform: scale(1.1);
}
.social-btn.whatsapp {
  background: #25D366;
}
.social-btn.whatsapp:hover {
  background: #1DA851;
}

/* Ratings Section */
.ratings-section {
  background: #fff;
  margin: 30px 0;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.05);
}
.rating-breakdown {
  margin-top: 10px;
}
.rating-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.rating-item label {
  flex: 1;
  font-weight: 600;
}
.progress {
  background: #eee;
  height: 8px;
  border-radius: 6px;
  width: 60%;
  overflow: hidden;
}
.bar {
  height: 100%;
  background: #ffb400;
  border-radius: 6px;
  transition: width 0.6s ease;
}

/* Stars */
.overall-rating {
  text-align: center;
  margin-top: 15px;
}
.stars {
  font-size: 1.3rem;
}
.star {
  color: #ccc;
}
.star.filled {
  color: #ffb400;
}

/* Dashboard */
.dashboard {
  margin: 30px 0;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
}

/* Project Section */
.projects {
  margin-top: 20px;
}
.project-category {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.05);
  margin-bottom: 25px;
}
.project-category h2 {
  margin-bottom: 12px;
  color: #ff6600;
  font-size: 1.4rem;
}
.completed-list li {
  margin: 6px 0;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  .profile-pic {
    margin: 0 auto;
  }
  .socials {
    justify-content: center;
  }
}
</style>
