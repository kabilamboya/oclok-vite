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
}

/* === BACK BUTTON === */
.back-btn {
  background: #ffe600;
  border: none;
  color: #000;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #ffd500;
  transform: translateY(-2px);
}

/* === PRODUCT CARD === */
.product-card {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 20px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
}

.image-container {
  flex: 1 1 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-image {
  width: 100%;
  max-width: 420px;
  height: 350px;
  object-fit: contain;
  border-radius: 12px;
  background: #fafafa;
  transition: opacity 0.3s ease;
}

.thumbnail-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.thumbnail {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail.active {
  border-color: #ffe600;
  transform: scale(1.05);
}

/* === INFO SECTION === */
.product-info {
  flex: 1 1 50%;
}

.product-info h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.price {
  color: #e63946;
  font-size: 1.3rem;
  margin: 10px 0;
  font-weight: bold;
}

.description {
  line-height: 1.6;
  margin-bottom: 20px;
}

.actions button {
  margin-right: 10px;
  margin-top: 10px;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.buy-btn {
  background: #ffe600;
  color: #000;
}

.buy-btn:hover {
  background: #ffd000;
}

.account-btn {
  background: #000;
  color: #fff;
}

.account-btn:hover {
  background: #333;
}

.contact-btn {
  background: #007bff;
  color: #fff;
}

.contact-btn:hover {
  background: #005fcc;
}

/* === EXTRA SECTIONS === */
.extra-sections {
  margin-top: 40px;
}

.extra-sections section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.dos-donts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.dos,
.donts {
  flex: 1 1 45%;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.dos h3 {
  color: #28a745;
}

.donts h3 {
  color: #dc3545;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .product-card {
    flex-direction: column;
  }
  .dos-donts {
    flex-direction: column;
  }
}
</style>
