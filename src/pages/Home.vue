<template>
  <div class="page">
    <!-- Header -->
    <header class="header">
      <div class="header-container">
        <img src="/images/oclokLogo.png" alt="O!clok Store Logo" class="logo" />
        <h1>Welcome to <strong> O!clok Media ltd </strong></h1>
        <p ref="animatedText" class="animated-text play">{{ currentPhrase }}</p>
      </div>
    </header>

      <!-- Tabs -->
          <div class="tabs">
            <button :class="{ active: activeTab==='about' }" @click="activeTab='about'">About Us</button>
            <button :class="{ active: activeTab==='mission' }" @click="activeTab='mission'">Our Mission</button>
            <button :class="{ active: activeTab==='vision' }" @click="activeTab='vision'">Our Vision</button>
          </div>

    <!-- Hero / About Tabs Section -->
    <section class="about">
      <div class="about-container">
        <!-- Left Image -->
        <div class="about-image">
          <img src="/images/45.jpg" alt="O!clok Store Team" />
        </div>

        <!-- Right Tab Content -->
        <div class="about-text">
          <!-- Tab Panels -->
          <div class="tab-panels">
            <div v-show="activeTab==='about'" class="tab-content animate-on-scroll">
              <h2>About Us</h2>
              <p>
                At <strong>O!clok Media</strong>, we combine <em>modern e-commerce convenience</em> with a <em>personal touch</em>: curated products, responsive support, 
                and a commitment to building lasting relationships with our customers.
                </p>
                <p>
                We provide <strong>value, essence, and convenience</strong>.
              </p>
            </div>

            <div v-show="activeTab==='mission'" class="tab-content animate-on-scroll">
              <h2>Our Mission</h2>
              <p>
              To make quality products and reliable services accessible to everyone, right on time. 
              </p>
              <p>
              To provide exceptional service and innovative solutions that empower our customers to live smarter and more conveniently.
              </p>
            </div>

            <div v-show="activeTab==='vision'" class="tab-content animate-on-scroll">
              <h2>Our Vision</h2>
              <p>
                To be the leading hub for products and services that connect technology and lifestyle in Kenya and beyond.
              </p>
            </div>
          </div>

          <!-- Social Icons -->
          <div class="social-icons animate-on-scroll">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-linkedin-in"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
          </div>
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
          class="product-card animate-on-scroll"
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
        <div class="footer-brand">
          <div class="footer-resources-section">
          <img src="/images/ocLoGo.png" alt="O!clok Store Logo" class="footer-logo" />
            <h3>Resources</h3>
          </div>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">User Guide</a></li>
            <li><a href="#">Community Forum</a></li>
            <li><a href="#">Partner Program</a></li>
          </ul>
        </div>
        <div>
  <h3>FAQs</h3>
  <ul>
    <li><router-link :to="{ path: '/faq', hash: '#order' }">How do I place an order?</router-link></li>
    <li><router-link :to="{ path: '/faq', hash: '#payment' }">What payment methods are supported?</router-link></li>
    <li><router-link :to="{ path: '/faq', hash: '#delivery' }">How do I track my delivery?</router-link></li>
    <li><router-link :to="{ path: '/faq', hash: '#technician' }">Where can I get a reliable technician?</router-link></li>
    <li><router-link :to="{ path: '/faq', hash: '#returns' }">Do you offer returns/refunds?</router-link></li>
  </ul>
</div>

        <div>
          <h3>Follow Us</h3>
          <div class="social-icons">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-linkedin-in"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
          </div>
          <ul class="contact-list">
            <li><i class="fas fa-map-marker-alt"></i> Kisumu, Kenya</li>
            <li><i class="fas fa-phone-alt"></i> +254 732 379 292</li>
            <li><i class="fas fa-envelope"></i> info@clokmediam@gmail.com</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 O!clok Mediam — All Rights Reserved.</p>
        <a href="#" class="back-to-top">↑ Back to Top</a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'about',
      searchQuery: "",
      selectedCategory: "",
      categories: ["Electronics", "Home", "Fashion"],
      products: [
        { id: 1, title: "Smartphone", description: "Latest model with powerful features.", price: 30000, category: "Electronics", image: "/images/smartphone.jpg" },
        { id: 2, title: "Smart Watch", description: "Track your fitness and stay connected.", price: 8000, category: "Electronics", image: "/images/smartwatch.jpg" },
        { id: 3, title: "Sofa Set", description: "Comfortable and stylish living room set.", price: 50000, category: "Home", image: "/images/sofaset.jpg" },
      ],
      phrases: [
        "Your trusted hub for quality products & services.",
        "Empower smart living through innovations",
        "Connecting technology with your lifestyle.",
        "Make a smart choice now for a brighter tomorrow"
      ],
      phraseIndex: 0,
      currentPhrase: "Empowering smart living through innovation",
      _phraseTimer: null,
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchCategory = this.selectedCategory ? p.category === this.selectedCategory : true;
        return matchSearch && matchCategory;
      });
    },
  },
  methods: {
    searchProducts() { console.log("Searching for:", this.searchQuery); },
    addToCart(product) { alert(`${product.title} added to cart!`); },
    _playOnce() {
      const el = this.$refs.animatedText;
      if (!el) return;
      el.classList.remove("play");
      void el.offsetWidth;
      el.classList.add("play");
    },
    _nextPhrase() {
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      this.currentPhrase = this.phrases[this.phraseIndex];
      this._playOnce();
    },
    handleScroll() {
      const elements = document.querySelectorAll(".animate-on-scroll");
      const triggerBottom = window.innerHeight * 0.85;
      elements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if(top < triggerBottom) el.classList.add("show");
      });
    }
  },
  mounted() {
    this._playOnce();
    this._phraseTimer = setInterval(this._nextPhrase, 4000);
    window.addEventListener("scroll", this.handleScroll);
    this.handleScroll(); // initial check
  },
  beforeDestroy() { if(this._phraseTimer) clearInterval(this._phraseTimer); },
  beforeUnmount() { if(this._phraseTimer) clearInterval(this._phraseTimer); }
};
</script>

