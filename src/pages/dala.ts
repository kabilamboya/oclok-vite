<template>
  <div class="home">
      <!-- Header -->
      <header class="header">
        <div class="header-container">
          <img src="/images/oclokLogo.png" alt="O!clok Store Logo" class="logo" />
          <h1>O!clok Store</h1>
        </div>
      </header>

    <!-- Hero / About Section -->
    <section class="about">
      <div class="about-container">
        <!-- Text -->
        <div class="about-text">
          <h2>About O!clok Store</h2>
          <p>
            At <strong>O!clok Store</strong>, our mission is to make quality products and reliable services accessible to everyone, right on time. 
            We value <strong>trust, innovation, and customer-first service</strong> — ensuring every purchase feels simple, secure, and satisfying. 
          </p>
          <p>
            What makes us unique is our blend of <em>modern e-commerce convenience</em> with a <em>personal touch</em>: curated products, responsive support, 
            and a commitment to building lasting relationships with our customers.
          </p>

          <!-- CTA Buttons -->
          <div class="cta-buttons">
            <button @click="$router.push('/products')">Shop Now</button>
            <button @click="$router.push('/technicians')">Book a Technician</button>
            <button @click="$router.push('/services')">Explore Services</button>
          </div>
        </div>

        <!-- Image -->
        <div class="about-image">
          <img src="/images/dummy-pic.jpg" alt="O!clok Store Team" />
        </div>
      </div>
    </section>

    <!-- Carousel Section -->
    <section class="carousel">
      <div class="slides" :style="{ transform: slideTransform }">
        <div class="slide" v-for="(banner, index) in banners" :key="index">
          <img :src="banner" alt="Banner" />
        </div>
      </div>
      <button class="prev" @click="prevSlide">‹</button>
      <button class="next" @click="nextSlide">›</button>
    </section>

    <!-- Dashboard Stats -->
    <section class="stats">
      <div class="stat-card">
        <h2>{{ stats.orders }}</h2>
        <p>Completed Orders</p>
      </div>
      <div class="stat-card">
        <h2>{{ stats.clients }}</h2>
        <p>Satisfied Clients</p>
      </div>
      <div class="stat-card">
        <h2>{{ stats.products }}</h2>
        <p>New Products</p>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials">
      <h2>What Our Clients Say</h2>
      <div class="testimonial-slider">
        <div
          class="testimonial-card"
          v-for="(t, index) in testimonials"
          :key="index"
          v-show="currentTestimonial === index"
        >
          <p class="message">“{{ t.message }}”</p>
          <h4 class="author">— {{ t.author }}</h4>
        </div>
      </div>
      <div class="controls">
        <button @click="prevTestimonial">‹</button>
        <button @click="nextTestimonial">›</button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-grid">
        <div>
          <h3>O!clok Mediam</h3>
          <img src="/images/ocLoGo.png" alt="O!clok Store Logo" class="footer-logo" />
          <p>Your trusted hub for quality products & services.</p>
          <p><strong>📍 Location:</strong> Kisumu, Kenya</p>
          <p><strong>📞 Phone:</strong> +254 732 379 292</p>
          <p><strong>✉️ Email:</strong> clokmediam@gmail.com</p>
        </div>

        <div>
          <h3>Resources</h3>
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
            <li><a href="#">How do I place an order?</a></li>
            <li><a href="#">What payment methods are supported?</a></li>
            <li><a href="#">How do I track my delivery?</a></li>
            <li><a href="#">Do you offer returns/refunds?</a></li>
          </ul>
        </div>

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
      <p class="footer-bottom">© 2025 O!clok Store — All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      currentSlide: 0,
      visibleSlides: 3,
      banners: [
        "/images/banner 1.png",
        "/images/banner 2.jpeg",
        "/images/banner 3.jpg",
      ],
      stats: {
        orders: 1250,
        clients: 980,
        products: 45,
      },
      testimonials: [
        { message: "O!clok Store made my shopping seamless. Highly recommend!", author: "Grace K." },
        { message: "Fast delivery and excellent customer service.", author: "James M." },
        { message: "The products are genuine and fairly priced. Great experience!", author: "Sophia L." },
      ],
      currentTestimonial: 0,
    };
  },
  methods: {
    nextSlide() {
      this.currentSlide++;
      if (this.currentSlide > this.banners.length - this.visibleSlides) {
        this.currentSlide = 0;
      }
    },
    prevSlide() {
      this.currentSlide--;
      if (this.currentSlide < 0) {
        this.currentSlide = this.banners.length - this.visibleSlides;
      }
    },
    nextTestimonial() {
      this.currentTestimonial =
        (this.currentTestimonial + 1) % this.testimonials.length;
    },
    prevTestimonial() {
      this.currentTestimonial =
        (this.currentTestimonial - 1 + this.testimonials.length) %
        this.testimonials.length;
    },
  },
  computed: {
    slideTransform() {
      return `translateX(-${(this.currentSlide * 100) / this.visibleSlides}%)`;
    },
  },
  mounted() {
    setInterval(this.nextSlide, 5000);
    setInterval(this.nextTestimonial, 7000);
  },
};
</script>

