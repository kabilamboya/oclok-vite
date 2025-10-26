<template>
  <div class="page">
    <!-- Page Title -->
    <h1 class="title">Our Technicians</h1>

    <!-- Search & Filters -->
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
        @click="$router.push(`/technicians/${tech.id}`)"
      >
        <img :src="tech.image" :alt="tech.name" class="avatar" />
        <h3>{{ tech.name }}</h3>
        <p class="spec">{{ tech.specialty }}</p>

        <!-- Rating Stars -->
        <div class="rating">
          <span 
            v-for="i in 5" 
            :key="i" 
            class="star" 
            :class="{ filled: i <= Math.round(getAverageRating(tech.ratings)) }"
          >★</span>
          <small>{{ getAverageRating(tech.ratings).toFixed(1) }}</small>
        </div>

        <button 
          class="book-btn" 
          @click.stop="bookTechnician(tech)"
        >
          Book
        </button>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        :disabled="currentPage === 1" 
        @click="currentPage--"
      >⟨ Prev</button>

      <span>Page {{ currentPage }} of {{ totalPages }}</span>

      <button 
        :disabled="currentPage === totalPages" 
        @click="currentPage++"
      >Next ⟩</button>
    </div>

    <!-- Booking Summary -->
    <div v-if="bookings.length" class="booking-summary">
      <h2>📋 Bookings ({{ bookings.length }})</h2>
      <ul>
        <li v-for="tech in bookings" :key="tech.id">
          {{ tech.name }} — <strong>{{ tech.specialty }}</strong>
        </li>
      </ul>
      <button class="clear-btn" @click="clearBookings">Clear All</button>
    </div>

    <!-- Footer -->
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
      itemsPerPage: 50,
    };
  },
  computed: {
    specialties() {
      return [...new Set(this.technicians.map((t) => t.specialty))];
    },
    filteredTechnicians() {
      return this.technicians.filter((t) => {
        const matchesSearch = t.name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
        const matchesSpecialty = this.selectedSpecialty
          ? t.specialty === this.selectedSpecialty
          : true;
        return matchesSearch && matchesSpecialty;
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
  methods: {
    bookTechnician(tech) {
      if (!this.bookings.find((b) => b.id === tech.id)) {
        this.bookings.push(tech);
      }
    },
    clearBookings() {
      this.bookings = [];
    },
    getAverageRating(ratings) {
      if (!ratings) return 0;
      const values = Object.values(ratings);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      return avg;
    },
  },
  mounted() {
    fetch("/technicians.json")
      .then((res) => res.json())
      .then((data) => {
        this.technicians = data;
      })
      .catch((err) => console.error("Error loading technicians:", err));
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
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
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
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus,
.specialty-select:focus {
  border-color: #ffcc00;
  box-shadow: 0 0 4px rgba(255, 204, 0, 0.4);
}

/* Cards Grid */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.card {
  background: #fff;
  padding: 1.2rem;
  border-radius: 0.8rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: 0.3s;
}
.card:hover {
  transform: translateY(-3px);
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.5rem;
}

.spec {
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

/* Stars */
.star {
  color: #ccc;
  font-size: 1rem;
}
.star.filled {
  color: #ffb400;
}
.rating {
  margin: 0.4rem 0;
}

/* Buttons */
.book-btn {
  background: #ffcc00;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}
.book-btn:hover {
  background: #ffd633;
}

/* Pagination */
.pagination {
  margin: 2rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
.pagination button {
  background: #ffcc00;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.4rem;
  cursor: pointer;
  font-weight: 600;
}
.pagination button:disabled {
  background: #ddd;
  cursor: not-allowed;
}

/* Booking Summary */
.booking-summary {
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.8rem;
  margin-top: 2.5rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.booking-summary h2 {
  color: #222;
  margin-bottom: 0.8rem;
}

.booking-summary ul {
  list-style: none;
  padding: 0;
  margin-bottom: 1rem;
}

.booking-summary li {
  padding: 0.4rem 0;
  border-bottom: 1px solid #eee;
}

.clear-btn {
  background: #ffcc00;
  color: #000;
  border: none;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: 0.3s;
}
.clear-btn:hover {
  background: #ffdb4d;
}

/* Footer */
.footer {
  margin-top: auto;
  text-align: center;
  padding: 1.2rem 0;
  font-size: 0.9rem;
  color: #555;
  border-top: 1px solid #ddd;
}
</style>
