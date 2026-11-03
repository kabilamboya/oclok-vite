<template>
  <div class="products-page">
    <header class="store-intro">
      <p class="eyebrow">Fashion, accessories and smart devices</p>
    </header>

    <section class="shop-hero">
      <div class="hero-content">
        <div class="hero-copy">
          <span class="hero-badge">Delibois Botique</span>
          <h2>Modern essentials for work, travel, sport, and everyday confidence.</h2>
          <p>Shop curated men’s wear, ladies’ fashion, kids’ looks, everyday accessories, footwear, and smart wearable pieces made for daily style.</p>
        </div>
        <div class="hero-showcase">
          <div class="showcase-card showcase-main">
            <span>Style that moves with your day</span>
            <strong>Delibois Botique</strong>
            <button class="primary-action" type="button" @click="jumpToCatalog('fashion')">Style your wardrobe</button>
          </div>
          <div class="showcase-card showcase-mini">
            <span>Saves You Time</span>
            <strong>O!clok Store</strong>
            <button class="secondary-action" type="button" @click="jumpToCatalog('electronics')">Shop smart devices</button>
          </div>
        </div>
      </div>
    </section>

    <div ref="catalogShell" class="catalog-shell" aria-label="Search and filter products">
      <aside class="category-aside" aria-label="Product categories">
        <div class="category-focus-header">
          <span class="category-kicker">Categories</span>
          <h2>Browse</h2>
        </div>

        <div v-for="section in catalogNavigationSections" :key="section.id" class="category-section">
          <h3>{{ section.label }}</h3>
          <div class="category-list">
            <button
              v-for="item in section.items"
              :key="item.id"
              type="button"
              class="category-button"
              :class="{
                active: item.id === selectedDepartment || item.id === selectedSubcategory,
                muted: selectedDepartment && item.id !== selectedDepartment && item.id !== selectedSubcategory,
              }"
              @click="focusCatalogView(item.id)"
            >
              {{ item.label }}
            </button>
          </div>
        </div>
      </aside>

      <div class="listing-content">
        <div class="listing-toolbar">
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
            <button class="search-btn" type="button" @click="onFilterChange">🔍</button>
          </div>
        </div>

        <section v-if="featuredCollections.length" class="featured-collections" aria-label="Featured collections">
          <CardList
            :card-items="featuredCollections"
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
        </section>

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
    </div>

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
import electronicProductsData from "../data/electronics.json";
import boutiqueProductsData from "../data/boutique.json";
import { readStore, writeStore } from "../lib/localStore";
import { addProductToCart, persistCart, readCart } from "../services/cart.service";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useRouter } from "vue-router";

const STOCK_STORAGE_KEY = "oclok_store_stock";
const normalizeCatalogIds = (...catalogs) => {
  const seen = new Set();
  const merged = [];

  catalogs.forEach((catalog) => {
    (Array.isArray(catalog) ? catalog : []).forEach((item) => {
      if (!item || typeof item !== "object") return;

      let nextId = Number(item.id);
      if (!Number.isFinite(nextId) || seen.has(nextId)) {
        nextId = 1;
        while (seen.has(nextId)) {
          nextId += 1;
        }
      }

      seen.add(nextId);
      merged.push({ ...item, id: nextId });
    });
  });

  return merged;
};

const catalogProducts = normalizeCatalogIds(electronicProductsData, boutiqueProductsData);

const categoryTaxonomy = {
  "smart-home": {
    aliases: ["smart home", "security", "sensors", "safety", "outdoor", "kitchen"],
    subcategories: ["security", "sensors", "safety", "outdoor", "kitchen"],
  },
  electronics: {
    aliases: ["phone", "phones", "watch", "watches", "audio", "speaker", "earbud", "wearable", "wearables", "accessory", "accessories"],
    subcategories: ["phones", "watches", "audio", "wearables", "electronics-accessories"],
  },
  fashion: {
    aliases: ["men", "women", "ladies", "kids", "footwear", "shoes", "sandals", "caps", "bags", "belts", "official", "casual", "sports", "apparel", "clothing"],
    subcategories: ["men", "women", "kids", "footwear", "fashion-accessories"],
  },
  learning: {
    aliases: ["learning videos", "stationery", "tutors", "digital learning"],
    subcategories: ["digital-learning", "stationery", "tutors"],
  },
};

