<template>
  <div v-if="product" class="product-detail">
    <!-- Back Button -->
    <button class="back-btn" @click="$router.push('/products')">← Back to Products</button>

    <div class="product-card">
      <!-- Product Image -->
      <div class="image-container">
        <img :src="activeImage" :alt="product.name" class="main-image" />
        <div class="thumbnail-row">
          <img
            v-for="(img, index) in product.images || [product.image]"
            :key="index"
            :src="img"
            :alt="`${product.name} view ${index + 1}`"
            class="thumbnail"
            :class="{ active: activeImage === img }"
            @click="activeImage = img"
          />
        </div>
      </div>

      <!-- Product Info -->
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <h3 class="price">Ksh {{ product.price }}</h3>
        <p>{{ product.description }}</p>

        <!-- Action Buttons -->
        <div class="actions">
          <button class="buy-btn" @click="CartModal">Add to Cart</button>
          <button class="account-btn" @click="$router.push('/create-account')">Create Account</button>
          <button class="contact-btn" @click="contactSupplier">Contact Supplier</button>
        </div>
      </div>
    </div>

    <!-- Extra Sections -->
    <div class="extra-sections">
      <!-- Product Details & Specs -->
      <section class="details">
        <h2>Product Details & Specifications</h2>
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
        <h2>How to Use</h2>
        <ol>
          <li v-for="(step, index) in product.howToUse || defaultUsage" :key="index">
            {{ step }}
          </li>
        </ol>
      </section>

      <!-- Do's & Don'ts -->
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
</template>

<script>
fetch("/products.json").then(res => res.json())

export default {
  props: ["id"],
  computed: {
    product() {
      return products.find((p) => p.id === parseInt(this.id));
    },
  },
  data() {
    return {
      activeImage: null,
      defaultUsage: [
        "Unbox the product carefully.",
        "Follow included manual instructions.",
        "Plug in / assemble as required.",
        "Test functionality before full use."
      ],
      defaultDos: [
        "Read the instruction manual.",
        "Keep the product clean and dry.",
        "Use only for intended purpose."
      ],
      defaultDonts: [
        "Do not expose to fire or extreme heat.",
        "Do not attempt unauthorized repairs.",
        "Avoid using with incompatible accessories."
      ],
    };
  },
  watch: {
    product: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.activeImage = newVal.images ? newVal.images[0] : newVal.image;
        }
      }
    }
  },
  methods: {
    contactSupplier() {
      this.$router.push(`/contact?supplier=${this.product.name}`);
    },
    CartModal() {
      alert(`${this.product.name} added to cart!`);
    }
  }
};
</script>

<style scoped>
.product-card {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.image-container {
  flex: 1 1 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-image {
  width: 100%;
  max-width: 400px;
  height: 350px;
  object-fit: contain;
  border-radius: 12px;
  border: 1px solid #ddd;
  background: #f9f9f9;
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
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
}

.thumbnail.active {
  border-color: #007bff;
}

.product-info {
  flex: 1 1 50%;
}

.price {
  color: #28a745;
  margin: 10px 0;
}

.actions button {
  margin-right: 10px;
  margin-top: 10px;
}

.extra-sections {
  margin-top: 40px;
}

.extra-sections section {
  margin-bottom: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.dos-donts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.dos, .donts {
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

@media (max-width: 768px) {
  .product-card {
    flex-direction: column;
  }
  .dos-donts {
    flex-direction: column;
  }
}
</style>
