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
      <CardItem
        v-for="tech in filteredTechnicians"
        :key="tech.id"
        :item="tech"
        type="technicians"
        @book="bookTechnician"
      />
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
import CardItem from "../components/CardItem.vue";

export default {
  name: "Technicians",
  components: { CardItem },
  data() {
    return {
      technicians: [],
      searchQuery: "",
      selectedSpecialty: "",
      bookings: [],
    };
  },
  computed: {
    specialties() {
      // Get unique specialties dynamically
      return [...new Set(this.technicians.map((t) => t.specialty))];
    },
    filteredTechnicians() {
      // Filter by name and specialty
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
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
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
