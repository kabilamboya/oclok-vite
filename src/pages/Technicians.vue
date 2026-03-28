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
          <h1>Our Certified O!clok Doctors</h1>
          <p>Available remotely at your convenience</p>
        </div>
      </section>

    <div class="cards">
      <CardList
        :card-items="paginatedTechnicians"
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

    <div class="pagination" v-if="totalPages > 1" aria-label="Pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">Prev</button>
      <button
        v-for="page in visiblePages"
        :key="page"
        :class="['page-btn', { active: page === currentPage }]"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <button :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
    </div>

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
  import techniciansData from "../data/technicians.json";

  export default {
  name: "Technicians",
  components: { CardList },

  data() {
    return {
      technicians: [],
      searchQuery: "",
      selectedSpecialty: "",
      bookings: [],
      currentPage: 1,
      itemsPerPage: 8,
    };
  },

  computed: {
    specialties() {
      return [...new Set(this.technicians.map((t) => t.specialty).filter(Boolean))];
    },

    filteredTechnicians() {
      const query = this.searchQuery.trim().toLowerCase();
      return this.technicians.filter((t) => {
        const name = (t.name || "").toLowerCase();
        const specialtyText = (t.specialty || "").toLowerCase();
        const searchMatches = !query || name.includes(query) || specialtyText.includes(query);
        const specialtyMatches = this.selectedSpecialty
          ? specialtyText === this.selectedSpecialty.toLowerCase()
          : true;
        return searchMatches && specialtyMatches;
      });
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.filteredTechnicians.length / this.itemsPerPage));
    },

    paginatedTechnicians() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredTechnicians.slice(start, start + this.itemsPerPage);
    },

    visiblePages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const delta = 2;
      const start = Math.max(1, current - delta);
      const end = Math.min(total, current + delta);
      const pages = [];

      for (let page = start; page <= end; page += 1) {
        pages.push(page);
      }

      return pages;
    },
  },

  watch: {
    searchQuery() {
      this.currentPage = 1;
    },

    selectedSpecialty() {
      this.currentPage = 1;
    },

    totalPages(newTotal) {
      if (this.currentPage > newTotal) {
        this.currentPage = newTotal;
      }
    },
  },

  methods: {
    createSlug(name) {
      return (name || "")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    },

    goToTech(tech) {
      const routeKey = tech.slug || this.createSlug(tech.name) || String(tech.id);
      this.$router.push(`/technicians/${routeKey}`);
    },

    goToPage(page) {
      this.currentPage = page;
      console.log("[pagination][technicians] page ->", this.currentPage);
    },

    bookTechnician(tech) {
      if (!this.bookings.some((b) => b.id === tech.id)) {
        this.bookings.push(tech);
      }
    },

    clearBookings() {
      this.bookings = [];
    },
  },

  mounted() {
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

    this.technicians = (techniciansData || []).map((tech) => ({
      ...tech,
      slug: tech.slug || this.createSlug(tech.name) || String(tech.id),
      rating: normalizeRating(tech.rating ?? ratingFromExperience(tech.experience)),
    }));
  },
};
</script>

<style scoped>
.page {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.title {
  text-align: center;
  color: #222;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  font-weight: 700;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.search-input,
.specialty-select {
  padding: 0.7rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  transition: 0.3s;
}

.search-input:focus,
.specialty-select:focus {
  border-color: #ffcc00;
  box-shadow: 0 0 4px rgba(255, 204, 0, 0.4);
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
  background: #ffcc00;
  border: none;
  padding: 0.55rem 1.2rem;
  border-radius: 0.4rem;
  cursor: pointer;
}

.pagination button:disabled {
  background: #ddd;
}

.page-btn {
  min-width: 40px;
  background: #fff !important;
  color: #111827 !important;
  border: 1px solid #e5e7eb !important;
  padding: 0.45rem 0.75rem;
  border-radius: 0.45rem;
}

.page-btn.active {
  background: var(--support-purple, #6d28d9) !important;
  color: #fff !important;
  border-color: var(--support-purple, #6d28d9) !important;
}

.page-btn:hover,
.page-btn:focus-visible {
  border-color: var(--support-purple, #6d28d9) !important;
  box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.25);
}

.page-btn:focus-visible {
  outline: 2px solid transparent;
}

.booking-summary {
  margin-top: 2rem;
  background: #fff;
  padding: 1.3rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.booking-summary ul {
  padding: 0;
  list-style: none;
}

.clear-btn {
  background: #ffcc00;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
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
}

@media (max-width: 480px) {
  .cards .cards-container {
    grid-template-columns: 1fr;
  }
}

</style>
