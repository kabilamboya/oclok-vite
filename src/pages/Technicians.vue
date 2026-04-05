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

    <PaginationControls
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @update:current-page="currentPage = $event"
    />

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
      const searchQuery = ref("");
      const selectedSpecialty = ref("");
      const bookings = ref([]);
      const currentPage = ref(1);
      const itemsPerPage = 8;

      const specialties = computed(() => {
        return [...new Set(technicians.value.map((t) => t.specialty).filter(Boolean))];
      });

      const filteredTechnicians = computed(() => {
        const query = searchQuery.value.trim().toLowerCase();
        return technicians.value.filter((t) => {
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
        return Math.max(1, Math.ceil(filteredTechnicians.value.length / itemsPerPage));
      });

      const paginatedTechnicians = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        return filteredTechnicians.value.slice(start, start + itemsPerPage);
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
        filteredTechnicians,
        totalPages,
        paginatedTechnicians,
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
