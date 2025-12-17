<template>
  <div class="gallery-page">
    <section class="gallery-hero">
      <h1>Design Gallery</h1>
      <p>Explore posters, logos, social media kits, and branding designs.</p>
    </section>

    <div class="controls">
      <input 
        type="text" 
        v-model="searchQuery" 
        class="search-bar"
        placeholder="Search designs..."
      />

      <select v-model="selectedCategory" class="filter-select">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat">{{ cat }}</option>
      </select>
    </div>

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

    <p v-if="filteredDesigns.length === 0" class="empty">
      No designs match your search.
    </p>
  </div>
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
    // Load gallery safely at runtime
    try {
      const res = await fetch("/gallery.json");
      this.designs = await res.json();
    } catch (err) {
      console.error("Failed to load gallery.json", err);
    }
  },

  computed: {
    categories() {
      const set = new Set(this.designs.map(d => d.category));
      return Array.from(set);
    },

    filteredDesigns() {
      return this.designs.filter((design) => {
        const matchesCategory =
          this.selectedCategory === "" ||
          design.category === this.selectedCategory;

        const matchesSearch = design.title
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
      });
    }
  }
};
</script>

<style scoped>
/* (same styles — unchanged) */
.gallery-page {
  padding: 20px;
}
.gallery-hero {
  text-align: center;
  padding: 40px 10px;
}
.gallery-hero h1 {
  font-size: 2.2rem;
  margin-bottom: 10px;
}
.controls {
  display: flex;
  gap: 15px;
  margin: 20px 0;
  justify-content: center;
}
.search-bar, .filter-select {
  padding: 10px;
  border: 1px solid #aaa;
  border-radius: 6px;
  font-size: 1rem;
}
.grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  padding: 20px 0;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  transition: 0.25s;
}
.card:hover {
  transform: translateY(-4px);
}
.card img {
  width: 100%;
  border-radius: 10px;
  height: 160px;
  object-fit: cover;
}
.card .category {
  color: #888;
  font-size: 0.9rem;
}
.empty {
  text-align: center;
  padding: 30px;
  color: #555;
}
</style>