<style scoped>
.logo { width:56px; }
.header-container h1 { margin:10; font-size:2rem; color:#000000; }
.animated-text.play { animation: rushInOut 4s ease-in-out forwards; }
@keyframes rushInOut { 0%{opacity:0;transform:translateX(30%);}12%{opacity:1;transform:translateX(0);}70%{opacity:1;transform:translateX(0);}100%{opacity:0;transform:translateX(-20%);} }


/* Container with moving background */
.header-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px;
  padding: 10px;
  background: url('/images/oclokBg.jpg') repeat-x; /* Replace with your bg */
  background-size: cover;
  animation: moveBackground 10s linear infinite;
}

/* Animated text moving right */
.animated-text {
  background: rgba(255, 102, 0, 0.8);
  margin-left: 20px;
  font-size: 1.5rem;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: clip;
  color: #fff;
  padding: 10px;
  animation: moveText 10s linear infinite;
}

/* Keyframes for background moving left */
@keyframes moveBackground {
  0% { background-position-x: 0; }
  100% { background-position-x: -1000px; } /* adjust based on image width */
}

/* Keyframes for text moving right */
@keyframes moveText {
  0% { transform: translateX(-100%); opacity: 0; }
  10% { opacity: 1; }
  50% { transform: translateX(50%); opacity: 1; }
  100% { transform: translateX(-100%); opacity: 0; }
}


/* --- About Tabs --- */
/* About Section */
.about {
  padding: 20px 10px; /* reduce top/bottom padding */
}

.about-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;         /* reduce gap between image & text */
  align-items: flex-start; /* align top */
  padding: 15px;     /* less padding */
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.about-image {
  flex: 1;
  text-align: left;
}

.about-image img {
  max-width: 100%;
  border-radius: 12px;
  display: block;
}

.about-text {
  flex: 1;
  padding: 10px 15px;  /* reduce padding */
  text-align: left;    /* optional, cleaner layout */
}

.tab-content h2 {
  margin: 0 0 10px 0;   /* reduce top/bottom margin */
  font-size: 1.5rem;    /* slightly smaller */
}

.tab-content p {
  margin: 5px 0;        /* tighter spacing */
  line-height: 1.4;     /* slightly compact */
}

/* Social Icons */
.social-icons {
  display: flex;
  padding-top: 20px;
  margin-top: 10px;      /* reduce extra spacing */
  justify-content: flex-start;
  gap: 10px;
}

.tabs { display:flex; gap:10px; justify-content:flex-end; margin-right:100px; margin-bottom:20px; }
.tabs button { background:#ffcc99; border:none; padding:10px 18px; border-radius:6px; cursor:pointer; font-weight:bold; transition: background 0.3s; }
.tabs button.active, .tabs button:hover { background:#ff6600; color:#fff; }
.tab-content { transition: all 0.6s ease; opacity:0; transform:translateX(40px); }
.tab-content.show { opacity:1; transform:translateX(0); }
.animate-on-scroll { opacity:0; transform:translateY(30px); transition: all 0.8s ease-out; }
.animate-on-scroll.show { opacity:1; transform:translateY(0); }
.social-icons a { color:#fff; background:#ff6600; width:40px; height:40px; display:flex; justify-content:center; align-items:center; border-radius:50%; font-size:1.2rem; transition: transform 0.2s, background 0.3s; }
.social-icons a:hover { transform:scale(1.2); background:#cc5200; color:#fff; }

/* --- Products & Filters --- */
.filters { display:flex; justify-content:space-between; padding:20px; }
.search-bar input, .filter-options select { padding:8px; margin-right:8px; }
.products { padding:30px; }
.product-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px; }
.product-card { border:1px solid #ddd; border-radius:10px; padding:15px; text-align:center; transition:all 0.3s; background:#fff; }
.product-card:hover { transform:scale(1.03); box-shadow:0 6px 18px rgba(0,0,0,0.1); }
.product-card img { max-width:100%; height:150px; object-fit:cover; }
.price { font-weight:bold; display:block; margin:10px 0; }
.product-card button { background:#ffcc00; border:none; padding:8px 12px; cursor:pointer; border-radius:4px; }
.product-card button:hover { background:#ff9900; }

/* --- Footer --- */
.footer { background:#222; color:#ddd; padding:50px 20px; }
.footer-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:30px; }
.footer-logo { height:70px; margin-bottom:15px; }
.footer h3 { color:#ff6600; margin-bottom:12px; font-size:1.2rem; }
.footer-resources-section { display: flex; align-items: center; gap: 10px; }
.contact-list li i { color:#ff6600; margin-right:8px; }
.footer ul li a { color:#ddd; text-decoration:none; transition:0.3s; }
.footer ul li a:hover { color:#ff6600; }
.footer-bottom { border-top:1px solid #444; margin-top:30px; padding-top:15px; text-align:center; font-size:0.9rem; display:flex; justify-content:space-between; flex-wrap:wrap; }
.back-to-top { color:#ffcc00; text-decoration:none; }
.back-to-top:hover { color:#ff6600; }

/* --- Responsive --- */
@media(max-width:768px){.about-container{flex-direction:column;text-align:center;}.about-text{text-align:center;}.social-icons{justify-content:center;}}
</style>
