<template>
  <section class="gallery-page">
    <!-- Hero -->
    <section class="gallery-hero">
      <h1>Design Gallery</h1>
      <p>Explore posters, logos, social media kits, and branding designs.</p>
    </section>

    <!-- Controls -->
    <div class="controls">
      <input
        type="text"
        v-model="searchQuery"
        class="search-bar"
        placeholder="Search designs..."
      />

      <select v-model="selectedCategory" class="filter-select">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat">
          {{ cat }}
        </option>
      </select>
    </div>

    <!-- Grid -->
    <div class="grid">
      <div
        class="card"
        v-for="design in filteredDesigns"
        :key="design.id"
      >
        <img :src="design.image" :alt="design.title" />
        <h3>{{ design.title }}</h3>
        <p class="category">{{ design.category }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <p v-if="filteredDesigns.length === 0" class="empty">
      No designs match your search.
    </p>
  </section>
</template>

<script>
export default {
  name: "DesignGallery",

  data() {
    return {
      designs: [],
      searchQuery: "",
      selectedCategory: ""
    };
  },

  async created() {
    try {
      const res = await fetch("/gallery.json");
      this.designs = await res.json();
    } catch (err) {
      console.error("Failed to load gallery.json", err);
    }
  },

  computed: {
    categories() {
      return [...new Set(this.designs.map(d => d.category))];
    },

    filteredDesigns() {
      return this.designs.filter(design => {
        const matchesCategory =
          !this.selectedCategory ||
          design.category === this.selectedCategory;

        const matchesSearch =
          design.title
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
      });
    }
  }
};
</script>

<style scoped>
.gallery-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #f0f0f0;
  background-color: #121212;
  border-radius: 10px;
}

/* Hero */
.gallery-hero {
  text-align: center;
  padding: 40px 10px;
}
.gallery-hero h1 {
  font-size: 2.2rem;
  color: #ffd600;
  margin-bottom: 10px;
}
.gallery-hero p {
  color: #ccc;
  font-size: 1rem;
}

/* Controls */
.controls {
  display: flex;
  gap: 15px;
  margin: 20px 0;
  justify-content: center;
  flex-wrap: wrap;
}
.search-bar,
.filter-select {
  padding: 10px;
  border: 1px solid #ffd600;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #1c1c1c;
  color: #fff;
}

.search-bar::placeholder {
  color: #aaa;
}

/* Grid */
.grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  padding: 20px 0;
}

/* Cards */
.card {
  background: #1c1c1c;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.5);
  transition: 0.25s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.7);
}
.card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
}
.card h3 {
  margin: 10px 0 5px;
  color: #ffd600;
}
.card .category {
  color: #888;
  font-size: 0.9rem;
}

/* Empty */
.empty {
  text-align: center;
  padding: 30px;
  color: #aaa;
}
</style>
