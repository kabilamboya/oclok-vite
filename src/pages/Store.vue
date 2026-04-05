<template>
  <div class="products-page">

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

  </div>
</template>

<script>
import CardList from "../components/CardList.vue";
import PaginationControls from "../components/PaginationControls.vue";
import productsData from "../data/products.json";
import { computed, ref, watch } from "vue";

export default {
  name: "ProductsPage",
  components: { CardList, PaginationControls },

  setup() {
    const products = ref([]);
    const loading = ref(true);
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const currentPage = ref(1);
    const cart = ref(JSON.parse(localStorage.getItem("cart")) || []);
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

    const addToCart = (product) => {
      const itemIndex = cart.value.findIndex((i) => i.id === product.id);
      if (itemIndex !== -1) {
        cart.value[itemIndex].quantity += 1;
      } else {
        cart.value.push({
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

      saveCart(`${product?.name || "Item"} added to cart`);
      try {
        window.navigator.vibrate?.(10);
      } catch (_error) {
        // Ignore unsupported vibration API.
      }
    };

    const saveCart = (message) => {
      localStorage.setItem("cart", JSON.stringify(cart.value));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart:updated"));
        if (message) {
          window.dispatchEvent(new CustomEvent("cart:notify", { detail: { message } }));
        }
      }
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
      pageSize,
      categories,
      filteredProducts,
      totalPages,
      paginatedProducts,
      normalizeProduct,
      goToProduct,
      onFilterChange,
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
  align-items: center;
}

.search-wrapper {
  display: flex;
  gap: 5px;
}

.search-bar {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
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
  transition: brightness 0.15s ease;
}

.search-btn:hover {
  brightness: 1.1;
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
