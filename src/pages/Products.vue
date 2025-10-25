<template>
  <div class="products-page">
    <!-- Hero Banner -->
    <section class="hero">
      <div class="hero-text">
        <h1>Our Products</h1>
        <p>Explore smart solutions designed for you.</p>
      </div>
    </section>

    <!-- Filters -->
    <div class="filters">
      <input 
        type="text" 
        v-model="searchQuery" 
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
    </div>

    <!-- Products Grid -->
    <div class="products-grid">
      <div 
        v-for="product in paginatedProducts" 
        :key="product.id" 
        class="product-card"
      >
        <img :src="product.image" :alt="product.title" class="product-image" />
        <h3>{{ product.title }}</h3>
        <p>{{ product.category }}</p>
        <p class="price">Ksh {{ product.price }}</p>
      </div>

      <!-- Keep grid size even if no results -->
      <div 
        v-for="n in emptySlots" 
        :key="'empty-' + n" 
        class="product-card empty"
      >
        <p>No product</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1"
      >
        Prev
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
      >
        Next
      </button>
    </div>
    
    <!-- Footer -->
    <footer class="footer">
      <!-- ... footer content stays same ... -->
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      searchQuery: "",
      selectedCategory: "",
      currentPage: 1,
      pageSize: 8
    };
  },
  computed: {
    categories() {
      return [...new Set(this.products.map(p => p.category))];
    },
    filteredProducts() {
      return this.products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory = this.selectedCategory ? p.category === this.selectedCategory : true;
        return matchesSearch && matchesCategory;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.pageSize) || 1;
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredProducts.slice(start, start + this.pageSize);
    },
    emptySlots() {
      return this.pageSize - this.paginatedProducts.length;
    }
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },
  mounted() {
    fetch("/products.json")
      .then(res => res.json())
      .then(data => {
        this.products = data;
      })
      .catch(err => console.error("Error loading products:", err));
  }
};
</script>

<style scoped>
.hero {
  background: #333;
  color: white;
  padding: 40px 20px;
  text-align: center;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
}

.search-bar {
  padding: 8px;
  width: 200px;
}

.filter-dropdown {
  padding: 8px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
}

.product-card {
  border: 1px solid #ddd;
  padding: 15px;
  text-align: center;
  border-radius: 8px;
}

.product-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.product-card.empty {
  background: #f9f9f9;
  color: #aaa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.price {
  font-weight: bold;
  margin-top: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
}

.pagination button {
  padding: 6px 12px;
  cursor: pointer;
}
</style>
