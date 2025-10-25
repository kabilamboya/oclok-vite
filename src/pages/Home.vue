<template>
  <div class="page">
      <!-- Header -->
      <header class="header">
        <div class="header-container">
          <img src="/images/oclokLogo.png" alt="O!clok Store Logo" class="logo" />
          <h1>Welcome to O!clok Store</h1>
          <!-- paragraph remains in place, now animated -->
          <p ref="animatedText" class="animated-text play">{{ currentPhrase }}</p>
        </div>
      </header>

    <!-- Hero / About Section -->
    <section class="about">
      <div class="about-container">
        <!-- Text -->
        <div class="about-text">
        
          <!-- CTA Buttons -->
          <div class="cta-buttons">
            <button @click="$router.push('/products')">Shop Now</button>
            <button @click="$router.push('/technicians')">Book a Technician</button>
            <button @click="$router.push('/services')">Explore Services</button>
          </div>
          <p>
            At <strong>O!clok Store</strong>, our mission is to make quality products and reliable services accessible to everyone, right on time. 
            We value <strong>trust, innovation, and customer-first service</strong> — ensuring every purchase feels simple, secure, and satisfying. 
          </p>
          <p>
            What makes us unique is our blend of <em>modern e-commerce convenience</em> with a <em>personal touch</em>: curated products, responsive support, 
            and a commitment to building lasting relationships with our customers.
          </p>

        </div>

        <!-- Image -->
        <div class="about-image">
          <img src="/images/45.jpg" alt="O!clok Store Team" />
        </div>
      </div>
    </section>

    <!-- Search & Filters -->
    <div class="filters">
      <div class="search-bar">
        <input type="text" placeholder="Search products..." v-model="searchQuery" />
        <button @click="searchProducts">Search</button>
      </div>
      <div class="filter-options">
        <label>
          Category:
          <select v-model="selectedCategory">
            <option value="">All</option>
            <option v-for="cat in categories" :key="cat">{{ cat }}</option>
          </select>
        </label>
      </div>
    </div>

    <!-- Products Grid -->
    <section class="products">
      <h2>Featured Products</h2>
      <div class="product-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
        >
          <img :src="product.image" :alt="product.title" />
          <h3>{{ product.title }}</h3>
          <p>{{ product.description }}</p>
          <span class="price">KSh {{ product.price }}</span>
          <button @click="addToCart(product)">Add to Cart</button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-grid">

        <!-- Brand -->
        <div class="footer-brand">
          <img src="/images/ocLoGo.png" alt="O!clok Store Logo" class="footer-logo" />
          <p>Your trusted hub for quality products & services.</p>
          <ul class="contact-list">
            <li><i class="fas fa-map-marker-alt"></i> Kisumu, Kenya</li>
            <li><i class="fas fa-phone-alt"></i> +254 732 379 292</li>
            <li><i class="fas fa-envelope"></i> clokmediam@gmail.com</li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h3>Resources</h3>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">User Guide</a></li>
            <li><a href="#">Community Forum</a></li>
            <li><a href="#">Partner Program</a></li>
          </ul>
        </div>

        <!-- FAQs -->
        <div>
          <h3>FAQs</h3>
          <ul>
            <li><a href="#">How do I place an order?</a></li>
            <li><a href="#">What payment methods are supported?</a></li>
            <li><a href="#">How do I track my delivery?</a></li>
            <li><a href="#">Do you offer returns/refunds?</a></li>
          </ul>
        </div>

        <!-- Social -->
        <div>
          <h3>Follow Us</h3>
          <div class="social-icons">
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="footer-bottom">
        <p>© 2025 O!clok Store — All Rights Reserved.</p>
        <a href="#" class="back-to-top">↑ Back to Top</a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      selectedCategory: "",
      categories: ["Electronics", "Home", "Fashion"],
      products: [
        {
          id: 1,
          title: "Smartphone",
          description: "Latest model with powerful features.",
          price: 30000,
          category: "Electronics",
          image: "/images/smartphone.jpg",
        },
        {
          id: 2,
          title: "Smart Watch",
          description: "Track your fitness and stay connected.",
          price: 8000,
          category: "Electronics",
          image: "/images/smartwatch.jpg",
        },
        {
          id: 3,
          title: "Sofa Set",
          description: "Comfortable and stylish living room set.",
          price: 50000,
          category: "Home",
          image: "/images/sofaset.jpg",
        },
      ],

      /* --- Animated header text (added) --- */
      phrases: [
        "We bet on convenienece",
        "Empower smart living through innovations",
        "And connecting technology with your lifestyle.",
        "Make a Smart choice for a brighter tomorrow",
        
      ],
      phraseIndex: 0,
      currentPhrase: "Empowering smart living through innovation",
      _phraseTimer: null,
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((p) => {
        const matchSearch = p.title
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
        const matchCategory = this.selectedCategory
          ? p.category === this.selectedCategory
          : true;
        return matchSearch && matchCategory;
      });
    },
  },
  methods: {
    searchProducts() {
      console.log("Searching for:", this.searchQuery);
    },
    addToCart(product) {
      alert(`${product.title} added to cart!`);
    },

    /* --- Animation helpers (added) --- */
    _playOnce() {
      const el = this.$refs.animatedText;
      if (!el) return;
      // restart CSS animation by toggling a class
      el.classList.remove("play");
      void el.offsetWidth; // reflow
      el.classList.add("play");
    },
    _nextPhrase() {
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length; // loops forever
      this.currentPhrase = this.phrases[this.phraseIndex];
      this._playOnce();
    },
  },
  mounted() {
    // kick off initial animation
    this._playOnce();
    // cycle every 4s (matches CSS duration)
    this._phraseTimer = setInterval(this._nextPhrase, 4000);
  },
  beforeDestroy() { // Vue 2
    if (this._phraseTimer) clearInterval(this._phraseTimer);
  },
  beforeUnmount() { // Vue 3
    if (this._phraseTimer) clearInterval(this._phraseTimer);
  },
};
</script>

