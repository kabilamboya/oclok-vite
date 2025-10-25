<template>
  <div class="detail-page" v-if="technician">
    <!-- Back Button -->
    <button class="back-btn" @click="$router.push('/technicians')">
      ⬅ Back to Technicians
    </button>

    <!-- Profile Header -->
    <div class="profile-header">
      <img :src="technician.image" :alt="technician.name" class="profile-pic" />
      <div class="info">
        <h1>{{ technician.name }}</h1>
        <h3>{{ technician.specialty }} ({{ technician.experience }} yrs experience)</h3>
        <p class="bio">{{ technician.bio }}</p>
        <div class="contact">
          <p><strong>📞 Phone:</strong> {{ technician.contact.phone }}</p>
          <p><strong>✉️ Email:</strong> {{ technician.contact.email }}</p>
          <p><strong>📍 Location:</strong> {{ technician.location }}</p>
        </div>
      </div>
    </div>

    <!-- Dashboard -->
    <div class="dashboard" v-if="technician.projects">
      <h2>📊 Project Dashboard</h2>
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
    };
  },
  mounted() {
    const id = parseInt(this.$route.params.id);

    // Fetch from public folder instead of importing
    fetch("/technicians.json")
      .then((res) => res.json())
      .then((data) => {
        this.technician = data.find((t) => t.id === id);
        if (this.technician) {
          this.$nextTick(() => {
            this.renderChart();
          });
        }
      })
      .catch((err) => console.error("Error loading technician details:", err));
  },
  methods: {
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
  width: 200px;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.info {
  flex: 1;
}

/* Dashboard */
.dashboard {
  margin: 30px 0;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
}
.dashboard h2 {
  margin-bottom: 15px;
  color: #222;
  font-size: 1.5rem;
}

/* Projects */
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

.project-category ul {
  list-style: disc;
  padding-left: 20px;
}

.project-category li {
  margin: 6px 0;
  padding: 6px 8px;
  transition: background 0.2s ease;
  border-radius: 6px;
}
.project-category li:hover {
  background: #fffae6;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .info h1, .info h3, .contact p {
    text-align: center;
  }
  .profile-pic {
    width: 180px;
    height: 180px;
  }
}
</style>
