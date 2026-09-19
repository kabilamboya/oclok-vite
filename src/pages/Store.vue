<template>
  <div class="products-page">
    <header class="store-intro">
      <p class="eyebrow">O!clok marketplace</p>
      <h1>Learn, build, and wear your ideas.</h1>
      <p>Shop practical learning content, stationery, trusted tutors, smart electronics, and O!clok branded essentials.</p>
    </header>

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

      <div class="multi-filter-wrap">
        <label class="multi-filter-label" for="store-section-filter">Sections</label>
        <select
          id="store-section-filter"
          v-model="selectedFilterGroup"
          class="filter-dropdown multi-filter-select"
          aria-label="Select a store section or subgroup"
        >
          <option value="everything">Everything</option>
          <option value="tech">Electronics & Technology</option>
          <option value="smart-home">Smart Home & Robotics</option>
          <option value="smart-devices">Smart Devices</option>
          <option value="digital-learning">Digital Learning</option>
          <option value="boutique">Boutique Apparel & Accessories</option>
          <option value="apparel">Apparel</option>
          <option value="footwear">Footwear</option>
          <option value="bags">Bags</option>
          <option value="fashion-accessories">Accessories</option>
        </select>
      </div>
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

    <section class="account-cta-section">
      <div class="section-shell contact-card">
        <h2>Want to become a novice customer?</h2>
        <p>Create account and enjoy exclusive benefits and offers.</p>
        <div class="contact-actions">
          <router-link to="/signup" class="create-account-btn">Create Account</router-link>
          <a href="mailto:cambridgemediam@gmail.com" class="primary-btn">Email Us</a>
          <a href="tel:+254732379292" class="secondary-btn">Call Now</a>
        </div>
      </div>
    </section>

    <div class="page-cta-row">
      <router-link to="/support" class="support-access-btn">Need support? Request help</router-link>
    </div>

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
import productsData from "../data/products.json";
import { readStore, writeStore } from "../lib/localStore";
import { addProductToCart, persistCart, readCart } from "../services/cart.service";
import { computed, onBeforeUnmount, ref, watch } from "vue";

const STOCK_STORAGE_KEY = "oclok_store_stock";

const departmentCatalog = [
  {
    id: "tech",
    name: "Electronics & Technology",
    icon: "⚙️",
    subcategories: [
      {
        id: "smart-home",
        name: "Smart Home & Robotics",
        matches: ["Smart Home", "Kitchen", "Sensors", "Security", "Safety", "Outdoor"],
      },
      {
        id: "smart-devices",
        name: "Smart Devices",
        matches: ["Phones", "Watches", "Audio", "Sounds", "Accessories"],
      },
      {
        id: "digital-learning",
        name: "Digital Learning",
        matches: ["Learning Videos", "Stationery", "Tutors"],
      },
    ],
  },
  {
    id: "boutique",
    name: "Boutique Apparel & Accessories",
    icon: "🧥",
    subcategories: [
      { id: "apparel", name: "Apparel", matches: ["Clothing"] },
      { id: "footwear", name: "Footwear", matches: ["Footwear"] },
      { id: "bags", name: "Bags", matches: ["Bags"] },
      { id: "fashion-accessories", name: "Accessories", matches: ["Accessories"] },
    ],
  },
];

const categoryLabelMap = {
  "Smart Home": "Smart Home & Robotics",
  Security: "Security",
  Sensors: "Sensors",
  Outdoor: "Outdoor",
  Safety: "Safety",
  Kitchen: "Kitchen",
  Phones: "Phones",
  Watches: "Watches",
  Audio: "Audio",
  Sounds: "Audio",
  Accessories: "Accessories",
  "Learning Videos": "Digital Learning",
  Stationery: "Stationery",
  Tutors: "Tutors",
  Clothing: "Apparel",
  Footwear: "Footwear",
  Bags: "Bags",
};

