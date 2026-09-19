<template>



  <div class="page">

    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search technicians..."
        class="search-input"
      />

      <select v-model="selectedSpecialty" class="specialty-select">
        <option value="">All Specialties</option>
        <option v-for="spec in specialties" :key="spec" :value="spec">
          {{ spec }}
        </option>
      </select>
    </div>

      <section class="hero" aria-hidden="false">
        <div class="hero-text">
          <h1>Our Certified <span class="hero-accent-primary">O!clok</span> <span class="hero-accent-secondary">Skills</span></h1>
          <p>Available remotely at your convenience</p>
        </div>
      </section>

    <div class="cards">
      <CardList
        :card-items="paginatedSkills"
        type="technician"
        :clickable="true"
        primary-label="Book"
        secondary-label="Email"
        :show-projects="false"
        :show-rating="true"
        @select="goToTech"
        @primary="bookTechnician"
      />
    </div>

    <PaginationControls
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @update:current-page="currentPage = $event"
    />

    <section class="account-cta-section">
      <div class="section-shell contact-card">
        <h2>Want to become part of our team?</h2>
        <p>Create account and together let’s solve digital challenges at client's convenience.</p>
        <div class="contact-actions">
          <router-link to="/signup" class="create-account-btn">Create Account</router-link>
          <a href="mailto:cambridgemediam@gmail.com" class="primary-btn">Email Us</a>
          <a href="tel:+254732379292" class="secondary-btn">Call Now</a>
        </div>
      </div>
    </section>

    <div v-if="bookings.length" class="booking-summary">
      <h2>Bookings ({{ bookings.length }})</h2>

      <ul role="list">
        <li v-for="tech in bookings" :key="tech.id" role="listitem">
          {{ tech.name }} - <strong>{{ tech.specialty }}</strong>
        </li>
      </ul>

      <button class="clear-btn" @click="clearBookings">Clear All</button>
    </div>
  </div>
</template>

  <script>
  import CardList from "../components/CardList.vue";
  import PaginationControls from "../components/PaginationControls.vue";
  import techniciansData from "../data/technicians.json";
  import { computed, ref, watch, onMounted } from "vue";

  export default {
    name: "Technicians",
    components: { CardList, PaginationControls },

    setup() {
      const technicians = ref([]);
      const deliboiProfiles = ref([
        {
          id: "deliboi-1",
          name: "Deliboi Express",
          specialty: "Local delivery & errands",
          location: "Kisumu",
          bio: "Fast pickup, doorstep delivery, and same-day support for homes and businesses.",
          kind: "deliboi",
          rating: 4,
          available: true,
        },
        {
          id: "deliboi-2",
          name: "Oclok Hand Carry",
          specialty: "Parcel and document delivery",
          location: "Kisumu CBD",
          bio: "Reliable courier support for parcels, documents, and important errands.",
          kind: "deliboi",
          rating: 4,
          available: true,
        },
      ]);
      const searchQuery = ref("");
      const selectedSpecialty = ref("");
      const bookings = ref([]);
      const currentPage = ref(1);
      const itemsPerPage = 8;

      const allSkills = computed(() => [...technicians.value, ...deliboiProfiles.value]);

      const specialties = computed(() => {
        return [...new Set(allSkills.value.map((t) => t.specialty).filter(Boolean))];
      });

      const filteredSkills = computed(() => {
        const query = searchQuery.value.trim().toLowerCase();
        return allSkills.value.filter((t) => {
          const name = (t.name || "").toLowerCase();
          const specialtyText = (t.specialty || "").toLowerCase();
          const searchMatches = !query || name.includes(query) || specialtyText.includes(query);
          const specialtyMatches = selectedSpecialty.value
            ? specialtyText === selectedSpecialty.value.toLowerCase()
            : true;
          return searchMatches && specialtyMatches;
        });
      });

      const totalPages = computed(() => {
        return Math.max(1, Math.ceil(filteredSkills.value.length / itemsPerPage));
      });

      const paginatedSkills = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        return filteredSkills.value.slice(start, start + itemsPerPage);
      });

      watch(searchQuery, () => {
        currentPage.value = 1;
      });

      watch(selectedSpecialty, () => {
        currentPage.value = 1;
      });

      watch(totalPages, (newTotal) => {
        if (currentPage.value > newTotal) {
          currentPage.value = newTotal;
        }
      });

      const createSlug = (name) => {
        return (name || "")
          .toString()
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      };

      const goToTech = (tech) => {
        if (tech.kind === "deliboi") {
          window.location.href = "/discover";
          return;
        }
        const routeKey = tech.slug || createSlug(tech.name) || String(tech.id);
        window.location.href = `/technicians/${routeKey}`;
      };

      const bookTechnician = (tech) => {
        if (!bookings.value.some((b) => b.id === tech.id)) {
          bookings.value.push(tech);
        }
      };

      const clearBookings = () => {
        bookings.value = [];
      };

      onMounted(() => {
        const normalizeRating = (value) => {
          const numeric = Number(value);
          if (!Number.isFinite(numeric)) return 0;
          const rounded = Math.round(numeric);
          if (rounded <= 0) return 0;
          return Math.min(5, Math.max(3, rounded));
        };

        const ratingFromExperience = (experience) => {
          const years = Number(experience);
          if (!Number.isFinite(years)) return 3;
          if (years >= 10) return 5;
          if (years >= 6) return 4;
          return 3;
        };

        technicians.value = (techniciansData || []).map((tech) => ({
          ...tech,
          slug: tech.slug || createSlug(tech.name) || String(tech.id),
          rating: normalizeRating(tech.rating ?? ratingFromExperience(tech.experience)),
        }));
      });

      return {
        technicians,
        searchQuery,
        selectedSpecialty,
        bookings,
        currentPage,
        itemsPerPage,
        specialties,
        filteredSkills,
        totalPages,
        paginatedSkills,
        createSlug,
        goToTech,
        bookTechnician,
        clearBookings,
      };
    },
  };
  </script>

