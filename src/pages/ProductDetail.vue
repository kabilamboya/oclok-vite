<template>
  <div v-if="product" class="product-detail">
    <!-- Back Button -->
    <button class="back-btn" @click="goBack">
      ← Back to Products
    </button>

    <!-- Product Content -->
    <div class="product-card">
      <!-- Product Images -->
      <div class="image-container">
        <img
          :src="activeImage"
          :alt="product.name"
          class="main-image"
          loading="lazy"
        />
        <div class="thumbnail-row">
          <img
            v-for="(img, index) in product.images || [product.image]"
            :key="index"
            :src="img"
            :alt="`${product.name} view ${index + 1}`"
            class="thumbnail"
            :class="{ active: activeImage === img }"
            @click="activeImage = img"
            loading="lazy"
          />
        </div>
      </div>

      <!-- Product Info -->
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <h3 class="price">KES {{ product.price.toLocaleString() }}</h3>
        <p class="description">{{ product.description }}</p>

        <!-- Buttons -->
        <div class="actions">
          <button class="buy-btn" @click="CartModal">🛒 Add to Cart</button>
          <button class="account-btn" @click="$router.push('/account')">👤 Create Account</button>
          <button class="contact-btn" @click="contactSupplier">📞 Contact Supplier</button>
        </div>
      </div>
    </div>

    <!-- Product Specs -->
    <div class="extra-sections">
      <section class="details">
        <h2>📋 Product Details & Specifications</h2>
        <ul>
          <li><strong>Brand:</strong> {{ product.brand || 'N/A' }}</li>
          <li><strong>Model:</strong> {{ product.model || 'N/A' }}</li>
          <li><strong>Weight:</strong> {{ product.weight || 'N/A' }}</li>
          <li><strong>Dimensions:</strong> {{ product.dimensions || 'N/A' }}</li>
          <li><strong>Warranty:</strong> {{ product.warranty || 'No Warranty' }}</li>
        </ul>

        <h3>Technical Specs:</h3>
        <ul>
          <li v-for="(spec, index) in product.specs || []" :key="index">{{ spec }}</li>
        </ul>
      </section>

      <!-- How to Use -->
      <section class="usage">
        <h2>⚙️ How to Use</h2>
        <ol>
          <li v-for="(step, index) in product.howToUse || defaultUsage" :key="index">
            {{ step }}
          </li>
        </ol>
      </section>

      <!-- Do’s & Don’ts -->
      <section class="dos-donts">
        <div class="dos">
          <h3>✅ Do’s</h3>
          <ul>
            <li v-for="(item, index) in product.dos || defaultDos" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="donts">
          <h3>❌ Don’ts</h3>
          <ul>
            <li v-for="(item, index) in product.donts || defaultDonts" :key="index">{{ item }}</li>
          </ul>
        </div>
      </section>
    </div>
  </div>

  <!-- Loading fallback -->
  <div v-else class="loading">Loading product details...</div>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      products: [],
      product: null,
      activeImage: null,
      defaultUsage: [
        "Unbox the product carefully.",
        "Follow included manual instructions.",
        "Plug in / assemble as required.",
        "Test functionality before full use.",
      ],
      defaultDos: [
        "Read the instruction manual.",
        "Keep the product clean and dry.",
        "Use only for intended purpose.",
      ],
      defaultDonts: [
        "Do not expose to fire or extreme heat.",
        "Do not attempt unauthorized repairs.",
        "Avoid using with incompatible accessories.",
      ],
    };
  },
  async created() {
    try {
      const res = await fetch("/products.json");
      this.products = await res.json();
      this.product = this.products.find((p) => p.id === parseInt(this.id));
      if (this.product) {
        this.activeImage = this.product.images
          ? this.product.images[0]
          : this.product.image;
      }
    } catch (error) {
      console.error("Error loading product details:", error);
    }
  },
  methods: {
    goBack() {
      this.$router.push("/products");
    },
    contactSupplier() {
      this.$router.push(`/contact-supplier?supplier=${this.product.name}`);
    },
    CartModal() {
      alert(`${this.product.name} added to cart!`);
    },
  },
};
</script>

<style scoped>
.product-detail {
  padding: 20px;
  max-width: 1100px;
  margin: auto;
}

/* === BACK BUTTON === */
.back-btn {
  background: #fff8b3;
  border: 1px solid #e6d500;
  color: #000;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 25px;
  cursor: pointer;
  transition: 0.25s ease;
}

.back-btn:hover {
  background: #ffe600;
  transform: translateX(-3px);
}

/* === PRODUCT CARD === */
.product-card {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin-top: 10px;
  background: #fff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  align-items: flex-start;
}

/* === IMAGES === */
.image-container {
  flex: 1 1 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.main-image {
  width: 100%;
  max-width: 430px;
  height: 350px;
  object-fit: contain;
  border-radius: 14px;
  background: #f7f7f7;
  padding: 12px;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.05);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.015);
}

.thumbnail-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.thumbnail {
  width: 75px;
  height: 75px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid transparent;
  background: #fafafa;
  padding: 3px;
  transition: all 0.3s ease;
}

.thumbnail:hover {
  transform: scale(1.08);
}

.thumbnail.active {
  border-color: #ffe600;
  background: #fffde6;
  transform: scale(1.12);
}

/* === PRODUCT INFO === */
.product-info {
  flex: 1 1 50%;
}

.product-info h1 {
  font-size: 2rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.price {
  color: #e63946;
  font-size: 1.5rem;
  margin: 12px 0;
  font-weight: 700;
}

.description {
  line-height: 1.7;
  margin-bottom: 20px;
  color: #444;
}

/* === ACTION BUTTONS === */
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}

.actions button {
  padding: 12px 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: 0.25s ease;
  font-weight: 600;
}

/* Primary action */
.buy-btn {
  background: #ffe600;
  color: #000;
  box-shadow: 0 3px 10px rgba(255, 230, 0, 0.3);
}

.buy-btn:hover {
  background: #ffd000;
  transform: translateY(-2px);
}

/* Secondary */
.account-btn {
  background: #000;
  color: #fff;
}

.account-btn:hover {
  background: #333;
  transform: translateY(-2px);
}

/* Tertiary */
.contact-btn {
  background: #007bff;
  color: #fff;
}

.contact-btn:hover {
  background: #005fcc;
  transform: translateY(-2px);
}

/* === EXTRA SECTIONS === */
.extra-sections {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Base card style */
.extra-sections section {
  background: #fff;
  border-radius: 14px;
  padding: 25px;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.06);
}

.extra-sections h2 {
  margin-bottom: 15px;
}

.extra-sections ul,
.extra-sections ol {
  padding-left: 20px;
  line-height: 1.6;
}

/* Do’s & Don’ts */
.dos-donts {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
}

.dos,
.donts {
  flex: 1 1 45%;
  background: #f9f9f9;
  padding: 18px;
  border-radius: 10px;
  border-left: 6px solid #e7e7e7;
}

.dos {
  border-left-color: #28a745;
}

.donts {
  border-left-color: #dc3545;
}

.dos h3 {
  color: #28a745;
  margin-bottom: 8px;
}

.donts h3 {
  color: #dc3545;
  margin-bottom: 8px;
}

/* === RESPONSIVE === */
@media (max-width: 900px) {
  .product-card {
    padding: 20px;
  }

  .product-info h1 {
    font-size: 1.6rem;
  }

  .price {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .product-card {
    flex-direction: column;
  }

  .main-image {
    max-height: 300px;
  }

  .dos-donts {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .thumbnail {
    width: 65px;
    height: 65px;
  }
}
</style>