export default {
  name: "ProductsPage",
  components: { CardList, PaginationControls, CartModal },

  setup() {
    const products = ref([]);
    const loading = ref(true);
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const selectedDepartment = ref("");
    const selectedSubcategory = ref("");
    const selectedFilterGroup = ref("everything");
    const currentPage = ref(1);
    const cart = ref(readCart());
    const isCartOpen = ref(false);
    const pageSize = 12;

    const departments = computed(() => departmentCatalog);

    const resolveDepartmentId = (productCategory = "") => {
      const category = String(productCategory || "").trim();
      const techCategories = [
        "Smart Home",
        "Kitchen",
        "Sensors",
        "Security",
        "Safety",
        "Outdoor",
        "Phones",
        "Watches",
        "Audio",
        "Sounds",
        "Accessories",
        "Learning Videos",
        "Stationery",
        "Tutors",
      ];
      const boutiqueCategories = ["Clothing", "Footwear", "Bags"];

      if (techCategories.includes(category)) return "tech";
      if (boutiqueCategories.includes(category)) return "boutique";

      const normalizedName = category.toLowerCase();
      if (/(hoodie|tee|t-shirt|cap|bag|sneaker|shoes|footwear|jacket|dress|suit|denim)/.test(normalizedName)) {
        return "boutique";
      }
      if (/(watch|earbud|speaker|phone|robot|doorbell|lock|camera|sensor|smart|coffee|cleaner)/.test(normalizedName)) {
        return "tech";
      }
      return "tech";
    };

    const resolveSubcategoryId = (productCategory = "") => {
      const category = String(productCategory || "").trim();
      if (["Smart Home", "Kitchen", "Sensors", "Security", "Safety", "Outdoor"].includes(category)) return "smart-home";
      if (["Phones", "Watches", "Audio", "Sounds", "Accessories"].includes(category)) return "smart-devices";
      if (["Learning Videos", "Stationery", "Tutors"].includes(category)) return "digital-learning";
      if (["Clothing"].includes(category)) return "apparel";
      if (["Footwear"].includes(category)) return "footwear";
      if (["Bags"].includes(category)) return "bags";
      if (["Accessories"].includes(category)) return "fashion-accessories";
      return "smart-devices";
    };

    const deriveBadges = (product = {}) => {
      const name = String(product.name || "").toLowerCase();
      const category = String(product.category || "").toLowerCase();
      const badges = new Set();

      const isTechProduct =
        /(smart|watch|earbud|speaker|robot|camera|phone|sensor|lock|doorbell|coffee|cleaner|audio|device)/.test(name) ||
        /(smart home|phones|watches|audio|sounds|security|sensors|outdoor|safety|kitchen)/.test(category);

      const isFashionProduct =
        /(hoodie|t-shirt|tee|cap|bag|shoe|footwear|apparel|dress|sneaker|jacket|belt)/.test(name) ||
        /(clothing|footwear|bags)/.test(category);

      if (isTechProduct) badges.add("Smart Tech");
      if (isFashionProduct) badges.add("Fashion Edit");
      if (/(watch|wearable)/.test(name) || /(watches)/.test(category)) badges.add("Smart Wearable");
      if (/(hoodie|shirt|tee|cap)/.test(name) || /(clothing)/.test(category)) badges.add("Apparel");

      return [...badges];
    };

    const normalizeProduct = (product) => {
      const numericPrice = Number(product?.price);
      const normalized = {
        ...product,
        price: Number.isFinite(numericPrice) ? numericPrice : 0,
      };

      const departmentId = resolveDepartmentId(normalized.category);
      const subcategoryId = resolveSubcategoryId(normalized.category);
      const badges = deriveBadges(normalized);

      return {
        ...normalized,
        department: departmentId,
        subcategory: subcategoryId,
        badges,
      };
    };

    const matchesMultiFilter = (product) => {
      if (!selectedFilterGroup.value || selectedFilterGroup.value === "everything") {
        return true;
      }

      const department = resolveDepartmentId(product.category);
      const subcategory = resolveSubcategoryId(product.category);

      if (selectedFilterGroup.value === department || selectedFilterGroup.value === subcategory) {
        return true;
      }

      if (selectedFilterGroup.value === "tech" || selectedFilterGroup.value === "boutique") {
        return department === selectedFilterGroup.value;
      }

      return product.category === selectedFilterGroup.value;
    };

    const filteredProducts = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      return products.value.filter((product) => {
        const productName = (product.name || "").toLowerCase();
        const productCategory = (product.category || "").toLowerCase();
        const matchesSearch =
          q === "" || productName.includes(q) || productCategory.includes(q) || (product.badges || []).join(" ").toLowerCase().includes(q);

        const matchesDepartment =
          !selectedDepartment.value || resolveDepartmentId(product.category) === selectedDepartment.value;

        const matchesSubcategory =
          !selectedSubcategory.value || resolveSubcategoryId(product.category) === selectedSubcategory.value;

        const matchesCategory =
          !selectedCategory.value || product.category === selectedCategory.value;

        return matchesSearch && matchesDepartment && matchesSubcategory && matchesCategory && matchesMultiFilter(product);
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
      if (selectedCategory.value) {
        const nextDepartment = resolveDepartmentId(selectedCategory.value);
        const nextSubcategory = resolveSubcategoryId(selectedCategory.value);
        selectedDepartment.value = nextDepartment;
        selectedSubcategory.value = nextSubcategory;
      }
      currentPage.value = 1;
    });

    watch(selectedDepartment, () => {
      if (!selectedDepartment.value) {
        selectedSubcategory.value = "";
      } else if (!selectedSubcategory.value) {
        const defaultSubcategory = departmentCatalog.find((department) => department.id === selectedDepartment.value)?.subcategories[0]?.id || "";
        selectedSubcategory.value = defaultSubcategory;
      }
      currentPage.value = 1;
    });

    watch(totalPages, (newTotal) => {
      if (currentPage.value > newTotal) {
        currentPage.value = newTotal;
      }
    });

    const goToProduct = (product) => {
      if (!product?.id) return;
      window.location.href = `/products/${product.id}`;
    };

    const onFilterChange = () => {
      currentPage.value = 1;
    };

    const clearFilters = () => {
      selectedDepartment.value = "";
      selectedSubcategory.value = "";
      selectedCategory.value = "";
      selectedFilterGroup.value = "everything";
      currentPage.value = 1;
    };

    const selectDepartment = (departmentId) => {
      const nextDepartment = selectedDepartment.value === departmentId ? "" : departmentId;
      selectedDepartment.value = nextDepartment;
      selectedSubcategory.value = nextDepartment ? departmentCatalog.find((department) => department.id === nextDepartment)?.subcategories[0]?.id || "" : "";
      selectedCategory.value = "";
      currentPage.value = 1;
    };

    const selectSubcategory = (departmentId, subcategoryId) => {
      const nextDepartment = departmentId;
      const isSame = selectedDepartment.value === nextDepartment && selectedSubcategory.value === subcategoryId;
      selectedDepartment.value = isSame ? "" : nextDepartment;
      selectedSubcategory.value = isSame ? "" : subcategoryId;
      selectedCategory.value = "";
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

    const syncProductsFromStock = () => {
      const stockList = readStore(STOCK_STORAGE_KEY, productsData || []);
      const nextProducts = Array.isArray(stockList) && stockList.length ? stockList : (productsData || []);
      writeStore(STOCK_STORAGE_KEY, nextProducts);
      products.value = nextProducts.map((item) => normalizeProduct(item));
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

    const handleStockUpdate = (event) => {
      const incoming = event?.detail || readStore(STOCK_STORAGE_KEY, productsData || []);
      const nextProducts = Array.isArray(incoming) && incoming.length ? incoming : (productsData || []);

      writeStore(STOCK_STORAGE_KEY, nextProducts);
      products.value = nextProducts.map((item) => normalizeProduct(item));
      currentPage.value = 1;
    };

    setTimeout(() => {
      syncProductsFromStock();
      loading.value = false;
    }, 500);

    window.addEventListener("oclok-stock-updated", handleStockUpdate);
    onBeforeUnmount(() => {
      window.removeEventListener("oclok-stock-updated", handleStockUpdate);
    });

    return {
      products,
      loading,
      searchQuery,
      selectedCategory,
      selectedDepartment,
      selectedSubcategory,
      selectedFilterGroup,
      currentPage,
      cart,
      isCartOpen,
      cartItemCount,
      pageSize,
      departments,
      filteredProducts,
      totalPages,
      paginatedProducts,
      normalizeProduct,
      goToProduct,
      onFilterChange,
      selectCategory,
      selectDepartment,
      selectSubcategory,
      clearFilters,
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

.department-nav {
  display: grid;
  gap: 18px;
  max-width: 1180px;
  margin: 18px auto 8px;
  padding: 0 20px;
}

.department-group {
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.05);
  overflow: hidden;
}

.department-group.active {
  border-color: rgba(255, 102, 0, 0.45);
  box-shadow: 0 18px 42px rgba(255, 102, 0, 0.08);
}

.department-title,
.nav-reset,
.subcategory-chip {
  font: inherit;
  transition: all 0.18s ease;
}

.department-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  border: none;
  background: transparent;
  color: #111827;
  font-size: 1.02rem;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}

.department-title span:first-child {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(255, 102, 0, 0.1);
}

.department-title span:last-child {
  flex: 1;
}

.department-group.active .department-title {
  background: linear-gradient(90deg, rgba(255, 102, 0, 0.06), rgba(37, 99, 235, 0.04));
}

.subcategory-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 18px 18px;
}

.subcategory-chip,
.nav-reset {
  border: 1px solid #d7dce3;
  border-radius: 999px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 9px 14px;
}

.subcategory-chip:hover,
.subcategory-chip.active,
.nav-reset:hover,
.nav-reset.active {
  border-color: #111827;
  background: #111827;
  color: #fff;
}

.nav-reset {
  align-self: flex-start;
  margin: 0 auto;
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

.multi-filter-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 220px;
}

.multi-filter-label {
  color: #374151;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
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

.multi-filter-select {
  min-height: 44px;
  background: #fff;
  cursor: pointer;
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

.account-cta-section {
  margin-top: 2.5rem;
  padding: 1rem 0 0;
}

.section-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.contact-card {
  padding: 40px 32px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(8, 15, 28, 0.98), rgba(24, 213, 194, 0.12));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 18px 40px rgba(10, 18, 27, 0.25);
  color: #fff;
}

.contact-card h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1.1;
  color: #fff;
}

.contact-card p {
  margin: 0.9rem 0 0;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.7;
  max-width: 680px;
}

.contact-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 1.5rem;
}

.create-account-btn,
.primary-btn,
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0.8rem 1.2rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.create-account-btn,
.primary-btn,
.secondary-btn {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.create-account-btn {
  background: rgba(255, 255, 255, 0.06);
}

.primary-btn {
  background: var(--color-primary, #18d5c2);
  color: #06131a;
  border-color: transparent;
  box-shadow: 0 10px 24px rgba(24, 213, 194, 0.25);
}

.secondary-btn {
  background: transparent;
}

.create-account-btn:hover,
.primary-btn:hover,
.secondary-btn:hover {
  transform: translateY(-1px);
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

  .contact-card {
    padding: 30px 22px;
  }

  .contact-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .create-account-btn,
  .primary-btn,
  .secondary-btn {
    width: 100%;
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
