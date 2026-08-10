<template>
  <div class="products-page">

    <header class="store-intro">
      <p class="eyebrow">O!clok marketplace</p>
      <h1>Learn, build, and wear your ideas.</h1>
      <p>Shop practical learning content, stationery, trusted tutors, smart electronics, and O!clok branded essentials.</p>
      <router-link to="/account" class="account-cta">
        <span>Create Account</span>
        <small>Join O!clok</small>
      </router-link>
    </header>

    <nav class="category-chips" aria-label="Shop by category">
      <button class="category-chip" :class="{ active: selectedCategory === '' }" type="button" @click="selectCategory('')">
        Everything
      </button>
      <button
        v-for="category in categories"
        :key="category"
        class="category-chip"
        :class="{ active: selectedCategory === category }"
        type="button"
        @click="selectCategory(category)"
      >
        {{ category }}
      </button>
    </nav>

    <div class="filters" role="search" aria-label="Product filters">
      <div class="search-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="search-bar"
          @input="onFilterChange"
          @keyup.enter="onFilterChange"
          aria-label="Search products"
        />
        <button class="search-btn" @click="onFilterChange">🔍</button>
      </div>

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

      <QuickOrderForm title="Need help with an order?" subtitle="Tell us what you want and we will follow up." page="store" />

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

    <PaginationControls
      v-if="!loading && totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @update:current-page="currentPage = $event"
    />

    <button class="floating-cart" type="button" aria-label="Open shopping cart" @click="isCartOpen = true">
      🛒 Cart
      <span class="badge">{{ cartItemCount }}</span>
    </button>

    <CartModal
      :cart="cart"
      :is-open="isCartOpen"
      @close="isCartOpen = false"
      @increase="increaseQty"
      @decrease="decreaseQty"
      @remove="removeItem"
      @checkout="goToCheckout"
    />

  </div>
</template>

<script>
import CardList from "../components/CardList.vue";
import CartModal from "../components/CartModal.vue";
import PaginationControls from "../components/PaginationControls.vue";
import QuickOrderForm from "../components/QuickOrderForm.vue";
import productsData from "../data/products.json";
import { addProductToCart, persistCart, readCart } from "../services/cart.service";
import { computed, ref, watch } from "vue";

export default {
  name: "ProductsPage",
  components: { CardList, PaginationControls, CartModal, QuickOrderForm },

  setup() {
    const products = ref([]);
    const loading = ref(true);
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const currentPage = ref(1);
    const cart = ref(readCart());
    const isCartOpen = ref(false);
    const pageSize = 12;

    const categories = computed(() => {
      return [...new Set(products.value.map((p) => p.category))].filter(Boolean);
    });

    const filteredProducts = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      return products.value.filter((p) => {
        const productName = (p.name || "").toLowerCase();
        const productCategory = (p.category || "").toLowerCase();
        const matchesSearch = q === "" || productName.includes(q) || productCategory.includes(q);
        const matchesCategory = selectedCategory.value ? p.category === selectedCategory.value : true;
        return matchesSearch && matchesCategory;
      });
    });

    const totalPages = computed(() => {
      return Math.max(1, Math.ceil(filteredProducts.value.length / pageSize));
    });

    const cartItemCount = computed(() => cart.value.reduce((total, item) => total + (Number(item.quantity) || 0), 0));

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return filteredProducts.value.slice(start, start + pageSize);
    });

    watch(searchQuery, () => {
      currentPage.value = 1;
    });

    watch(selectedCategory, () => {
      currentPage.value = 1;
    });

    watch(totalPages, (newTotal) => {
      if (currentPage.value > newTotal) {
        currentPage.value = newTotal;
      }
    });

    const normalizeProduct = (product) => {
      const numericPrice = Number(product?.price);
      return {
        ...product,
        price: Number.isFinite(numericPrice) ? numericPrice : 0,
      };
    };

    const goToProduct = (product) => {
      if (!product?.id) return;
      window.location.href = `/products/${product.id}`;
    };

    const onFilterChange = () => {
      currentPage.value = 1;
    };

    const selectCategory = (category) => {
      selectedCategory.value = category;
      currentPage.value = 1;
    };

    const addToCart = (product) => {
      cart.value = addProductToCart(cart.value, product);
      persistCart(cart.value, `${product?.name || "Item"} added to cart`);
      try {
        window.navigator.vibrate?.(10);
      } catch (_error) {
        // Ignore unsupported vibration API.
      }
    };

    const saveCart = (message) => {
      persistCart(cart.value, message);
    };

    const increaseQty = (id) => {
      const item = cart.value.find((i) => i.id === id);
      if (item) item.quantity++;
      saveCart();
    };

    const decreaseQty = (id) => {
      const item = cart.value.find((i) => i.id === id);
      if (!item) return;

      if (item.quantity > 1) {
        item.quantity--;
      } else {
        removeItem(id);
      }

      saveCart();
    };

    const removeItem = (id) => {
      cart.value = cart.value.filter((i) => i.id !== id);
      saveCart();
    };

    const goToCheckout = () => {
      window.location.href = "/checkout?from=cart";
    };

    setTimeout(() => {
      products.value = (productsData || []).map((item) => normalizeProduct(item));
      loading.value = false;
    }, 500);

    return {
      products,
      loading,
      searchQuery,
      selectedCategory,
      currentPage,
      cart,
      isCartOpen,
      cartItemCount,
      pageSize,
      categories,
      filteredProducts,
      totalPages,
      paginatedProducts,
      normalizeProduct,
      goToProduct,
      onFilterChange,
      selectCategory,
      addToCart,
      saveCart,
      increaseQty,
      decreaseQty,
      removeItem,
      goToCheckout,
    };
  },
};
</script>

<style scoped>
.store-intro {
  max-width: 760px;
  margin: 28px auto 8px;
  padding: 32px 24px 20px;
  text-align: center;
}

.store-intro .eyebrow {
  margin: 0 0 8px;
  color: #ff6600;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.store-intro h1 {
  margin: 0;
  color: #111827;
  font-size: clamp(2rem, 5vw, 3.8rem);
  line-height: 1;
}

.store-intro > p:last-child {
  max-width: 590px;
  margin: 18px auto 0;
  color: #5b6472;
  line-height: 1.6;
}

.category-chips {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 8px 20px 4px;
  flex-wrap: wrap;
}

.category-chip {
  border: 1px solid #d7dce3;
  border-radius: 999px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 9px 14px;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.category-chip:hover,
.category-chip.active {
  border-color: #111827;
  background: #111827;
  color: #fff;
}

.hero {
  padding: 48px 20px;
  text-align: center;
  background: linear-gradient(180deg, var(--surface-alt) 0%, var(--surface) 100%);
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 18px 0;
  flex-wrap: wrap;
  align-items: center;
}

.search-wrapper {
  display: flex;
  gap: 5px;
}

.search-bar {
  padding: 10px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  min-width: 180px;
  transition: box-shadow 0.15s;
}

.search-bar:focus {
  outline: none;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.08);
}

.search-btn {
  padding: 10px 12px;
  background: #ff6600;
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  transition: filter 0.15s ease;
}

.search-btn:hover {
  filter: brightness(1.1);
}

.filter-dropdown {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.15s;
}

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
