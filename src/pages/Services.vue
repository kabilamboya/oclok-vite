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
      <!-- ... footer content stays same ... -->
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
  height: 50vh;
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
</style>
