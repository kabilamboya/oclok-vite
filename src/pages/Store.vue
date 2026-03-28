<template>
  <div class="products-page">

    <div class="filters" role="search" aria-label="Product filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search products..."
        class="search-bar"
        @input="onFilterChange"
        aria-label="Search products"
      />

      <select v-model="selectedCategory" class="filter-dropdown" @change="onFilterChange" aria-label="Filter by category">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
    </div>

    <div class="products-grid" aria-live="polite">
      <div v-if="loading" class="product-card skeleton" v-for="n in 8" :key="`skeleton-${n}`" aria-hidden="true"></div>

      <div v-if="!loading && filteredProducts.length === 0" class="no-results" role="status">
        <p>No products match your search.</p>
      </div>

      <CardList
        v-if="!loading && filteredProducts.length"
        :card-items="paginatedProducts"
        type="product"
        :clickable="true"
        primary-label="Add to Cart"
        secondary-label="View"
        :show-rating="false"
        :show-experience="false"
        @primary="addToCart"
        @secondary="goToProduct"
        @select="goToProduct"
      />
    </div>

    <div v-if="!loading && totalPages > 1" class="pagination" aria-label="Pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Prev</button>
      <button
        v-for="page in visiblePages"
        :key="page"
        :class="['page-btn', { active: page === currentPage }]"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>

  </div>
</template>

  <script>
  import CardList from "../components/CardList.vue";
  import productsData from "../data/products.json";

  export default {
  name: "ProductsPage",
  components: { CardList },

  data() {
    return {
      products: [],
      loading: true,
      searchQuery: "",
      selectedCategory: "",
      currentPage: 1,
      pageSize: 12,
      cart: JSON.parse(localStorage.getItem("cart")) || [],
    };
  },

  computed: {
    categories() {
      return [...new Set(this.products.map((p) => p.category))].filter(Boolean);
    },

    filteredProducts() {
      const q = this.searchQuery.trim().toLowerCase();
      return this.products.filter((p) => {
        const productName = (p.name || "").toLowerCase();
        const productCategory = (p.category || "").toLowerCase();
        const matchesSearch = q === "" || productName.includes(q) || productCategory.includes(q);
        const matchesCategory = this.selectedCategory ? p.category === this.selectedCategory : true;
        return matchesSearch && matchesCategory;
      });
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
    },

    paginatedProducts() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredProducts.slice(start, start + this.pageSize);
    },

    visiblePages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const delta = 2;
      const start = Math.max(1, current - delta);
      const end = Math.min(total, current + delta);
      const pages = [];

      for (let page = start; page <= end; page += 1) {
        pages.push(page);
      }

      return pages;
    },

  },

  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    selectedCategory() {
      this.currentPage = 1;
    },
  },

  methods: {
    normalizeProduct(product) {
      const numericPrice = Number(product?.price);
      return {
        ...product,
        price: Number.isFinite(numericPrice) ? numericPrice : 0,
      };
    },

    goToProduct(product) {
      if (!product?.id) return;
      this.$router.push(`/products/${product.id}`);
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        console.log("[pagination][store] next ->", this.currentPage);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        console.log("[pagination][store] prev ->", this.currentPage);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    onFilterChange() {
      this.currentPage = 1;
    },

    goToPage(page) {
      this.currentPage = page;
      console.log("[pagination][store] page ->", this.currentPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    addToCart(product) {
      const itemIndex = this.cart.findIndex((i) => i.id === product.id);
      if (itemIndex !== -1) {
        this.cart[itemIndex].quantity += 1;
      } else {
        this.cart.push({
          id: product.id,
          name: product.name,
          title: product.name,
          price: product.price,
          image: product.image,
          thumbnail: product.image,
          quantity: 1,
          file: product.file || false,
          isMockup: product.isMockup || false,
        });
      }

      this.saveCart(`${product?.name || "Item"} added to cart`);
      try {
        window.navigator.vibrate?.(10);
      } catch (_error) {
        // Ignore unsupported vibration API.
      }
    },

    saveCart(message) {
      localStorage.setItem("cart", JSON.stringify(this.cart));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart:updated"));
        if (message) {
          window.dispatchEvent(new CustomEvent("cart:notify", { detail: { message } }));
        }
      }
    },

    openCart() {
      this.isCartOpen = true;
    },

    closeCart() {
      this.isCartOpen = false;
    },

    increaseQty(id) {
      const item = this.cart.find((i) => i.id === id);
      if (item) item.quantity++;
      this.saveCart();
    },

    decreaseQty(id) {
      const item = this.cart.find((i) => i.id === id);
      if (!item) return;

      if (item.quantity > 1) {
        item.quantity--;
      } else {
        this.removeItem(id);
      }

      this.saveCart();
    },

    removeItem(id) {
      this.cart = this.cart.filter((i) => i.id !== id);
      this.saveCart();
    },

    goToCheckout() {
      this.closeCart();
      this.$router.push({ path: "/checkout", query: { from: "cart" } });
    },
  },

  mounted() {
    setTimeout(() => {
      this.products = (productsData || []).map((item) => this.normalizeProduct(item));
      this.loading = false;
    }, 500);
  },
};
  </script>

<style scoped>
.hero {
  padding: 48px 20px;
  text-align: center;
  background: linear-gradient(180deg, #fafafa 0%, #fff 100%);
  border-radius: 8px;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 18px 0;
  flex-wrap: wrap;
}

.search-bar,
.filter-dropdown {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  min-width: 180px;
  transition: box-shadow 0.15s;
}

.search-bar:focus,
.filter-dropdown:focus {
  outline: none;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.08);
}

.products-grid .cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 18px;
  padding: 10px;
}

.skeleton {
  height: 250px;
  background: linear-gradient(90deg, #f2f2f2 0%, #e8e8e8 50%, #f2f2f2 100%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 18px 0;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 40px;
  background: #fff !important;
  color: #111827 !important;
  border: 1px solid #e5e7eb !important;
  padding: 0.45rem 0.75rem;
  border-radius: 0.45rem;
  font-weight: 600;
}

.page-btn.active {
  background: var(--support-purple, #6d28d9) !important;
  color: #fff !important;
  border-color: var(--support-purple, #6d28d9) !important;
}

.page-btn:hover,
.page-btn:focus-visible {
  border-color: var(--support-purple, #6d28d9) !important;
  box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.25);
}

.page-btn:focus-visible {
  outline: 2px solid transparent;
}

.floating-cart {
  position: fixed;
  right: 18px;
  bottom: 18px;
  background: #111827;
  color: #fff;
  padding: 12px 14px;
  border-radius: 999px;
  z-index: 1200;
  box-shadow: 0 8px 30px rgba(17, 24, 39, 0.24);
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  font-weight: 700;
}

.floating-cart .badge {
  background: #ef4444;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 0.85rem;
  color: white;
}

@media (max-width: 768px) {
  .product-image {
    height: 160px;
  }

  .products-grid {
    gap: 14px;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar,
  .filter-dropdown {
    width: 100%;
    min-width: 0;
  }

  .products-grid .cards-container {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    padding: 0;
  }
}

@media (max-width: 480px) {
  .pagination {
    gap: 8px;
  }

  .page-btn {
    min-width: 34px;
    padding: 0.4rem 0.6rem;
  }
}
</style>