<style scoped>
.home {
  position: relative;
  min-height: 100vh;
  background: url('/images/bg.jpg') no-repeat center center/cover;
  padding: 40px 20px;
}
.home::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
}
.home section {
  position: relative;
  z-index: 1;
  margin: 40px auto;
  max-width: 1200px;
  padding: 40px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}

/* Hero / About split */
.about-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  align-items: center;
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

/* Carousel */
.carousel {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  height: 33vh;
  max-height: 300px;
  padding: 0;
}
.slides {
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 100%;
}
.slide {
  flex: 0 0 calc(100% / 3);
  max-width: calc(100% / 3);
}
.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.prev, .next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: 5px 12px;
  z-index: 10;
}
.prev { left: 10px; }
.next { right: 10px; }

/* Stats */
.stats {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  text-align: center;
}
.stat-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 200px;
}
.stat-card h2 {
  font-size: 2rem;
  color: #ff6600;
}

/* Testimonials */
.testimonials {
  text-align: center;
}
.testimonials h2 {
  font-size: 2rem;
  margin-bottom: 30px;
  color: #222;
}
.testimonial-card {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.message {
  font-style: italic;
  color: #555;
}
.author {
  font-weight: bold;
  color: #ff6600;
}
.controls {
  margin-top: 20px;
}
.controls button {
  background: #ff6600;
  color: white;
  border: none;
  padding: 8px 14px;
  margin: 0 5px;
  border-radius: 50%;
  cursor: pointer;
}
.controls button:hover {
  background: #cc5200;
}

/* Footer */
.footer {
  background: rgba(0,0,0,0.85);
  color: #ddd;
  padding: 40px 20px;
  margin-top: 50px;
  border-radius: 0;
}
.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
.footer h3 {
  color: #ffcc00;
  margin-bottom: 10px;
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
}
.footer ul li a:hover {
  color: #ff6600;
}
.social-icons {
  display: flex;
  gap: 10px;
}
.social-icons a {
  color: #ddd;
  font-size: 1.5rem;
}
.social-icons a:hover {
  color: #ff6600;
}
.footer-bottom {
  text-align: center;
  margin-top: 30px;
  font-size: 0.9rem;
  border-top: 1px solid #444;
  padding-top: 10px;
}
.header {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(0,0,0,0.7);
  padding: 15px 30px;
  border-radius: 12px;
  margin-bottom: 30px;
}
.header-container {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo {
  height: 50px;
  width: auto;
  border-radius: 8px;
}
.header h1 {
  color: #fff;
  font-size: 1.6rem;
}
.footer-logo {
  height: 60px;
  margin-bottom: 15px;
}
</style>