<style scoped>
.page {
  padding: 2rem;
  background-color: var(--surface-alt);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.title {
  text-align: center;
  color: var(--text);
  font-size: 1.8rem;
  margin-bottom: 2rem;
  font-weight: 700;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: stretch;
  margin-bottom: 2rem;
}

.search-input,
.specialty-select {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: 0.3s;
  min-width: 220px;
}

.search-input:focus,
.specialty-select:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.cards {
  margin-bottom: 1.5rem;
}

.cards .cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1.5rem;
}

.pagination {
  margin: 2rem auto;
  display: flex;
  gap: 1.2rem;
  font-weight: 600;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination button {
  background: var(--color-primary);
  border: none;
  padding: 0.55rem 1.2rem;
  border-radius: 0.4rem;
  cursor: pointer;
}

.pagination button:disabled {
  background: #ddd;
}

.account-cta-section {
  margin-top: 2.5rem;
  padding: 1rem 0 0;
}

.section-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.contact-card {
  padding: 40px 32px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(8, 15, 28, 0.98), rgba(24, 213, 194, 0.12));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 18px 40px rgba(10, 18, 27, 0.25);
}

.contact-card h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1.1;
  color: var(--text-dark, #fff);
}

.contact-card p {
  margin: 0.9rem 0 0;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.7;
  max-width: 680px;
}

.contact-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 1.5rem;
}

.create-account-btn,
.primary-btn,
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0.8rem 1.2rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.create-account-btn,
.primary-btn,
.secondary-btn {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-dark, #fff);
}

.create-account-btn {
  background: rgba(255, 255, 255, 0.06);
}

.primary-btn {
  background: var(--color-primary, #18d5c2);
  color: #06131a;
  border-color: transparent;
  box-shadow: 0 10px 24px rgba(24, 213, 194, 0.25);
}

.secondary-btn {
  background: transparent;
}

.create-account-btn:hover,
.primary-btn:hover,
.secondary-btn:hover {
  transform: translateY(-1px);
}

.booking-summary {
  margin-top: 2rem;
  background: var(--surface);
  padding: 1.3rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.booking-summary ul {
  padding: 0;
  list-style: none;
}

.clear-btn {
  background: var(--color-primary);
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  width: auto;
}

@media (max-width: 768px) {
  .page {
    padding: 1rem;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input,
  .specialty-select {
    width: 100%;
  }

  .cards .cards-container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .contact-card {
    padding: 30px 22px;
  }

  .contact-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .create-account-btn,
  .primary-btn,
  .secondary-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .cards .cards-container {
    grid-template-columns: 1fr;
  }

  .filters {
    gap: 0.75rem;
  }

  .search-input,
  .specialty-select {
    width: 100%;
    min-width: 0;
  }

  .booking-summary {
    padding: 1rem;
  }

  .clear-btn {
    width: 100%;
  }
}

</style>
