<template>
  <div class="page">
    <h1 class="title">Our Technicians</h1>

    <!-- Search & Filters -->
    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search technicians..."
        class="search-input"
      />

      <select v-model="selectedSpecialty" class="specialty-select">
        <option value="">All Specialties</option>
        <option v-for="spec in specialties" :key="spec" :value="spec">{{ spec }}</option>
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
      <h2>Bookings ({{ bookings.length }})</h2>
      <ul>
        <li v-for="tech in bookings" :key="tech.id">
          {{ tech.name }} - {{ tech.specialty }}
        </li>
      </ul>
    </div>
    
    <!-- Footer -->
    <footer class="footer">
      <!-- ... footer content stays same ... -->
    </footer>
  </div>
</template>

<script>
import technicians from "../data/technicians.json";
import CardItem from "../components/CardItem.vue";

export default {
  name: "Technicians",
  components: { CardItem },
  data() {
    return {
      technicians,
      searchQuery: "",
      selectedSpecialty: "",
      bookings: [],
    };
  },
  computed: {
    specialties() {
      return [...new Set(this.technicians.map((t) => t.specialty))];
    },
    filteredTechnicians() {
      return this.technicians.filter((t) => {
        const matchesSearch = t.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesSpecialty = this.selectedSpecialty ? t.specialty === this.selectedSpecialty : true;
        return matchesSearch && matchesSpecialty;
      });
    },
  },
  methods: {
    bookTechnician(tech) {
      if (!this.bookings.includes(tech)) {
        this.bookings.push(tech);
      }
    },
  },
};
</script>

<style scoped>
.page {
  padding: 2rem;
}

.title {
  text-align: center;
  margin-bottom: 1rem;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input,
.specialty-select {
  padding: 0.5rem;
  font-size: 1rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.booking-summary {
  margin-top: 2rem;
  padding: 1rem;
  border-top: 1px solid #ccc;
}
</style>