const subcategoryTaxonomy = {
  security: ["security", "smart home", "camera", "doorbell", "lock", "alarm"],
  sensors: ["sensor", "sensors"],
  safety: ["safety", "smoke", "gas", "flood"],
  outdoor: ["outdoor", "garden", "lighting"],
  kitchen: ["kitchen", "coffee", "appliance"],
  phones: ["phone", "phones"],
  watches: ["watch", "watches", "smartwatch"],
  audio: ["audio", "speaker", "earbud", "headphones"],
  wearables: ["wearable", "wearables", "fitness"],
  "electronics-accessories": ["accessory", "accessories", "charger", "cable", "adapter"],
  men: ["men", "men wear", "official", "casual", "sports", "shirt", "hoodie", "jacket", "trouser"],
  women: ["women", "ladies", "ladies wear", "dress", "gown", "skirt", "blouse"],
  kids: ["kids", "kids wear", "children", "school"],
  footwear: ["footwear", "shoes", "shoe", "sandals", "sandal"],
  "fashion-accessories": ["caps", "cap", "bags", "bag", "belts", "belt", "accessories", "fashion accessories"],
  "digital-learning": ["digital learning", "learning video", "learning videos"],
  stationery: ["stationery", "notebook", "paper"],
  tutors: ["tutor", "tutors", "teacher", "coaching"],
};

const normalizeCategory = (value = "") => String(value || "").trim().toLowerCase();
const matchesCategoryAlias = (category, aliases = []) => {
  const normalizedCategory = normalizeCategory(category);
  return aliases.some((alias) => normalizedCategory.includes(normalizeCategory(alias)));
};

export const storeCategories = [
  {
    id: "smart-home",
    label: "Smart Home & Robotics",
    subcategories: [
      { id: "security", label: "Security" },
      { id: "sensors", label: "Sensors" },
      { id: "safety", label: "Safety" },
      { id: "outdoor", label: "Outdoor" },
      { id: "kitchen", label: "Kitchen" }
    ]
  },
  {
    id: "electronics",
    label: "Electronics & Gadgets",
    subcategories: [
      { id: "phones", label: "Phones" },
      { id: "watches", label: "Watches" },
      { id: "audio", label: "Audio" },
      { id: "wearables", label: "Wearables" },
      { id: "electronics-accessories", label: "Accessories" }
    ]
  },
  {
    id: "fashion",
    label: "Fashion & Apparel",
    subcategories: [
      {
        id: "men",
        label: "Men",
        subcategories: [
          { id: "men-official", label: "Official" },
          { id: "men-casual", label: "Casual" },
          { id: "men-sports", label: "Sports" }
        ]
      },
      {
        id: "women",
        label: "Women",
        subcategories: [
          { id: "women-official", label: "Official" },
          { id: "women-casual", label: "Casual" },
          { id: "women-sports", label: "Sports" }
        ]
      },
      {
        id: "kids",
        label: "Kids",
        subcategories: [
          { id: "kids-official", label: "Official" },
          { id: "kids-casual", label: "Casual" },
          { id: "kids-sports", label: "Sports" }
        ]
      },
      {
        id: "footwear",
        label: "Footwear",
        subcategories: [
          { id: "shoes", label: "Shoes" },
          { id: "sandals", label: "Sandals" }
        ]
      },
      {
        id: "fashion-accessories",
        label: "Fashion Accessories",
        subcategories: [
          { id: "caps", label: "Caps" },
          { id: "bags", label: "Bags" },
          { id: "belts", label: "Belts" }
        ]
      }
    ]
  },
  {
    id: "learning",
    label: "Learning & Education",
    subcategories: [
      { id: "digital-learning", label: "Digital Learning" },
      { id: "stationery", label: "Stationery" },
      { id: "tutors", label: "Tutors" }
    ]
  }
];

