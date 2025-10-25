<template>
  <div class="products-page">
    <h1 class="page-title">Our Products</h1>

    <!-- 🔍 Search + Filters -->
    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search products..."
        class="search-bar"
      />

      <select v-model="selectedCategory" class="filter-dropdown">
        <option value="">All Categories</option>
        <option
          v-for="cat in categories"
          :key="cat"
          :value="cat"
        >
          {{ cat }}
        </option>
      </select>

      <select v-model="selectedBrand" class="filter-dropdown">
        <option value="">All Brands</option>
        <option
          v-for="brand in brands"
          :key="brand"
          :value="brand"
        >
          {{ brand }}
        </option>
      </select>

      <select v-model="sortOption" class="filter-dropdown">
        <option value="">Sort by</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="nameAsc">Name: A–Z</option>
        <option value="nameDesc">Name: Z–A</option>
      </select>
    </div>

    <!-- 🧩 Product Grid -->
    <div v-if="filteredProducts.length" class="product-grid">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="product-card fade-in"
        @click="goToProduct(product.id)"
      >
        <div class="image-container">
          <img
            :src="product.image"
            :alt="product.name"
            loading="lazy"
          />
        </div>
        <h2>{{ product.name }}</h2>
        <p class="category">{{ product.category }}</p>
        <p class="brand">{{ product.brand }}</p>
        <p class="price">Ksh {{ product.price.toLocaleString() }}</p>
      </div>
    </div>

    <!-- 🚫 No Results -->
    <div v-else class="no-results">No products found matching your filters.</div>

    <!-- 📄 Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button @click="prevPage" :disabled="currentPage === 1">Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Products",
  data() {
    return {
      products: [],
      searchQuery: "",
      selectedBrand: "",
      selectedCategory: "",
      sortOption: "",
      currentPage: 1,
      pageSize: 8,
    };
  },
  computed: {
    brands() {
      return [...new Set(this.products.map((p) => p.brand))];
    },
    categories() {
      return [...new Set(this.products.map((p) => p.category || "Uncategorized"))];
    },
    filteredProducts() {
      let results = this.products.filter((p) => {
        const matchesSearch = p.name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
        const matchesBrand = this.selectedBrand
          ? p.brand === this.selectedBrand
          : true;
        const matchesCategory = this.selectedCategory
          ? p.category === this.selectedCategory
          : true;
        return matchesSearch && matchesBrand && matchesCategory;
      });

      // Sorting
      if (this.sortOption === "priceAsc")
        results.sort((a, b) => a.price - b.price);
      else if (this.sortOption === "priceDesc")
        results.sort((a, b) => b.price - a.price);
      else if (this.sortOption === "nameAsc")
        results.sort((a, b) => a.name.localeCompare(b.name));
      else if (this.sortOption === "nameDesc")
        results.sort((a, b) => b.name.localeCompare(a.name));

      return results;
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.pageSize) || 1;
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredProducts.slice(start, start + this.pageSize);
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await fetch("/products.json");
        this.products = await response.json();
      } catch (error) {
        console.error("Error loading products:", error);
      }
    },
    goToProduct(id) {
      this.$router.push(`/products/${id}`);
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    selectedBrand() {
      this.currentPage = 1;
    },
    selectedCategory() {
      this.currentPage = 1;
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.products-page {
  padding: 40px;
  background: #fafafa;
  min-height: 100vh;
}

.page-title {
  text-align: center;
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 25px;
  color: #333;
}

/* Filters */
.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-bottom: 25px;
}

.search-bar,
.filter-dropdown {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  min-width: 180px;
  font-size: 0.95em;
}

/* Product Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  padding: 0 20px;
}

.product-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
}

.image-container {
  height: 180px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category {
  font-size: 0.9em;
  color: #777;
  margin-bottom: 5px;
}

.brand {
  font-size: 0.95em;
  color: #555;
}

.price {
  font-weight: 600;
  color: #009688;
  margin-top: 8px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 30px 0;
}

.pagination button {
  background: #009688;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.pagination button:hover {
  background: #00796b;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Animation */
.fade-in {
  opacity: 0;
  animation: fadeIn 0.6s forwards;
}
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