<style scoped>
/* --- Header layout (added, minimal + respectful) --- */
.header-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 10px;
  padding: 20px;
}
.logo {
  width: 56px;
  height: auto;
  flex: 0 0 auto; /* small fixed side */
}
.header-container h1 {
  margin: 0;
  padding: 10px;
  flex: 0 0 auto;
  color: white;
  background: purple;
  font: 50px;
}
.header-container .animated-text {
  /* the "show screen" takes the remaining width */
  flex: 1 1 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: clip;
  opacity: 0;
  padding: 20px;
}

/* Animation class toggled by JS */
.animated-text.play {
  animation: rushInOut 4s ease-in-out forwards;
}

/* Rush in fast, linger, then fade out slowly */
@keyframes rushInOut {
  0% { opacity: 0; transform: translateX(30%); }
  12% { opacity: 1; transform: translateX(0); }   /* quick entrance */
  70% { opacity: 1; transform: translateX(0); }   /* visible */
  100% { opacity: 0; transform: translateX(-20%);}/* slow fade/slide out */
}

/* Hero / About split */
.about-container {
  background: url("/images/banner.jpg") no-repeat center center/cover;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  align-items: center;
  margin: 30px;
}
.about-text {
  flex: 1;
  min-width: 280px;
}
.about-text h2 {
  font-size: 2.2rem;
  margin-bottom: 20px;
  color: #222;
}
.about-text p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 15px;
  color: #333;
}
.cta-buttons {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.cta-buttons button {
  background: #ff6600;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
}
.cta-buttons button:hover {
  background: #cc5200;
}
.about-image {
  flex: 1;
  text-align: center;
}
.about-image img {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* --- Filters --- */
.filters {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}
.search-bar input {
  padding: 8px;
  border: 1px solid #ccc;
}
.search-bar button {
  padding: 8px 15px;
  margin-left: 5px;
  background: #ffcc00;
  border: none;
  cursor: pointer;
}
.filter-options select {
  padding: 8px;
}

/* --- Products --- */
.products {
  padding: 30px;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
.product-card {
  border: 1px solid #ddd;
  padding: 15px;
  text-align: center;
  border-radius: 8px;
}
.product-card img {
  max-width: 100%;
  height: 150px;
  object-fit: cover;
}
.product-card .price {
  display: block;
  margin: 10px 0;
  font-weight: bold;
}
.product-card button {
  background: #ffcc00;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

/* --- Footer --- */
.footer {
  background: rgba(0,0,0,0.9);
  color: #ddd;
  padding: 50px 20px 20px;
  margin: 50px;
}
.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
  padding: 20px;
}
.footer-logo {
  height: 70px;
  margin-bottom: 15px;
}
.footer h3 {
  color: #ffcc00;
  margin-bottom: 12px;
  font-size: 1.2rem;
}
.footer p {
  margin-bottom: 10px;
  font-size: 0.95rem;
  line-height: 1.5;
}
.contact-list {
  list-style: none;
  padding: 0;
}
.contact-list li {
  margin: 8px 0;
  font-size: 0.9rem;
}
.contact-list i {
  color: #ff6600;
  margin-right: 8px;
}
.footer ul {
  list-style: none;
  padding: 0;
}
.footer ul li {
  margin: 6px 0;
}
.footer ul li a {
  color: #ddd;
  text-decoration: none;
  transition: color 0.3s;
}
.footer ul li a:hover {
  color: #ff6600;
}
.social-icons {
  display: flex;
  gap: 12px;
}
.social-icons a {
  color: #ddd;
  font-size: 1.6rem;
  transition: color 0.3s, transform 0.2s;
}
.social-icons a:hover {
  color: #ff6600;
  transform: scale(1.1);
}
.footer-bottom {
  border-top: 1px solid #444;
  margin-top: 30px;
  padding-top: 15px;
  text-align: center;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.back-to-top {
  color: #ffcc00;
  text-decoration: none;
  font-size: 0.9rem;
}
.back-to-top:hover {
  color: #ff6600;
}
</style>
