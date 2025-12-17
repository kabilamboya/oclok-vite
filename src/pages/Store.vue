<template>
  <div class="products-page">

    <!-- Hero Banner -->
    <section class="hero" aria-hidden="false">
      <div class="hero-text">
        <h1>O!clok Store — delivered by Delibois</h1>
        <p>Explore smart and innovative solutions designed for you.</p>
      </div>
    </section>

    <!-- Filters -->
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

    <!-- Products Grid -->
    <div class="products-grid" aria-live="polite">
      <!-- Skeleton Loader -->
      <div v-if="loading" class="product-card skeleton" v-for="n in 8" :key="'skeleton-' + n" aria-hidden="true"></div>

      <!-- No results -->
      <div v-if="!loading && filteredProducts.length === 0" class="no-results" role="status">
        <p>No products match your search.</p>
      </div>

      <!-- Products -->
      <div
        v-if="!loading"
        v-for="product in paginatedProducts"
        :key="product.id"
        class="product-card"
      >
        <!-- Image -> product details -->
        <RouterLink :to="`/product/${product.id}`" class="image-link" :aria-label="`Open ${product.name} details`">
          <img
            :src="product.image"
            :alt="product.name"
            class="product-image"
            loading="lazy"
          />
        </RouterLink>

        <div class="info">
          <h3 class="product-title">{{ product.name }}</h3>
          <p class="category">{{ product.category }}</p>
          <p class="price">Ksh {{ product.price.toLocaleString() }}</p>

          <div class="card-actions">
            <button class="add-cart-btn" @click="addToCart(product)" :aria-label="`Add ${product.name} to cart`">
              Add to Cart
            </button>

            <RouterLink :to="`/product/${product.id}`" class="details-link" aria-label="View details">
              View
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && totalPages > 1" class="pagination" aria-label="Pagination">
      <button @click="prevPage" :disabled="currentPage === 1">← Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next →</button>
    </div>

    <!-- Floating cart button -->
    <button
      class="floating-cart"
      @click="openCart"
      :aria-label="`Open cart with ${cartCount} items`"
      v-if="cartCount > 0"
    >
      🛒 <span class="badge">{{ cartCount }}</span>
    </button>

    <!-- Cart Modal (uses your CartModal component) -->
    <CartModal
      :cart="cart"
      :isOpen="isCartOpen"
      @close="closeCart"
      @increase="increaseQty"
      @decrease="decreaseQty"
      @remove="removeItem"
      @checkout="goToCheckout"
    />

    <footer class="footer">
      <!-- your footer content -->
    </footer>
  </div>
</template>

<script>
import CartModal from "../components/CartModal.vue";

export default {
  name: "ProductsPage",
  components: { CartModal },

  data() {
    return {
      products: [],
      loading: true,
      searchQuery: "",
      selectedCategory: "",
      currentPage: 1,
      pageSize: 12,
      cart: JSON.parse(localStorage.getItem("cart")) || [],
      isCartOpen: false,
    };
  },

  computed: {
    categories() {
      return [...new Set(this.products.map(p => p.category))].filter(Boolean);
    },

    filteredProducts() {
      const q = this.searchQuery.trim().toLowerCase();
      return this.products.filter(p => {
        const matchesSearch = q === "" || p.name.toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q);
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

    cartCount() {
      return this.cart.reduce((sum, i) => sum + (i.quantity || 1), 0);
    }
  },

  watch: {
    // reset page when filters/search change
    searchQuery() { this.currentPage = 1; },
    selectedCategory() { this.currentPage = 1; }
  },

  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    onFilterChange() {
      // keep it small and simple: reset pagination when filters change
      this.currentPage = 1;
    },

    addToCart(product) {
      // add minimal cart object to avoid dragging entire product data if undesirable
      const itemIndex = this.cart.findIndex(i => i.id === product.id);
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
          // preserve optional flags from your product schema
          file: product.file || false,
          isMockup: product.isMockup || false
        });
      }
      this.saveCart();
      // small confirm feedback
      try { window.navigator.vibrate?.(10); } catch(e) {}
      // open cart automatically (optional). comment out if you don't want this:
      // this.openCart();
      // friendly toast
      this.$nextTick(() => alert(`${product.name} added to cart!`));
    },

    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    // Cart modal controls
    openCart() { this.isCartOpen = true; },
    closeCart() { this.isCartOpen = false; },

    increaseQty(id) {
      const item = this.cart.find(i => i.id === id);
      if (item) item.quantity++;
      this.saveCart();
    },

    decreaseQty(id) {
      const item = this.cart.find(i => i.id === id);
      if (!item) return;
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        this.removeItem(id);
      }
      this.saveCart();
    },

    removeItem(id) {
      this.cart = this.cart.filter(i => i.id !== id);
      this.saveCart();
    },

    goToCheckout() {
      // Persist cart (already saved) and navigate to checkout route
      this.closeCart();
      this.$router.push({ path: "/checkout", query: { from: "cart" } });
    }
  },

  mounted() {
    // small delay for nicer skeleton effect (keeps compatibility)
    setTimeout(() => {
      fetch("/products.json")
        .then(res => res.json())
        .then(data => {
          this.products = data || [];
          this.loading = false;
        })
        .catch(err => {
          console.error("Error loading products:", err);
          this.loading = false;
        });
    }, 500);
  }
};
</script>

<style scoped>
/* Basic layout + hero */
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
  transition: box-shadow .15s;
}

.search-bar:focus,
.filter-dropdown:focus {
  outline: none;
  box-shadow: 0 6px 18px rgba(37,99,235,0.08);
}

/* PRODUCTS GRID */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 18px;
  padding: 10px;
}

/* Product card */
.product-card {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.image-link {
  display: block;
  width: 100%;
  flex: 0 0 auto;
}

.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

/* Info */
.info {
  padding: 14px;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  justify-content: space-between;
}

.product-title {
  font-size: 1rem;
  margin: 0 0 6px 0;
  font-weight: 700;
}

.category {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 8px;
}

.price {
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

/* Actions */
.card-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.add-cart-btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: #10b981;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  flex: 1 1 auto;
}

.add-cart-btn:hover { background: #0ea46e; transform: translateY(-1px); }

.details-link {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 8px;
  text-decoration: none;
  background: transparent;
  color: #374151;
  border: 1px solid #e5e7eb;
  font-weight: 600;
}

/* Skeleton */
.skeleton {
  height: 250px;
  background: linear-gradient(90deg, #f2f2f2 0%, #e8e8e8 50%, #f2f2f2 100%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 18px 0;
}

/* Floating cart */
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

/* Responsive tweaks */
@media (max-width: 768px) {
  .product-image { height: 160px; }
  .products-grid { gap: 14px; }
}
</style>
