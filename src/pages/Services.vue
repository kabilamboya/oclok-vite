<template>
  <div class="services-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay">
        <h1 class="hero-title">Our Services</h1>
        <p class="hero-subtitle">Smart solutions, creative design, and innovation for you.</p>
      </div>
    </section>

    <!-- Services Sections -->
    <section
      v-for="(service, index) in services"
      :key="service.id"
      class="service-section"
      :class="{ 'reverse': index % 2 !== 0 }"
    >
      <!-- Image Side -->
      <div class="service-image">
        <img :src="service.image" :alt="service.title" />
      </div>

      <!-- Text Side -->
      <div class="service-content">
        <i :class="['fas', service.icon]" :style="{ color: service.color }"></i>
        <h2>{{ service.title }}</h2>
        <h4>{{ service.category }}</h4>
        <p>{{ service.description }}</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="/images/ocLoGo.png" alt="O!clok Store Logo" class="footer-logo" />
          <ul class="contact-list">
            <li><i class="fas fa-map-marker-alt"></i> Kisumu, Kenya</li>
            <li><i class="fas fa-phone-alt"></i> +254 732 379 292</li>
            <li><i class="fas fa-envelope"></i> info@clokmediam@gmail.com</li>
          </ul>
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
            <li><a href="#">Where can I get a reliable technician?</a></li>
            <li><a href="#">Do you offer returns/refunds?</a></li>
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
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 O!clok Store — All Rights Reserved.</p>
        <a href="#" class="back-to-top">↑ Back to Top</a>
      </div>
    </footer>
  </div>
</template>

<script>
// import services from "@/data/services.json"; or fetch if in public
const services = await fetch("/services.json").then(res => res.json());

export default {
  name: "ServicesPage",
  data() {
    return {
      services
    };
  }
};
</script>

<style scoped>
/* Hero background */
.hero {
  background: url('/images/hero-bg.jpg') center/cover no-repeat;
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.hero-overlay {
  background: rgba(25, 182, 130, 0.6);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  color: #d827acff;
}
.hero-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}
.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Side-by-side service layout */
.service-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin: 3rem 0;
  padding: 2rem;
}

.service-section.reverse {
  flex-direction: row-reverse;
}

/* Image side */
.service-image {
  flex: 1;
  display: flex;
  justify-content: center;
}
.service-image img {
  max-width: 100%;
  border-radius: 12px;
  object-fit: cover;
}

/* Text side */
.service-content {
  flex: 1;
  text-align: center;
}
.service-content i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.service-content h2 {
  margin: 0.5rem 0;
  font-size: 1.8rem;
}
.service-content h4 {
  margin: 0.3rem 0;
  font-weight: 500;
  color: #666;
}
.service-content p {
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.5;
}

/* Mobile stacking */
@media (max-width: 768px) {
  .service-section,
  .service-section.reverse {
    flex-direction: column;
    text-align: center;
  }
  .service-image,
  .service-content {
    flex: none;
    width: 100%;
  }
}

/* Footer Styling */
.footer {
  margin-top: 3rem;
  padding: 2rem;
  background: #f8f8f8;
  color: #333;
}
.footer-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}
.footer-col h3 {
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
}
.footer-col ul {
  list-style: none;
  padding: 0;
}
.footer-col ul li {
  margin-bottom: 0.5rem;
  cursor: pointer;
}
.footer-col ul li:hover {
  text-decoration: underline;
}
.payment-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.payment-icons img {
  height: 30px;
  object-fit: contain;
}
.footer-bottom {
  border-top: 1px solid #ccc;
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.social-icons i {
  margin-right: 10px;
  font-size: 1.2rem;
  cursor: pointer;
}

/* --- Footer --- */
.footer { background:#222; color:#ddd; padding:50px 20px; }
.footer-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:30px; }
.footer-logo { height:70px; margin-bottom:15px; }
.footer h3 { color:#ff6600; margin-bottom:12px; font-size:1.2rem; }
.contact-list li i { color:#ff6600; margin-right:8px; }
.footer ul li a { color:#ddd; text-decoration:none; transition:0.3s; }
.footer ul li a:hover { color:#ff6600; }
.footer-bottom { border-top:1px solid #444; margin-top:30px; padding-top:15px; text-align:center; font-size:0.9rem; display:flex; justify-content:space-between; flex-wrap:wrap; }
.back-to-top { color:#ffcc00; text-decoration:none; }
.back-to-top:hover { color:#ff6600; }

/* --- Responsive --- */
@media(max-width:768px){.about-container{flex-direction:column;text-align:center;}.about-text{text-align:center;}.social-icons{justify-content:center;}}
</style>