const departmentCatalog = storeCategories;

const catalogNavigationSections = [
  {
    id: "boutique",
    label: "Boutique",
    items: [
      { id: "fashion", label: "All Boutique" },
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "footwear", label: "Footwear" },
      { id: "fashion-accessories", label: "Accessories" },
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    items: [
      { id: "electronics", label: "All Electronics" },
      { id: "smart-home", label: "Smart Home" },
      { id: "phones", label: "Phones" },
      { id: "watches", label: "Watches" },
      { id: "audio", label: "Audio" },
      { id: "wearables", label: "Wearables" },
      { id: "electronics-accessories", label: "Accessories" },
    ],
  },
];

const boutiqueTabs = [
  { id: "all", label: "All", icon: " " },
  { id: "men", label: "Men", icon: " " },
  { id: "women", label: "Women", icon: " " },
  { id: "kids", label: "Kids", icon: " " },
  { id: "footwear", label: "Footwear", icon: " " },
  { id: "fashion-accessories", label: "Accessories", icon: " " },
];

export default {
  name: "ProductsPage",
  components: { CardList, PaginationControls, CartModal },

  setup() {
    const featuredCollections = computed(() => {
      const categoryOrder = ["men", "women", "kids", "fashion-accessories"];
      const boutiqueProducts = products.value.filter((product) => resolveDepartmentId(product.category) === "fashion");

      const featured = categoryOrder
        .map((tab) => boutiqueProducts.find((product) => resolveSubcategoryId(product.category) === tab))
        .filter(Boolean);

      return featured.length ? featured : boutiqueProducts.slice(0, 4);
    });

    const products = ref([]);
    const loading = ref(true);
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const selectedDepartment = ref("");
    const selectedSubcategory = ref("");
    const currentPage = ref(1);
    const cart = ref(readCart());
    const isCartOpen = ref(false);
    const pageSize = 12;
    const activeBoutiqueTab = ref("all");
    const catalogShell = ref(null);

    const departments = computed(() => departmentCatalog);

    const resolveDepartmentId = (productCategory = "") => {
      const normalized = normalizeCategory(productCategory);
      const match = Object.entries(categoryTaxonomy).find(([, config]) => matchesCategoryAlias(normalized, config.aliases));

      return match ? match[0] : "smart-home";
    };

    const resolveSubcategoryId = (productCategory = "") => {
      const normalized = normalizeCategory(productCategory);
      const match = Object.entries(subcategoryTaxonomy).find(([, aliases]) => matchesCategoryAlias(normalized, aliases));

      return match ? match[0] : "security";
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
      if (/(watch|wearable)/.test(name) || /(watches|wearables)/.test(category)) badges.add("Smart Wearable");
      if (/(hoodie|shirt|tee|cap|sandals|belt|bag|sneaker|shoes|official|casual|sports)/.test(name) || /(clothing|men wear|ladies wear|kids wear|sandals|shoes|caps|bags|belts|official|casual|sports)/.test(category)) badges.add("Apparel");

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

    const filteredProducts = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      return products.value.filter((product) => {
        const productExists = product && typeof product === "object" && (product.id !== undefined || product.name || product.category);
        if (!productExists) return false;

        const productName = (product.name || "").toLowerCase();
        const productCategory = (product.category || "").toLowerCase();
        const badgeText = ((product.badges || [])).join(" ").toLowerCase();
        const matchesSearch =
          q === "" || productName.includes(q) || productCategory.includes(q) || badgeText.includes(q);

        const matchesDepartment =
          !selectedDepartment.value || resolveDepartmentId(product.category) === selectedDepartment.value;

        const matchesSubcategory =
          !selectedSubcategory.value || resolveSubcategoryId(product.category) === selectedSubcategory.value;

        const matchesCategory =
          !selectedCategory.value || product.category === selectedCategory.value;

        return matchesSearch && matchesDepartment && matchesSubcategory && matchesCategory;
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

    const availableSubcategories = computed(() => {
      if (!selectedDepartment.value) return [];

      const selectedDepartmentConfig = departmentCatalog.find((department) => department.id === selectedDepartment.value);
      if (!selectedDepartmentConfig?.subcategories?.length) return [];

      const availableIds = new Set();
      products.value.forEach((product) => {
        const productSubcategory = resolveSubcategoryId(product.category);
        if (selectedDepartmentConfig.subcategories.some((subcategory) => subcategory.id === productSubcategory)) {
          availableIds.add(productSubcategory);
        }
      });

      return selectedDepartmentConfig.subcategories.filter(
        (subcategory) => availableIds.has(subcategory.id) || subcategory.id === selectedSubcategory.value
      );
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
      } else {
        const options = departmentCatalog.find((department) => department.id === selectedDepartment.value)?.subcategories || [];
        const keepsCurrentSubcategory = options.some((subcategory) => subcategory.id === selectedSubcategory.value);
        selectedSubcategory.value = keepsCurrentSubcategory ? selectedSubcategory.value : "";
      }
      currentPage.value = 1;
    });

    watch(totalPages, (newTotal) => {
      if (currentPage.value > newTotal) {
        currentPage.value = newTotal;
      }
    });

    const router = useRouter();

    const goToProduct = (product) => {
      if (!product?.id && product !== 0) return;
      const productId = Number(product.id);
      if (!Number.isFinite(productId)) return;
      router.push({ name: "ProductDetail", params: { id: String(productId) } });
    };

    const onFilterChange = () => {
      currentPage.value = 1;
    };

    const clearFilters = () => {
      selectedDepartment.value = "";
      selectedSubcategory.value = "";
      selectedCategory.value = "";
      activeBoutiqueTab.value = "all";
      currentPage.value = 1;
    };

    const selectCatalogItem = (itemId) => {
      const departmentOnlyIds = new Set(["fashion", "electronics", "smart-home"]);
      const boutiqueIds = new Set(["men", "women", "kids", "footwear", "fashion-accessories"]);
      const electronicsIds = new Set(["phones", "watches", "audio", "wearables", "electronics-accessories"]);

      if (departmentOnlyIds.has(itemId)) {
        const nextDepartment = itemId === "smart-home" ? "smart-home" : itemId;
        selectedDepartment.value = nextDepartment;
        selectedSubcategory.value = "";
        selectedCategory.value = "";
        activeBoutiqueTab.value = "all";
        currentPage.value = 1;
        return;
      }

      const nextDepartment = boutiqueIds.has(itemId) ? "fashion" : electronicsIds.has(itemId) ? "electronics" : "";
      const nextSubcategory = nextDepartment ? itemId : "";

      selectedDepartment.value = nextDepartment;
      selectedSubcategory.value = nextSubcategory;
      selectedCategory.value = "";
      activeBoutiqueTab.value = "all";
      currentPage.value = 1;
    };

    const focusCatalogView = (itemId) => {
      selectCatalogItem(itemId);
      requestAnimationFrame(() => {
        const shell = catalogShell.value;
        if (!shell) return;

        shell.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    const jumpToCatalog = (itemId) => {
      focusCatalogView(itemId);
    };

    const selectMainFilter = (departmentId) => {
      const nextDepartment = selectedDepartment.value === departmentId ? "" : departmentId;
      selectedDepartment.value = nextDepartment;

      if (!nextDepartment) {
        selectedSubcategory.value = "";
        selectedCategory.value = "";
        activeBoutiqueTab.value = "all";
        currentPage.value = 1;
        return;
      }

      selectedSubcategory.value = "";
      selectedCategory.value = "";
      activeBoutiqueTab.value = "all";
      currentPage.value = 1;
    };

    const selectBoutiqueTab = (tabId) => {
      activeBoutiqueTab.value = tabId;
      if (tabId === "all") {
        selectedDepartment.value = "";
        selectedSubcategory.value = "";
        selectedCategory.value = "";
        currentPage.value = 1;
        return;
      }

      const tabMap = {
        men: { department: "fashion", subcategory: "men" },
        women: { department: "fashion", subcategory: "women" },
        kids: { department: "fashion", subcategory: "kids" },
        footwear: { department: "fashion", subcategory: "footwear" },
        "fashion-accessories": { department: "fashion", subcategory: "fashion-accessories" },
        accessories: { department: "fashion", subcategory: "fashion-accessories" },
      };

      const next = tabMap[tabId] || tabMap.men;
      selectedDepartment.value = next.department;
      selectedSubcategory.value = next.subcategory;
      selectedCategory.value = "";
      currentPage.value = 1;
    };

    const selectDepartment = (departmentId) => {
      selectMainFilter(departmentId);
    };

    const selectSubcategory = (departmentId, subcategoryId) => {
      selectedDepartment.value = departmentId;
      const isSame = selectedSubcategory.value === subcategoryId;
      selectedSubcategory.value = isSame ? "" : subcategoryId;
      selectedCategory.value = "";
      activeBoutiqueTab.value = "all";
      currentPage.value = 1;
    };

    const selectSubFilter = (subcategoryId) => {
      const isSame = selectedSubcategory.value === subcategoryId;
      selectedSubcategory.value = isSame ? "" : subcategoryId;
      activeBoutiqueTab.value = "all";
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
      const stockList = readStore(STOCK_STORAGE_KEY, catalogProducts);
      const nextProducts = normalizeCatalogIds(Array.isArray(stockList) && stockList.length ? stockList : catalogProducts);
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
      const incoming = event?.detail || readStore(STOCK_STORAGE_KEY, catalogProducts);
      const nextProducts = normalizeCatalogIds(Array.isArray(incoming) && incoming.length ? incoming : catalogProducts);

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
      currentPage,
      cart,
      isCartOpen,
      cartItemCount,
      pageSize,
      departments,
      filteredProducts,
      totalPages,
      paginatedProducts,
      availableSubcategories,
      storeCategories,
      catalogNavigationSections,
      normalizeProduct,
      goToProduct,
      onFilterChange,
      selectCategory,
      selectDepartment,
      selectSubcategory,
      selectMainFilter,
      selectSubFilter,
      selectCatalogItem,
      focusCatalogView,
      jumpToCatalog,
      selectBoutiqueTab,
      clearFilters,
      catalogShell,
      addToCart,
      saveCart,
      increaseQty,
      decreaseQty,
      removeItem,
      goToCheckout,
      boutiqueTabs,
      featuredCollections,
      activeBoutiqueTab,
    };
  },
};
</script>

<style scoped>
.products-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

.store-intro {
  max-width: 760px;
  margin: 28px auto 8px;
  padding: 32px 24px 20px;
  text-align: center;
}

.store-intro .eyebrow {
  margin: 0 0 8px;
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.store-intro h1 {
  margin: 0;
  color: var(--text);
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
  background: #f8fafc;
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
  color: var(--text);
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
  background: rgba(255, 102, 0, 0.06);
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
  border-color: var(--text);
  background: var(--text);
  color: var(--text-dark);
}

.nav-reset {
  align-self: flex-start;
  margin: 0 auto;
}

.shop-hero {
  margin: 26px auto 18px;
  padding: 28px;
  border-radius: 28px;
  background: var(--bg-dark);
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.16);
}

.hero-content {
  display: grid;
  grid-template-columns: 1.35fr 0.95fr;
  gap: 24px;
  align-items: center;
}

.hero-copy {
  color: #fff;
  padding: 8px 8px 8px 6px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.68rem;
  font-weight: 800;
}

.hero-copy h2 {
  margin: 18px 0 12px;
  font-size: clamp(2.3rem, 4vw, 4rem);
  line-height: 1.02;
  color: #fff;
}

.hero-copy p {
  max-width: 560px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.02rem;
  line-height: 1.7;
  margin: 0;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.primary-action,
.secondary-action,
.featured-copy button {
  border: none;
  cursor: pointer;
  border-radius: 999px;
  font-weight: 700;
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.primary-action,
.secondary-action {
  min-height: 46px;
  padding: 0 18px;
  font-size: 0.96rem;
}

.primary-action {
  background: var(--color-primary);
  color: var(--text-dark);
}

.secondary-action {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.primary-action:hover,
.secondary-action:hover,
.featured-copy button:hover {
  transform: translateY(-1px);
}

.hero-showcase {
  display: grid;
  gap: 16px;
  min-height: 260px;
}

.showcase-card {
  border-radius: 22px;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  color: #fff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.showcase-main {
  min-height: 180px;
  background: #1f2937;
  border: 1px solid rgba(255,255,255,0.12);
}

.showcase-mini {
  min-height: 120px;
  background: var(--color-secondary);
}

.showcase-card span {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  opacity: 0.8;
}

.showcase-card strong {
  display: block;
  margin-top: 10px;
  font-size: clamp(1.2rem, 2vw, 2rem);
}

.catalog-shell {
  display: grid;
  grid-template-columns: minmax(240px, 300px) minmax(0, 1fr);
  gap: 22px;
  align-items: start;
  margin: 18px 0 26px;
}

.category-aside {
  display: grid;
  gap: 18px;
  padding: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.04);
  position: sticky;
  top: 20px;
}

.category-focus-header {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 6px 8px 12px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(10px);
}

.category-kicker {
  display: inline-block;
  margin-bottom: 6px;
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.category-focus-header h2 {
  margin: 0;
  color: var(--text);
  font-size: 1.2rem;
  font-weight: 800;
}

.category-section {
  padding: 14px 14px 12px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.02), rgba(255, 255, 255, 0.7));
}

.category-section h3 {
  margin: 0 0 12px;
  color: var(--text);
  font-size: 0.98rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.03);
  color: var(--text);
  font-size: 0.77rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
  text-align: left;
}

.category-button.active {
  background: #7c3aed;
  color: #fff;
  border-color: #7c3aed;
  box-shadow: 0 12px 18px rgba(124, 58, 237, 0.24);
}

.category-button.muted {
  opacity: 0.7;
}

.category-button:hover,
.category-button:focus-visible {
  transform: translateX(2px);
  border-color: #7c3aed;
  box-shadow: 0 8px 16px rgba(124, 58, 237, 0.12);
  outline: none;
}

.featured-collections {
  margin: 18px 0 28px;
}

.featured-collections .cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.featured-card {
  background: #fff;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(17, 24, 39, 0.08);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.06);
}

.featured-image {
  height: 170px;
}

.featured-copy {
  padding: 18px 18px 20px;
}

.featured-copy p {
  margin: 0 0 8px;
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.featured-copy h3 {
  margin: 0 0 16px;
  color: var(--text);
  font-size: 1.2rem;
}

.featured-copy button {
  background: var(--text);
  color: var(--text-dark);
  padding: 10px 14px;
}

.listing-toolbar {
  margin-bottom: 18px;
}

.search-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  max-width: 720px;
  margin-left: auto;
}

.search-bar {
  flex: 1;
  min-width: 0;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  transition: box-shadow 0.15s;
  background: rgba(255, 255, 255, 0.9);
}

.search-bar:focus {
  outline: none;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.08);
}

.search-btn {
  padding: 10px 12px;
  background: var(--color-primary);
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

.listing-content {
  min-width: 0;
}

.products-grid {
  width: 100%;
}

.products-grid .cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 18px;
  padding: 10px;
}

.skeleton {
  height: 250px;
  background: #f2f2f2;
  animation: loading 1.5s ease-in-out infinite alternate;
  border-radius: 12px;
}

@keyframes loading {
  0% {
    opacity: 0.55;
  }
  100% {
    opacity: 1;
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
  background: var(--text);
  color: var(--text-dark);
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
  background: #08151c;
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

  .catalog-shell {
    grid-template-columns: 1fr;
  }

  .category-aside {
    position: static;
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
