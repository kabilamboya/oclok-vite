<template>

  <section class="hero" aria-hidden="false">
    <div class="hero-text">
      <h1>Our Certified O!clok Doctors</h1>
      <p>Available remotely at your convenience</p>
    </div>
  </section>

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

    <div class="cards">
      <div
        v-for="tech in paginatedTechnicians"
        :key="tech.id"
        class="card"
        @click="goToTech(tech)"
      >
        <img
          v-if="tech.image"
          :src="tech.image"
          :alt="tech.name"
          class="avatar"
          loading="lazy"
        />

        <h3>{{ tech.name }}</h3>
        <p class="spec">{{ tech.specialty }}</p>

        <div class="rating" :aria-label="`Rating: ${averageRating(tech).toFixed(1)} / 5`">
          <span
            v-for="i in 5"
            :key="i"
            class="star"
            :class="{ filled: i <= Math.round(averageRating(tech)) }"
          >*</span>
          <small>{{ averageRating(tech).toFixed(1) }}</small>
        </div>

        <button
          class="book-btn"
          @click.stop="bookTechnician(tech)"
        >
          Book
        </button>
      </div>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button :disabled="currentPage === 1" @click="currentPage--">Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
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
import techniciansData from "../data/technicians.json";

const defaultRatings = {
  app: 0,
  skills: 0,
  customer: 0,
};

export default {
  name: "Technicians",

  data() {
    return {
      technicians: [],
      searchQuery: "",
      selectedSpecialty: "",
      bookings: [],
      currentPage: 1,
      itemsPerPage: 30,
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

    averageRating(tech) {
      const ratings = tech?.ratings || defaultRatings;
      const values = Object.values(ratings)
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value));

      if (!values.length) return 0;
      return values.reduce((sum, value) => sum + value, 0) / values.length;
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
    this.technicians = (techniciansData || []).map((tech) => ({
      ...tech,
      slug: tech.slug || this.createSlug(tech.name) || String(tech.id),
      ratings: {
        ...defaultRatings,
        ...(tech.ratings || {}),
      },
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1.5rem;
}

.card {
  background: #fff;
  padding: 1.2rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: 0.25s ease;
  text-align: center;
}

.card:hover {
  transform: translateY(-5px);
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.5rem;
}

.spec {
  color: #666;
  font-size: 0.95rem;
}

.rating {
  margin: 0.4rem 0;
}

.star {
  color: #ccc;
  font-size: 1rem;
}

.star.filled {
  color: #ffb400;
}

.book-btn {
  background: #ffcc00;
  border: none;
  padding: 0.45rem 1.2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.book-btn:hover {
  background: #ffd633;
}

.pagination {
  margin: 2rem auto;
  display: flex;
  gap: 1.2rem;
  font-weight: 600;
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

</style>
