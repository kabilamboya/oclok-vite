<template>
  <div class="page">
    <!-- Title -->
    <h1 class="title">Our Certified O!clok Doctors</h1>

    <!-- Filters -->
    <div class="filters">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="🔍 Search technicians..."
        class="search-input"
      />

      <select v-model="selectedSpecialty" class="specialty-select">
        <option value="">All Specialties</option>
        <option
          v-for="spec in specialties"
          :key="spec"
          :value="spec"
        >
          {{ spec }}
        </option>
      </select>
    </div>

    <!-- Technicians Grid -->
    <div class="cards">
      <div 
        v-for="tech in paginatedTechnicians"
        :key="tech.id"
        class="card"
        @click="goToTech(tech)"
      >
        <img 
          :src="tech.image" 
          :alt="tech.name"
          class="avatar"
          loading="lazy"
        />

        <h3>{{ tech.name }}</h3>
        <p class="spec">{{ tech.specialty }}</p>

        <!-- Rating -->
        <div class="rating" :aria-label="`Rating: ${averageRating(tech).toFixed(1)} / 5`">
          <span
            v-for="i in 5"
            :key="i"
            class="star"
            :class="{ filled: i <= Math.round(averageRating(tech)) }"
          >★</span>
          <small>{{ averageRating(tech).toFixed(1) }}</small>
        </div>

        <!-- Book Button -->
        <button 
          class="book-btn"
          @click.stop="bookTechnician(tech)"
        >
          Book
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button :disabled="currentPage === 1" @click="currentPage--">⟨ Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">Next ⟩</button>
    </div>

    <!-- Booking Summary -->
    <div v-if="bookings.length" class="booking-summary">
      <h2>📋 Bookings ({{ bookings.length }})</h2>

      <ul role="list">
        <li v-for="tech in bookings" :key="tech.id" role="listitem">
          {{ tech.name }} — <strong>{{ tech.specialty }}</strong>
        </li>
      </ul>

      <button class="clear-btn" @click="clearBookings">Clear All</button>
    </div>

    <footer class="footer">
      <p>© {{ new Date().getFullYear() }} O!clok Services — All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script>
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
      return [...new Set(this.technicians.map((t) => t.specialty))];
    },

    filteredTechnicians() {
      return this.technicians.filter((t) => {
        const search = t.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        const specialty = this.selectedSpecialty
          ? t.specialty.toLowerCase() === this.selectedSpecialty.toLowerCase()
          : true;
        return search && specialty;
      });
    },

    totalPages() {
      return Math.ceil(this.filteredTechnicians.length / this.itemsPerPage);
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
    }
  },

  methods: {
    /** Navigate to technician detail using slug */
    goToTech(tech) {
      this.$router.push(`/technicians/${tech.slug}`);
    },

    /** Safe Rating Calculation */
    averageRating(tech) {
      if (!tech.ratings) return 0;
      const values = Object.values(tech.ratings);
      if (!values.length) return 0;
      return values.reduce((a, b) => a + b, 0) / values.length;
    },

    /** Booking System */
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
    fetch("/technicians.json")
      .then((res) => res.json())
      .then((data) => {
        this.technicians = data;
      })
      .catch((err) => {
        console.error("Error loading technicians:", err);
      });
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

/* Filters */
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

/* Cards Layout */
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

/* Rating */
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

/* Buttons */
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

/* Pagination */
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

/* Booking Summary */
.booking-summary {
  margin-top: 2rem;
  background: #fff;
  padding: 1.3rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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

/* Footer */
.footer {
  margin-top: auto;
  padding: 1.2rem 0;
  text-align: center;
  border-top: 1px solid #ddd;
  color: #666;
}
</style>
